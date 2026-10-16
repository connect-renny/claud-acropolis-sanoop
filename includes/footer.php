<?php // Site footer, scripts and the closing tags. ?>
<!-- ============ FOOTER ============ -->
<footer class="site-footer" id="siteFooter">
  <div class="footer-glow" aria-hidden="true"></div>

  <div class="container footer-grid">

    <div class="footer-brand">
      <img src="assets/images/logo-footer-white.png" alt="Cloud Acropolis" class="footer-logo" width="323" height="80">
      <p class="footer-brand-text">Cloud infrastructure and digital solutions, built in Oman and serving internationally.</p>
      <p class="footer-brand-sub">Empowering Oman&rsquo;s Digital Future</p>
    </div>

    <div class="footer-col">
      <h4>Cloud &amp; Solutions</h4>
      <a href="linux-server.php"<?= current_attr('linux-server.php') ?>>Linux Cloud Server</a>
      <a href="windows-server.php"<?= current_attr('windows-server.php') ?>>Windows Cloud Server</a>
      <a href="colocation.php"<?= current_attr('colocation.php') ?>>Colocation</a>
      <a href="gpu.php"<?= current_attr('gpu.php') ?>>GPU as a Service</a>
      <a href="<?= home_anchor('marketplace') ?>">Business Solutions</a>
      <a href="ssl-certificates.php"<?= current_attr('ssl-certificates.php') ?>>Security Services</a>
    </div>

    <div class="footer-col">
      <h4>Company</h4>
      <a href="<?= home_anchor('why') ?>">Why Cloud Acropolis</a>
      <a href="partner.php"<?= current_attr('partner.php') ?>>Become a Partner</a>
      <a href="contact.php"<?= current_attr('contact.php') ?>>Contact Us</a>
      <a href="<?= home_anchor('faq') ?>">Support &amp; FAQs</a>
      <a href="<?= CLIENT_AREA ?>">Client Portal</a>
    </div>

    <div class="footer-col footer-contact">
      <h4>Get in Touch</h4>

      <div class="footer-contact-item">
        <svg class="footer-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>
        <span>Cloud Acropolis<br>Cloud Data Center<br>Building 2073, Way 6025<br>Muscat, Sultanate of Oman</span>
      </div>

      <a class="footer-contact-item" href="tel:+96892394675">
        <svg class="footer-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>+968 9239 4675</span>
      </a>

      <a class="footer-contact-item" href="mailto:Info@CloudAcropolis.om">
        <svg class="footer-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg>
        <span>Info@CloudAcropolis.om</span>
      </a>

      <a class="footer-contact-item" href="https://api.whatsapp.com/send?phone=96892394675" target="_blank" rel="noopener">
        <svg class="footer-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span>WhatsApp</span>
      </a>

      <!-- TODO: replace with the exact Google Maps place URL for the data center -->
      <a class="footer-maps-link" href="https://www.google.com/maps/search/?api=1&amp;query=Cloud+Acropolis+Muscat+Oman" target="_blank" rel="noopener">
        <svg class="footer-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>
        View on Google Maps <span class="arrow">↗</span>
      </a>
    </div>

  </div>

  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>&copy; <span class="year"><?= date('Y') ?></span> Cloud Acropolis. All rights reserved.</p>
      <div class="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
      </div>
    </div>
  </div>
</footer>

<script src="assets/js/gsap.min.js" defer></script>
<!-- main.js last: it reads window.gsap at init. -->
<script src="assets/js/main.js" defer></script>
</body>
</html>
