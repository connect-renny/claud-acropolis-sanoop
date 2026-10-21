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
//    canonical    path under SITE_URL, e.g. "infrastructure-oman" (optional)
//    robots       robots meta, e.g. "noindex" (optional)
//    landing      true on the Google Ads landing pages: loads GTM
// ═══════════════════════════════════════════════════════════════════════════

const CONTACT_EMAIL = 'info@cloudacropolis.om';
const CLIENT_AREA   = 'https://my.cloudacropolis.om/clientarea.php';
const MANAGED_SECURITY = 'https://my.cloudacropolis.om/index.php?rp=/store/managed-security';

// Contact details shown on the landing pages.
const PHONE_DISPLAY = '+968 9239 4675';
const PHONE_TEL = '+96892394675';
const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=96892394675';

// ─── Google Ads landing pages (infrastructure-oman.php, domain-registration-oman.php)
// Absolute base for canonical URLs.
const SITE_URL = 'https://cloudacropolis.om/';
// Google Tag Manager container, e.g. 'GTM-ABC1234'. Empty = no tag loaded.
const GTM_ID = '';
// TODO: point at the real privacy policy once it is published.
const PRIVACY_URL = '#';
// Where the domain search box checks availability (WHMCS cart). Empty = the
// search box hands the name to the enquiry form instead.
const DOMAIN_SEARCH_URL = 'https://my.cloudacropolis.om/cart.php';
// Who receives lead notifications (confirm recipients with the client).
const LEAD_NOTIFY = ['info@cloudacropolis.om'];
const LEAD_FROM = 'no-reply@cloudacropolis.om';

// The "Our Services" menu: desktop mega menu and mobile list share it.
const SERVICE_MENU = [
    'Infrastructure' => [
        ['Domain Registration', 'domain-registration.php'],
        ['Linux Cloud Server', 'linux-server.php'],
        ['Windows Cloud Server', 'windows-server.php'],
        ['Colocation', 'colocation.php'],
        ['GPU as a Service', 'gpu.php'],
    ],
    'SaaS Solutions' => [
        ['Cloud PBX', 'cloud-pbx.php'],
        ['Email Hosting', 'email-hosting-plan.php'],
        ['OSOS ERP SME', 'osos-erp-sme.php'],
        ['OSOS POS', 'osos-pos.php'],
        ['OSOS ERP Enterprise', 'erp-enterprise.php'],
        ['HRMS', 'hrms.php'],
        ['QHSE', 'qhse.php'],
        ['InterCom', 'intercom.php'],
        ['Call Center', 'call-center.php'],
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

// lead.php loads this without a $page of its own.
$page = ($page ?? []) + [
    'file' => basename($_SERVER['SCRIPT_NAME']),
    'section' => 'services',
    'description' => '',
    'image' => 'hero-slider-02.jpg',
    'canonical' => null,
    'robots' => null,
    'landing' => false,
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
