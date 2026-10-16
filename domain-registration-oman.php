<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Google Ads landing page B — Domain Registration (/domain-registration-oman)
//  Conversion: domain enquiry (lead.php → thank-you.php). The hero search
//  checks availability in the WHMCS client area (DOMAIN_SEARCH_URL); this
//  page never claims a name is available itself.
//  Hand-written, not generated: build-services.mjs doesn't touch it.
// ═══════════════════════════════════════════════════════════════════════════
$page = [
    'title' => '.om Domain Registration Oman | Cloud Acropolis',
    'description' => 'Register and manage .om and international domain names with Cloud Acropolis. Enquire about registration, renewal and transfer.',
    'image' => 'oman-network.jpg',
    'canonical' => 'domain-registration-oman',
    'landing' => true,
    'cta' => ['#enquiry', 'Enquire Now'],
];
include 'includes/head.php';
require 'includes/lp-icons.php';
include 'includes/lp-header.php';

// Prices: show only confirmed figures. null = "Enquire for pricing".
// TODO: fill in once the client confirms per-extension pricing.
$omani = [
    ['.com.om', 'Commercial businesses', 'For companies trading in Oman.', null],
    ['.co.om', 'Companies', 'An alternative business address for Omani companies.', null],
    ['.net.om', 'Network providers', 'For internet and network service organizations.', null],
    ['.gov.om', 'Government', 'Reserved for Omani government entities.', null],
    ['.med.om', 'Healthcare', 'For hospitals, clinics and medical organizations.', null],
    ['.pro.om', 'Professionals', 'For licensed professionals and practices.', null],
    ['.museum.om', 'Museums', 'For museums and cultural institutions.', null],
];

$international = [
    ['.com', 'The world&rsquo;s most recognized extension — ideal for businesses with customers abroad.', null],
    ['.net', 'A trusted alternative for technology, network and online service brands.', null],
    ['.cloud', 'A modern name for cloud, SaaS and technology-led companies.', null],
    ['.info', 'Built for information sites, resources and knowledge portals.', null],
];

$services = [
    ['registration', 'plus', 'Registration', 'Register new Oman and international domains.'],
    ['renewal', 'refresh', 'Renewal', 'Renew existing domain names before they expire.'],
    ['transfer', 'transfer', 'Transfer', 'Transfer domain management to Cloud Acropolis.'],
    ['dns', 'sliders', 'DNS Management', 'Manage DNS records and domain configurations.'],
];

$faqs = [
    ['How do I register a .om domain?', 'Check availability above or send us the name you want through the enquiry form. Our team confirms eligibility, collects the required documents and completes the registration for you.'],
    // TODO: confirm documentation requirements per extension with the client.
    ['What documents do I need?', 'It depends on the extension. Business extensions such as .com.om usually require your Omani Commercial Registration and the registrant&rsquo;s contact details. We&rsquo;ll tell you exactly what&rsquo;s needed for the name you choose.'],
    ['Can I transfer my domain to Cloud Acropolis?', 'Yes. The domain needs to be unlocked at your current registrar, and international domains also need an authorization (EPP) code. Our team guides you through each step.'],
    ['Do you provide DNS management?', 'Yes. We manage your DNS records — A, CNAME, MX, TXT and more — so your website and email point to the right place.'],
    ['How do renewals work?', 'Renew through our team or the Cloud Acropolis client area before the expiry date to keep your name active. Get in touch if you&rsquo;d like help keeping track of renewal dates.'],
];

$price = fn($p) => $p === null
    ? '<span class="lp-tld-price lp-tld-price--enquire">Enquire for pricing</span>'
    : '<span class="lp-tld-price">OMR ' . e($p) . '<small>/year</small></span>';
?>

<main id="main" class="lp-page">

  <!-- ============ HERO + SEARCH ============ -->
  <section class="lp-hero lp-hero--domain" id="hero">
    <div class="container lp-hero-grid">
      <div class="lp-hero-copy">
        <p class="lp-kicker">Domain Registration &middot; Oman</p>
        <h1>Register Your <span class="text-gradient">.om Domain</span> with Cloud Acropolis</h1>
        <p class="lp-lead">Secure your business identity online with a trusted domain registration partner in Oman. Cloud Acropolis provides registration, renewal, transfer and DNS management services for Oman local domains and international extensions.</p>
        <ul class="lp-highlights">
          <!-- TODO: verify accreditation wording with the client before publishing. -->
          <li><?= icon('check', 16, 2.4) ?>TRA-Accredited Registrar</li>
          <li><?= icon('check', 16, 2.4) ?>.om &amp; International Domains</li>
          <li><?= icon('check', 16, 2.4) ?>Domain Management Services</li>
        </ul>
      </div>

      <div class="lp-search-card">
        <p class="eyebrow">Find your domain</p>
        <h2 class="lp-search-title">Is your name available?</h2>
