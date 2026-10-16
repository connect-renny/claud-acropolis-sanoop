<?php
// Site header, desktop mega menu and mobile nav. The current page is marked
// from $page['section'] (top level) and $page['file'] (service links).
$nav_link = function ($section, $href, $label) use ($page) {
    $on = $page['section'] === $section;
    return '<a class="nav-link' . ($on ? ' is-current' : '') . '" href="' . $href . '"' . ($on ? ' aria-current="page"' : '') . '>' . $label . '</a>';
};
$mobile_link = function ($section, $href, $label) use ($page) {
    $on = $page['section'] === $section;
    return '<a class="mobile-top-link" href="' . $href . '"' . ($on ? ' aria-current="page"' : '') . '>' . $label . '</a>';
};
?>
<!-- ============ HEADER ============ -->
<header class="site-header" id="siteHeader">
  <div class="header-inner container">
    <a href="index.php" class="brand" aria-label="Cloud Acropolis home">
      <img src="assets/images/logo-header.png" alt="Cloud Acropolis" class="brand-mark" width="323" height="80">
    </a>

    <nav class="main-nav" id="mainNav" aria-label="Primary">
      <ul>
        <li><?= $nav_link('home', 'index.php', 'Home') ?></li>
        <li class="has-menu">
          <button class="nav-link<?= $page['section'] === 'services' ? ' is-current' : '' ?>" aria-expanded="false" data-menu="services">Our Services <svg class="chev" viewBox="0 0 12 8" width="10" height="8"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>

          <div class="mega-menu mega-menu--full" id="menu-services">
            <div class="mega-cols">
<?php foreach (SERVICE_MENU as $cat => $links): ?>

              <div class="mega-col">
                <p class="mega-cat"><?= e($cat) ?></p>
<?php foreach ($links as [$label, $href]): ?>
                <a class="mega-svc" href="<?= e($href) ?>"<?= current_attr($href) ?>><?= e($label) ?><span class="mega-go">→</span></a>
<?php endforeach; ?>
              </div>
<?php endforeach; ?>

            </div>
            <div class="mega-featured">
              <p class="mega-featured-label">Not sure what you need?</p>
              <a class="mega-featured-link" href="mailto:<?= CONTACT_EMAIL ?>?subject=Inquiry%20Request">Talk to our cloud specialists <span class="arrow">→</span></a>
            </div>
          </div>
        </li>
        <li><?= $nav_link('partner', 'partner.php', 'Become a Partner') ?></li>
        <li><?= $nav_link('contact', 'contact.php', 'Contact Us') ?></li>
      </ul>
    </nav>

    <div class="header-actions">
      <a class="btn btn-primary btn-sm" href="<?= CLIENT_AREA ?>">Client Area</a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile nav -->
<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav-inner">
    <?= $mobile_link('home', 'index.php', 'Home') ?>

    <details class="mobile-services"<?= $page['section'] === 'services' ? ' open' : '' ?>>
      <summary>Our Services</summary>
<?php foreach (SERVICE_MENU as $cat => $links): ?>

      <p class="mobile-cat"><?= e($cat) ?></p>
<?php foreach ($links as [$label, $href]): ?>
      <a href="<?= e($href) ?>"<?= current_attr($href) ?>><?= e($label) ?></a>
<?php endforeach; ?>
<?php endforeach; ?>
    </details>
    <?= $mobile_link('partner', 'partner.php', 'Become a Partner') ?>

    <?= $mobile_link('contact', 'contact.php', 'Contact Us') ?>

    <div class="mobile-actions">
      <a class="btn btn-primary btn-block" href="<?= CLIENT_AREA ?>">Client Area</a>
    </div>
  </div>
</div>
<div class="nav-scrim" id="navScrim"></div>
