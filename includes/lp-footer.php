<?php // Landing-page footer: contact line and legal links only, then the scripts. ?>
<!-- ============ FOOTER (landing) ============ -->
<footer class="lp-footer">
  <div class="container lp-footer-inner">
    <div class="lp-footer-brand">
      <img src="assets/images/logo.png" alt="Cloud Acropolis" class="lp-footer-logo" width="170" height="42" loading="lazy">
      <p>Cloud Data Center, Building 2073, Way 6025, Ghala Industrial Area, Muscat, Sultanate of Oman</p>
    </div>
    <ul class="lp-footer-links">
      <li><a href="tel:<?= PHONE_TEL ?>"><?= PHONE_DISPLAY ?></a></li>
      <li><a href="mailto:<?= CONTACT_EMAIL ?>">Info@CloudAcropolis.om</a></li>
      <li><a href="<?= WHATSAPP_URL ?>" target="_blank" rel="noopener">WhatsApp</a></li>
    </ul>
  </div>
  <div class="container lp-footer-bottom">
    <p>&copy; <span class="year"><?= date('Y') ?></span> Cloud Acropolis. All rights reserved.</p>
    <div class="lp-footer-legal">
      <a href="<?= PRIVACY_URL ?>">Privacy Policy</a>
      <a href="index.php">cloudacropolis.om</a>
    </div>
  </div>
</footer>

<script src="assets/js/gsap.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
<script src="assets/js/landing.js" defer></script>
</body>
</html>