<?php if (DOMAIN_SEARCH_URL): ?>
        <form class="domain-form" action="<?= e(DOMAIN_SEARCH_URL) ?>" method="get" target="_blank" role="search" data-domain-search>
          <input type="hidden" name="a" value="add">
          <input type="hidden" name="domain" value="register">
<?php else: ?>
        <form class="domain-form" action="#enquiry" method="get" role="search" data-domain-search>
<?php endif; ?>
          <label class="visually-hidden" for="domain-query">Domain name</label>
          <input class="ca-input" id="domain-query" name="query" type="text" placeholder="yourcompany.om" autocomplete="off" autocapitalize="off" spellcheck="false" required>
          <button class="btn btn-primary" type="submit"><?= icon('search', 18, 2) ?><span class="lp-search-btn-text">Check Domain Availability</span></button>
        </form>
        <p class="domain-hint"><?= DOMAIN_SEARCH_URL ? 'Availability is checked live in the Cloud Acropolis client area (opens in a new tab).' : 'Send us the name and our team will confirm availability.' ?></p>
        <ul class="lp-tld-chips" aria-label="Popular extensions">
          <li>.om</li><li>.com.om</li><li>.co.om</li><li>.com</li><li>.net</li><li>.cloud</li>
        </ul>
        <div class="lp-search-alt">
          <span>Need help choosing, or registering a restricted extension?</span>
          <a class="btn btn-outline" href="#enquiry" data-service="registration" data-carry-domain>Contact Our Domain Team <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ OMAN EXTENSIONS ============ -->
  <section class="section" id="oman-domains" data-screen="Oman domains">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Oman Domains</p>
          <h2 class="section-title">Establish Your Digital Identity in Oman</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">A local extension tells customers you&rsquo;re here, in Oman. Some extensions are limited to eligible organizations &mdash; we check before you register.</p>
        </div>
      </div>

      <div class="lp-tld-grid">
        <article class="lp-tld lp-tld--featured reveal">
          <div class="lp-tld-head">
            <span class="lp-tld-name">.om</span>
            <span class="lp-tld-tag">Oman&rsquo;s national domain</span>
          </div>
          <p>The clearest signal that your business is Omani. Short, memorable and recognized across the region.</p>
          <p class="lp-tld-note"><?= icon('shield', 16) ?>Registration requirements apply. Our team confirms eligibility and the documents you need.</p>
          <div class="lp-tld-foot">
            <?= $price(null) ?>
            <a class="btn btn-white" href="#enquiry" data-service="registration" data-domain-ext=".om">Enquire About .om <span class="arrow">→</span></a>
          </div>
        </article>
<?php foreach ($omani as $i => [$ext, $who, $text, $p]): ?>
        <article class="lp-tld reveal" style="--d:<?= ($i % 4) * 50 ?>ms">
          <div class="lp-tld-head">
            <span class="lp-tld-name"><?= e($ext) ?></span>
            <span class="lp-tld-tag"><?= e($who) ?></span>
          </div>
          <p><?= e($text) ?></p>
          <div class="lp-tld-foot">
            <?= $price($p) ?>
            <a class="card-link" href="#enquiry" data-service="registration" data-domain-ext="<?= e($ext) ?>">Enquire <span class="arrow">→</span></a>
          </div>
        </article>
<?php endforeach; ?>
      </div>
      <p class="lp-fine-print">Eligibility and documentation for each .om extension follow the registry&rsquo;s rules. Our team confirms the requirements before registration.</p>
    </div>
  </section>

  <!-- ============ INTERNATIONAL ============ -->
  <section class="section section-alt" id="international" data-screen="International">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">International Domains</p>
          <h2 class="section-title">Take Your Business Beyond Borders</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">Pair your .om name with a global extension and reach customers wherever they are.</p>
        </div>
      </div>
      <div class="lp-tld-grid lp-tld-grid--4">
<?php foreach ($international as $i => [$ext, $text, $p]): ?>
        <article class="lp-tld reveal" style="--d:<?= $i * 60 ?>ms">
          <div class="lp-tld-head">
            <span class="lp-tld-name"><?= e($ext) ?></span>
          </div>
          <p><?= $text ?></p>
          <div class="lp-tld-foot">
            <?= $price($p) ?>
            <a class="card-link" href="#enquiry" data-service="registration" data-domain-ext="<?= e($ext) ?>">Enquire <span class="arrow">→</span></a>
          </div>
        </article>
