<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Google Ads landing page A — Infrastructure Services (/infrastructure-oman)
//  Conversion: quote request (lead.php → thank-you.php).
//  Hand-written, not generated: build-services.mjs doesn't touch it.
// ═══════════════════════════════════════════════════════════════════════════
$page = [
    'title' => 'Cloud Infrastructure & VPS Hosting Oman | Cloud Acropolis',
    'description' => 'Explore Linux VM, Windows VM, GPU Servers and Colocation services in Oman. Request a tailored infrastructure quote.',
    'image' => 'oman-network.jpg',
    'canonical' => 'infrastructure-oman',
    'landing' => true,
    'cta' => ['#quote', 'Request a Quote'],
];
include 'includes/head.php';
require 'includes/lp-icons.php';
include 'includes/lp-header.php';

$solutions = [
    ['linux-vm', 'Cloud Server', 'Linux VM Server', 'Virtual servers for websites, APIs, databases, Docker containers, automation and development workloads.', 'Enquire About Linux VM', 'card-vps.jpg', 'Server racks in a data center', 'terminal'],
    ['windows-vm', 'Cloud Server', 'Windows VM Server', 'Windows-based hosting for business applications, Microsoft SQL Server, .NET, Active Directory and Remote Desktop Services.', 'Enquire About Windows VM', 'why-datacenter.jpg', 'Data center aisle lined with server cabinets', 'windows'],
    ['gpu-server', 'Accelerated Compute', 'GPU Server', 'High-performance GPU computing for AI, machine learning, model training, analytics and rendering.', 'Request GPU Server Quote', 'card-infrastructure.jpg', 'High-performance computing infrastructure', 'chip'],
    ['colocation', 'Data Center', 'Colocation Services', 'Full-rack and half-rack space for customer-owned IT equipment with power, cooling, connectivity and physical security.', 'Request Colocation Quote', 'colocation.jpg', 'Colocation racks in the Cloud Acropolis data center', 'rack'],
];

$reasons = [
    ['pin', 'Oman-based data center', 'Your servers and data stay in Muscat, close to your users and your business.'],
    ['layers', 'Linux and Windows hosting', 'Run the operating system your applications need, from Ubuntu to Windows Server.'],
    ['scale', 'Scalable computing resources', 'Add CPU, memory and storage as your workloads grow.'],
    ['chip', 'GPU infrastructure', 'Dedicated GPU compute for AI, analytics and other demanding workloads.'],
    ['rack', 'Full-rack and half-rack colocation', 'Space for your own equipment, with power, cooling and physical security.'],
    // TODO: confirm support wording and hours with the client.
    ['headset', 'Local technical assistance', 'Speak to a team based in Oman when you need help.'],
];

$use_cases = [
    ['globe', 'Website & Application Hosting', 'Company websites, portals and web applications.'],
    ['briefcase', 'Enterprise Business Applications', 'ERP, CRM and line-of-business software.'],
    ['database', 'Databases & Backend Systems', 'MySQL, PostgreSQL, SQL Server and APIs.'],
    ['spark', 'AI & Machine Learning', 'Model training, inference and data analytics.'],
    ['code', 'Development & Testing', 'Isolated environments for builds, staging and QA.'],
    ['rack', 'Physical Server Colocation', 'Your own hardware in our Muscat facility.'],
];

$faqs = [
    ['Linux VM or Windows VM — which should I choose?', 'Choose Linux for open-source stacks such as web servers, Docker, PHP, Python or Node.js. Choose Windows when your software depends on Microsoft technologies like .NET, SQL Server, Active Directory or Remote Desktop Services. Not sure? Describe your application and we&rsquo;ll recommend one.'],
    ['Can I customize CPU, RAM and storage?', 'Yes. Every quote is sized to your workload. Tell us the CPU, memory, storage and operating system you need — or simply describe the application — and we&rsquo;ll propose a configuration.'],
    ['What can I use a GPU server for?', 'GPU servers suit highly parallel workloads: training and running AI and machine-learning models, data analytics, video processing and 3D rendering.'],
    ['What does colocation include?', 'Full-rack or half-rack space in our Muscat data center for your own equipment, with power, cooling, connectivity and physical security. Exact inclusions are confirmed in your quotation.'],
    ['How does the quotation process work?', 'Send the form with your requirements. Our team reviews them, contacts you to clarify any details, and sends a tailored quotation. There&rsquo;s no obligation to proceed.'],
];
?>

<main id="main" class="lp-page">

  <!-- ============ HERO ============ -->
  <section class="lp-hero" id="hero">
    <div class="container lp-hero-grid">
      <div class="lp-hero-copy">
        <p class="lp-kicker">Cloud Infrastructure &middot; Muscat, Oman</p>
        <h1>Reliable Cloud Infrastructure, <span class="text-gradient">Hosted in Oman</span></h1>
        <p class="lp-lead">Power your business with secure, scalable infrastructure from Cloud Acropolis. From Linux and Windows Virtual Machines to GPU Servers and Colocation, our solutions support business applications, databases, development environments, and demanding enterprise workloads.</p>
        <ul class="lp-highlights">
          <li><?= icon('check', 16, 2.4) ?>Oman-Based Data Center</li>
          <li><?= icon('check', 16, 2.4) ?>Scalable Infrastructure</li>
          <li><?= icon('check', 16, 2.4) ?>Local Technical Support</li>
        </ul>
        <div class="lp-actions">
          <a class="btn btn-primary btn-lg" href="#quote">Request Infrastructure Quote <span class="arrow">→</span></a>
          <a class="btn btn-outline btn-lg" href="#solutions">Explore Solutions</a>
        </div>
      </div>

      <div class="lp-hero-aside">
        <div class="lp-hero-media">
          <img src="assets/images/oman-network.jpg" alt="Network racks inside the Cloud Acropolis data center in Muscat" width="1920" height="1282" fetchpriority="high">
          <div class="lp-hero-badge">
            <span class="brand-quad" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span><strong>Cloud Data Center</strong>Ghala, Muscat &middot; Sultanate of Oman</span>
          </div>
          <ul class="lp-hero-tags" aria-label="Infrastructure services">
            <li><?= icon('terminal', 16) ?>Linux VM</li>
            <li><?= icon('windows', 16) ?>Windows VM</li>
            <li><?= icon('chip', 16) ?>GPU Servers</li>
            <li><?= icon('rack', 16) ?>Colocation</li>
          </ul>
        </div>

        <div class="lp-hero-form">
          <h2 class="lp-hero-form-title">Get a quick call back</h2>
