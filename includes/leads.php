<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Lead capture for the Google Ads landing pages.
//
//  LEAD_FORMS is the single definition of each form: the landing pages render
//  their <select> options from it and lead.php validates against it.
//  Leads are stored in storage/leads.sqlite (denied to the web by
//  storage/.htaccess) and emailed to LEAD_NOTIFY.
// ═══════════════════════════════════════════════════════════════════════════

require_once __DIR__ . '/config.php';

const LEAD_DB = __DIR__ . '/../storage/leads.sqlite';
const LEAD_MIN_SECONDS = 3;       // faster than this is a bot
const LEAD_MAX_AGE = 86400;       // form token lifetime
const LEAD_RATE_LIMIT = 5;        // submissions per IP …
const LEAD_RATE_WINDOW = 600;     // … per this many seconds

const LEAD_ATTRIBUTION = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];

const LEAD_FORMS = [
    'infrastructure' => [
        'label' => 'Infrastructure quote',
        'page' => 'infrastructure-oman.php',
        'anchor' => 'quote',
        'services' => [
            'linux-vm' => 'Linux VM',
            'windows-vm' => 'Windows VM',
            'gpu-server' => 'GPU Server',
            'colocation' => 'Colocation',
        ],
        // name => [label, required, max length, type]
        'fields' => [
            'name' => ['Full Name', true, 120, 'text'],
            'company' => ['Company Name', true, 160, 'text'],
            'email' => ['Business Email', true, 190, 'email'],
            'phone' => ['Phone Number', true, 40, 'phone'],
            'service' => ['Required Service', true, 40, 'service'],
            'message' => ['Requirements', false, 3000, 'text'],
        ],
    ],
    'domain' => [
        'label' => 'Domain enquiry',
        'page' => 'domain-registration-oman.php',
        'anchor' => 'enquiry',
        'services' => [
            'registration' => 'New Registration',
            'renewal' => 'Renewal',
            'transfer' => 'Transfer',
            'dns' => 'DNS Management',
        ],
        'fields' => [
            'domain' => ['Domain Name', true, 253, 'domain'],
            'service' => ['Required Service', true, 40, 'service'],
            'name' => ['Full Name', true, 120, 'text'],
            'email' => ['Email Address', true, 190, 'email'],
            'phone' => ['Phone Number', true, 40, 'phone'],
            'company' => ['Company Name', false, 160, 'text'],
            'message' => ['Notes', false, 3000, 'text'],
        ],
    ],
];

// ─── Form token ────────────────────────────────────────────────────────────
// A signed render timestamp: proves the form came from our page and lets the
// handler reject instant (bot) and stale submissions without a session.

function lead_secret()
{
    $file = __DIR__ . '/../storage/.secret';
    if (!is_file($file)) {
        lead_storage_ready();
        file_put_contents($file, bin2hex(random_bytes(32)), LOCK_EX);
    }
    return trim(file_get_contents($file));
}

function lead_token()
{
    $t = (string) time();
    return $t . '.' . hash_hmac('sha256', $t, lead_secret());
}

// Returns null when the token is fine, or a reason string.
function lead_token_problem($token)
{
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', (string) $token, $m)) {
        return 'bad token';
    }
    if (!hash_equals(hash_hmac('sha256', $m[1], lead_secret()), $m[2])) {
        return 'bad signature';
    }
    $age = time() - (int) $m[1];
    if ($age < LEAD_MIN_SECONDS) {
        return 'too fast';
    }
    if ($age > LEAD_MAX_AGE) {
        return 'expired';
    }
    return null;
}

// ─── Validation ────────────────────────────────────────────────────────────

function lead_clean($value, $max)
{
    $value = trim(str_replace("\0", '', (string) $value));
    return mb_substr($value, 0, $max);
}

