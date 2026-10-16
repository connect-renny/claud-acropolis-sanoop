<?php
// Landing-page header: logo, phone and one CTA — no navigation, so ad
// visitors stay on the page. $page['cta'] = [href, label].
?>
<!-- ============ HEADER (landing) ============ -->
<header class="site-header lp-header" id="siteHeader">
  <div class="header-inner container">
    <a href="index.php" class="brand" aria-label="Cloud Acropolis home">
      <img src="assets/images/logo-header.png" alt="Cloud Acropolis" class="brand-mark" width="323" height="80">
    </a>

    <div class="lp-header-actions">
      <a class="lp-header-phone" href="tel:<?= PHONE_TEL ?>">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span class="lp-header-phone-text"><span class="lp-header-phone-label">Talk to our team</span><?= PHONE_DISPLAY ?></span>
      </a>
      <a class="btn btn-primary btn-sm" href="<?= e($page['cta'][0]) ?>"><?= e($page['cta'][1]) ?> <span class="arrow">→</span></a>
    </div>
  </div>
</header>