<?php
$lead_form = 'callback';
$lead_full = ['message'];
$lead_submit = 'Call Me Back';
$lead_compact = true;
include 'includes/lp-form.php';
$lead_compact = false;
?>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ SOLUTIONS ============ -->
  <section class="section" id="solutions" data-screen="Solutions">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Infrastructure Solutions</p>
          <h2 class="section-title">The right infrastructure for every workload</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">Four ways to run your workloads in Oman. Pick one and we&rsquo;ll size a quote to your requirements.</p>
        </div>
      </div>

      <div class="lp-svc-grid">
<?php foreach ($solutions as $i => [$key, $kicker, $title, $text, $cta, $img, $alt, $ico]): ?>
        <article class="lp-svc reveal" style="--d:<?= $i * 60 ?>ms">
          <div class="lp-svc-media">
            <img src="assets/images/<?= $img ?>" alt="<?= e($alt) ?>" width="900" height="600" loading="lazy" decoding="async">
            <span class="lp-svc-icon" aria-hidden="true"><?= icon($ico) ?></span>
          </div>
          <div class="lp-svc-body">
            <p class="lp-svc-kicker"><?= e($kicker) ?></p>
            <h3><?= e($title) ?></h3>
            <p><?= e($text) ?></p>
            <a class="btn btn-outline btn-block" href="#quote" data-service="<?= $key ?>"><?= e($cta) ?> <span class="arrow">→</span></a>
          </div>
        </article>
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
          <h2 class="section-title">Local infrastructure, built for business</h2>
        </div>
      </div>
      <div class="lp-why-grid">
<?php foreach ($reasons as $i => [$ico, $title, $text]): ?>
        <div class="lp-why reveal" style="--d:<?= ($i % 3) * 60 ?>ms">
          <span class="feature-icon" aria-hidden="true"><?= icon($ico) ?></span>
          <div>
            <h3><?= e($title) ?></h3>
            <p><?= e($text) ?></p>
          </div>
        </div>
<?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ============ USE CASES ============ -->
  <section class="section" id="use-cases" data-screen="Use cases">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Business Use Cases</p>
          <h2 class="section-title">What our customers run on it</h2>
        </div>
      </div>
      <ul class="lp-use-grid">
<?php foreach ($use_cases as $i => [$ico, $title, $text]): ?>
        <li class="lp-use reveal" style="--d:<?= ($i % 3) * 60 ?>ms">
          <span class="lp-use-icon" aria-hidden="true"><?= icon($ico, 20) ?></span>
          <span><strong><?= e($title) ?></strong><?= e($text) ?></span>
        </li>
<?php endforeach; ?>
      </ul>
    </div>
  </section>

  <!-- ============ QUOTE FORM ============ -->
  <section class="section section-alt lp-form-section" id="quote" data-screen="Quote">
    <div class="container lp-form-layout">
      <div class="lp-form-intro">
        <p class="eyebrow">Request a Quote</p>
        <h2 class="section-title">Tell us what you need</h2>
        <p class="section-intro">Share a few details about your workload and our infrastructure team will prepare a quotation tailored to it.</p>
        <ol class="lp-steps">
          <li><span class="lp-step-num">1</span><span><strong>Send your requirements</strong>The service you need and any specifications you already know.</span></li>
          <li><span class="lp-step-num">2</span><span><strong>We review and clarify</strong>Our team contacts you to confirm the details.</span></li>
          <li><span class="lp-step-num">3</span><span><strong>Receive your quotation</strong>A configuration and price sized to your workload.</span></li>
        </ol>
        <p class="lp-direct">Prefer to talk? Call <a href="tel:<?= PHONE_TEL ?>"><?= PHONE_DISPLAY ?></a> or <a href="<?= WHATSAPP_URL ?>" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
      </div>

      <div class="form-card reveal">
        <h3 class="form-card-title">Request Infrastructure Quote</h3>
<?php
$lead_form = 'infrastructure';
$lead_full = ['service', 'message'];
$lead_submit = 'Request My Quote';
include 'includes/lp-form.php';
?>
      </div>
    </div>
  </section>

  <!-- ============ FAQ ============ -->
  <section class="section" id="faq" data-screen="FAQ">
    <div class="container faq-grid">
      <div class="faq-head">
        <p class="eyebrow">FAQ</p>
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-intro">Quick answers about our infrastructure services.</p>
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
    'Build Your Infrastructure with <span class="text-glow">Cloud Acropolis</span>',
    'Linux and Windows VMs, GPU servers and colocation, hosted in Oman and sized to your workload.',
    '#quote',
    'Get a Custom Quote',
];
include 'includes/lp-closing.php';
?>

</main>

<?php include 'includes/lp-footer.php'; ?>