// Returns [clean values, errors keyed by field name].
function lead_validate(array $form, array $input)
{
    $values = [];
    $errors = [];

    foreach ($form['fields'] as $name => [$label, $required, $max, $type]) {
        $v = lead_clean($input[$name] ?? '', $max);
        if ($type !== 'text') {
            $v = preg_replace('/\s+/', ' ', $v);
        }

        if ($v === '') {
            if ($required) {
                $errors[$name] = 'Please enter your ' . strtolower($label) . '.';
                if ($type === 'service') {
                    $errors[$name] = 'Please choose a service.';
                }
            }
            $values[$name] = '';
            continue;
        }

        switch ($type) {
            case 'email':
                if (!filter_var($v, FILTER_VALIDATE_EMAIL)) {
                    $errors[$name] = 'Please enter a valid email address.';
                }
                break;
            case 'phone':
                $digits = preg_replace('/\D/', '', $v);
                if (!preg_match('/^[+0-9 ()\-.]+$/', $v) || strlen($digits) < 7 || strlen($digits) > 15) {
                    $errors[$name] = 'Please enter a valid phone number.';
                }
                break;
            case 'service':
                if (!isset($form['services'][$v])) {
                    $errors[$name] = 'Please choose a service.';
                }
                break;
            case 'domain':
                $v = strtolower(preg_replace('#^(https?://)?(www\.)?#i', '', $v));
                $v = rtrim($v, '/.');
                if (!preg_match('/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/', $v)) {
                    $errors[$name] = 'Please enter a domain name, e.g. yourcompany.om.';
                }
                break;
        }
        $values[$name] = $v;
    }

    return [$values, $errors];
}

// ─── Storage ───────────────────────────────────────────────────────────────

function lead_storage_ready()
{
    $dir = dirname(LEAD_DB);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    if (!is_file($dir . '/.htaccess')) {
        file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
}

function lead_db()
{
    static $db = null;
    if ($db) {
        return $db;
    }
    lead_storage_ready();
    $db = new PDO('sqlite:' . LEAD_DB, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA busy_timeout = 3000');
    $db->exec('CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        form TEXT NOT NULL,
        service TEXT,
        name TEXT,
        company TEXT,
        email TEXT,
        phone TEXT,
        domain TEXT,
        message TEXT,
        landing_page TEXT,
        referrer TEXT,
        utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
        gclid TEXT, gbraid TEXT, wbraid TEXT,
        ip TEXT,
        user_agent TEXT,
        notified INTEGER NOT NULL DEFAULT 0
    )');
    return $db;
}

function lead_rate_limited($ip)
{
    $since = gmdate('Y-m-d H:i:s', time() - LEAD_RATE_WINDOW);
    $q = lead_db()->prepare('SELECT COUNT(*) FROM leads WHERE ip = ? AND created_at >= ?');
    $q->execute([$ip, $since]);
    return (int) $q->fetchColumn() >= LEAD_RATE_LIMIT;
}

function lead_store(array $row)
{
    $cols = array_keys($row);
    $sql = 'INSERT INTO leads (' . implode(', ', $cols) . ') VALUES (' . rtrim(str_repeat('?, ', count($cols)), ', ') . ')';
    lead_db()->prepare($sql)->execute(array_values($row));
    return (int) lead_db()->lastInsertId();
}

// ─── Notification ──────────────────────────────────────────────────────────

function lead_notify($id, array $form, array $values, array $row)
{
    $service = $form['services'][$values['service']] ?? $values['service'];
    $subject = $form['label'] . ': ' . $service;
    if (!empty($values['company'])) {
        $subject .= ' (' . $values['company'] . ')';
    } elseif (!empty($values['domain'])) {
        $subject .= ' (' . $values['domain'] . ')';
    }

    $lines = ['New ' . strtolower($form['label']) . ' from the Google Ads landing page.', ''];
    foreach ($form['fields'] as $name => [$label]) {
        $v = $name === 'service' ? $service : $values[$name];
        if ($v !== '') {
            $lines[] = $label . ': ' . $v;
        }
    }
    $lines[] = '';
    $lines[] = 'Lead #' . $id . ' · ' . $row['created_at'] . ' UTC';
    $lines[] = 'Landing page: ' . $row['landing_page'];
    foreach (LEAD_ATTRIBUTION as $key) {
        if (!empty($row[$key])) {
            $lines[] = $key . ': ' . $row[$key];
        }
    }

    // Header values come from validated input, but strip line breaks anyway.
    $nl = ["\r", "\n"];
    $headers = [
        'From: Cloud Acropolis Website <' . LEAD_FROM . '>',
        'Reply-To: ' . str_replace($nl, '', $values['name']) . ' <' . str_replace($nl, '', $values['email']) . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'MIME-Version: 1.0',
    ];
    $encoded = '=?UTF-8?B?' . base64_encode(str_replace($nl, ' ', $subject)) . '?=';

    return @mail(implode(', ', LEAD_NOTIFY), $encoded, implode("\n", $lines), implode("\r\n", $headers));
}
