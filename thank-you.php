<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Thank-you page for the landing-page forms. lead.php redirects here.
//
//  The conversion event is pushed to the dataLayer only when lead.php has
//  just stored a lead in this session, and the flag is cleared as it fires,
//  so reloading or bookmarking this page never counts a second conversion.
//  GTM: trigger the GA4 / Google Ads conversion tags on event "generate_lead".
// ═══════════════════════════════════════════════════════════════════════════
$page = [
    'title' => 'Thank You | Cloud Acropolis',
    'description' => 'Your request has been received. The Cloud Acropolis team will be in touch shortly.',
    'robots' => 'noindex, nofollow',
    'landing' => true,
];
require 'includes/leads.php';

$for = isset(LEAD_FORMS[$_GET['for'] ?? '']) ? $_GET['for'] : 'infrastructure';
$form = LEAD_FORMS[$for];
$page['cta'] = [$form['page'], $for === 'domain' ? 'Back to Domains' : 'Back to Infrastructure'];

session_start();
$conversion = $_SESSION['lead_conversion'] ?? null;
unset($_SESSION['lead_conversion']);
if ($conversion && $conversion['form'] !== $for) {
    $conversion = null;
}

include 'includes/head.php';
require 'includes/lp-icons.php';
include 'includes/lp-header.php';

$copy = match ($for) {
    'domain' => ['Your domain enquiry is on its way', 'Thanks for getting in touch. Our domain team will review your request and contact you to confirm availability, eligibility and pricing.'],
    'callback' => ['We’ll call you back shortly', 'Thanks for getting in touch. A member of our infrastructure team will call you on the number you gave us to talk through your requirements.'],
    default => ['Your quote request is on its way', 'Thanks for getting in touch. Our infrastructure team will review your requirements and contact you to prepare your quotation.'],
};
?>

<main id="main" class="lp-page">
  <section class="section lp-thanks">
    <div class="container">
      <div class="lp-thanks-card">
        <span class="lp-thanks-icon" aria-hidden="true"><?= icon('check', 30, 2.4) ?></span>
        <p class="eyebrow center">Request received</p>
        <h1><?= e($copy[0]) ?></h1>
        <p class="lp-lead"><?= e($copy[1]) ?></p>
        <p class="lp-thanks-help">Need us sooner? Call <a href="tel:<?= PHONE_TEL ?>"><?= PHONE_DISPLAY ?></a> or <a href="<?= WHATSAPP_URL ?>" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
        <div class="lp-actions lp-actions--center">
          <a class="btn btn-primary" href="index.php">Visit cloudacropolis.om <span class="arrow">→</span></a>
          <a class="btn btn-outline" href="<?= e($form['page']) ?>"><?= e($page['cta'][1]) ?></a>
        </div>
      </div>
    </div>
  </section>
</main>

<?php if ($conversion): ?>
<script>
  window.dataLayer.push({
    event: "generate_lead",
    lead_form: <?= json_encode($conversion['form']) ?>,
    lead_service: <?= json_encode($conversion['service']) ?>,
    lead_id: <?= json_encode((string) $conversion['id']) ?>
  });
</script>
<?php endif; ?>

<?php include 'includes/lp-footer.php'; ?>