<?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ============ MANAGEMENT SERVICES ============ -->
  <section class="section" id="services" data-screen="Services">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Domain Management</p>
          <h2 class="section-title">Everything your domain needs, in one place</h2>
        </div>
      </div>
      <div class="feature-grid">
<?php foreach ($services as $i => [$key, $ico, $title, $text]): ?>
        <div class="feature-card lp-mgmt reveal" style="--d:<?= $i * 60 ?>ms">
          <span class="feature-icon" aria-hidden="true"><?= icon($ico) ?></span>
          <h3><?= e($title) ?></h3>
          <p><?= e($text) ?></p>
          <a class="card-link" href="#enquiry" data-service="<?= $key ?>">Enquire about <?= e(strtolower($title)) ?> <span class="arrow">→</span></a>
        </div>
<?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ============ WHY ============ -->
  <section class="section section-alt" id="why-us" data-screen="Why us">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Why Cloud Acropolis</p>
          <h2 class="section-title">A registrar based in Oman</h2>
        </div>
      </div>
      <div class="lp-why-grid">
        <div class="lp-why reveal">
          <span class="feature-icon" aria-hidden="true"><?= icon('award') ?></span>
          <div>
            <h3>TRA-accredited registrar</h3>
            <p>Register Omani domains through an accredited local registrar.</p>
          </div>
        </div>
        <div class="lp-why reveal" style="--d:60ms">
          <span class="feature-icon" aria-hidden="true"><?= icon('globe') ?></span>
          <div>
            <h3>Local and international coverage</h3>
            <p>.om extensions and global names like .com and .net from one provider.</p>
          </div>
        </div>
        <div class="lp-why reveal" style="--d:120ms">
          <span class="feature-icon" aria-hidden="true"><?= icon('layers') ?></span>
          <div>
            <h3>Everything in one place</h3>
            <p>Registration, renewal, transfer and DNS management, handled by one team.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ ENQUIRY FORM ============ -->
  <section class="section lp-form-section" id="enquiry" data-screen="Enquiry">
    <div class="container lp-form-layout">
      <div class="lp-form-intro">
        <p class="eyebrow">Domain Enquiry</p>
        <h2 class="section-title">Let&rsquo;s secure your domain</h2>
        <p class="section-intro">Tell us the name you want and what you need. Our domain team will confirm availability, eligibility and pricing.</p>
        <ol class="lp-steps">
          <li><span class="lp-step-num">1</span><span><strong>Send your domain</strong>The name you want and the service you need.</span></li>
          <li><span class="lp-step-num">2</span><span><strong>We check the details</strong>Availability, eligibility and any documents required.</span></li>
          <li><span class="lp-step-num">3</span><span><strong>We complete the request</strong>Registration, renewal, transfer or DNS changes, done for you.</span></li>
        </ol>
        <p class="lp-direct">Prefer to talk? Call <a href="tel:<?= PHONE_TEL ?>"><?= PHONE_DISPLAY ?></a> or <a href="<?= WHATSAPP_URL ?>" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
      </div>

      <div class="form-card reveal">
        <h3 class="form-card-title">Domain Enquiry</h3>
<?php
$lead_form = 'domain';
$lead_full = ['message'];
$lead_submit = 'Send Domain Enquiry';
include 'includes/lp-form.php';
?>
      </div>
    </div>
  </section>

  <!-- ============ FAQ ============ -->
  <section class="section section-alt" id="faq" data-screen="FAQ">
    <div class="container faq-grid">
      <div class="faq-head">
        <p class="eyebrow">FAQ</p>
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-intro">The essentials on .om and international domains.</p>
      </div>
      <div class="faq-list">
<?php foreach ($faqs as $i => [$q, $a]): ?>
        <div class="faq-item">
          <button class="faq-q" aria-expanded="<?= $i === 0 ? 'true' : 'false' ?>">
            <span><?= $q ?></span>
            <span class="faq-toggle"></span>
          </button>
          <div class="faq-a"><p><?= $a ?></p></div>
        </div>
<?php endforeach; ?>
      </div>
    </div>
  </section>

<?php
$closing = [
    'Your Business Deserves the <span class="text-glow">Right Domain Name</span>',
    'Register, renew, transfer and manage .om and international domains with one team in Oman.',
    '#enquiry',
    'Register Your Domain Today',
];
include 'includes/lp-closing.php';
?>

</main>

<?php include 'includes/lp-footer.php'; ?>
