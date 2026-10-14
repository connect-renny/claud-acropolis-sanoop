<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Site-wide settings and helpers, loaded by includes/head.php.
//
//  Each page sets a $page array before including head.php:
//    file         this page's file name, e.g. "linux-server.php"
//    section      top-level nav item: home | services | partner | contact
//    title        <title> and og:title
//    description  meta description (og:description falls back to it)
//    og_description, image (og:image, relative to assets/images/)
// ═══════════════════════════════════════════════════════════════════════════

const CONTACT_EMAIL = 'info@cloudacropolis.om';
const CLIENT_AREA   = 'https://my.cloudacropolis.om/clientarea.php';
const MANAGED_SECURITY = 'https://my.cloudacropolis.om/index.php?rp=/store/managed-security';

// The "Our Services" menu: desktop mega menu and mobile list share it.
const SERVICE_MENU = [
    'Infrastructure' => [
        ['Linux Cloud Server', 'linux-server.php'],
        ['Windows Cloud Server', 'windows-server.php'],
        ['Colocation', 'colocation.php'],
        ['GPU as a Service', 'gpu.php'],
    ],
    'SaaS Solutions' => [
        ['Cloud PBX', 'cloud-pbx.php'],
        ['Email Hosting', 'email-hosting-plan.php'],
        ['OSOS ERP SME', 'osos-erp-sme.php'],
        ['OSOS ERP Enterprise', 'erp-enterprise.php'],
        ['InterCom', 'intercom.php'],
    ],
    'Bundles' => [
        ['SME Starter', 'business-bundle.php'],
        ['Business Grow', 'business-bundle.php'],
        ['Professional', 'business-bundle.php'],
    ],
    'Security Services' => [
        ['SSL Certificates', 'ssl-certificates.php'],
        ['Managed Security', MANAGED_SECURITY],
        ['Managed Network Security', MANAGED_SECURITY],
    ],
];

$page += [
    'file' => basename($_SERVER['SCRIPT_NAME']),
    'section' => 'services',
    'description' => '',
    'image' => 'hero-slider-02.jpg',
];
$page += ['og_description' => $page['description']];

function e($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

// ' aria-current="page"' when $href is the page being rendered.
function current_attr($href)
{
    global $page;
    return $href === $page['file'] ? ' aria-current="page"' : '';
}

// Home-page anchors ("#faq") stay in-page on the home page and point back
// to it from everywhere else.
function home_anchor($id)
{
    global $page;
    return ($page['section'] === 'home' ? '' : 'index.php') . '#' . $id;
}
