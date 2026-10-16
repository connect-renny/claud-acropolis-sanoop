<?php
// ═══════════════════════════════════════════════════════════════════════════
//  POST endpoint for the landing-page forms (see includes/leads.php).
//
//  fetch() callers send Accept: application/json and get JSON back:
//    200 { ok: true, redirect }      422 { ok: false, errors, message }
//  Plain form posts (no JS) are redirected: to the thank-you page on success,
//  back to the form with ?lead_error=1 otherwise.
//
//  The conversion event is not fired here. The thank-you page fires it once,
//  from the session flag set below, so a refresh can't count a lead twice.
// ═══════════════════════════════════════════════════════════════════════════

require __DIR__ . '/includes/leads.php';

$wants_json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond($status, array $body, $redirect)
{
    global $wants_json;
    if ($wants_json) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($body);
    } else {
        header('Location: ' . $redirect, true, 303);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST', true, 405);
    exit;
}

$form_id = (string) ($_POST['form'] ?? '');
if (!isset(LEAD_FORMS[$form_id])) {
    http_response_code(400);
    exit;
}
$form = LEAD_FORMS[$form_id];
$back = $form['page'] . '?lead_error=1#' . $form['anchor'];
$generic = 'Sorry, we couldn\'t send your request. Please try again, or call us on ' . PHONE_DISPLAY . '.';

// Bots: honeypot filled or token missing/forged/too fast. Pretend it worked so
// they learn nothing, but store and send nothing.
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$bot = trim((string) ($_POST['website'] ?? '')) !== '' || lead_token_problem($_POST['_t'] ?? '') !== null;
if ($bot) {
    respond(200, ['ok' => true, 'redirect' => 'thank-you.php?for=' . $form_id], 'thank-you.php?for=' . $form_id);
}

[$values, $errors] = lead_validate($form, $_POST);
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors, 'message' => 'Please check the highlighted fields.'], $back);
}

try {
    if (lead_rate_limited($ip)) {
        respond(429, ['ok' => false, 'message' => 'You\'ve sent several requests already. Please call us on ' . PHONE_DISPLAY . ' and we\'ll help right away.'], $back);
    }

    $row = [
        'created_at' => gmdate('Y-m-d H:i:s'),
        'form' => $form_id,
        'service' => $values['service'],
        'name' => $values['name'],
        'company' => $values['company'] ?? '',
        'email' => $values['email'],
        'phone' => $values['phone'],
        'domain' => $values['domain'] ?? '',
        'message' => $values['message'] ?? '',
        'landing_page' => lead_clean($_POST['landing_page'] ?? $form['page'], 500),
        'referrer' => lead_clean($_POST['referrer'] ?? '', 500),
        'ip' => $ip,
        'user_agent' => lead_clean($_SERVER['HTTP_USER_AGENT'] ?? '', 300),
    ];
    foreach (LEAD_ATTRIBUTION as $key) {
        $row[$key] = lead_clean($_POST[$key] ?? '', 255);
    }

    $id = lead_store($row);
} catch (Throwable $e) {
    error_log('lead.php: could not store lead: ' . $e->getMessage());
    respond(500, ['ok' => false, 'message' => $generic], $back);
}

// The lead is safe in the database; a mail failure is logged, not shown.
if (lead_notify($id, $form, $values, $row)) {
    lead_db()->prepare('UPDATE leads SET notified = 1 WHERE id = ?')->execute([$id]);
} else {
    error_log('lead.php: notification email failed for lead #' . $id);
}

session_start();
$_SESSION['lead_conversion'] = [
    'id' => $id,
    'form' => $form_id,
    'service' => $values['service'],
];

$thanks = 'thank-you.php?for=' . $form_id;
respond(200, ['ok' => true, 'redirect' => $thanks], $thanks);
