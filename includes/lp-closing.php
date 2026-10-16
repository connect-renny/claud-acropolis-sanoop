<?php
// Closing CTA for the landing pages: the site's dark contact panel with the
// page's own headline. $closing = [title, lead, cta href, cta label].
[$cl_title, $cl_lead, $cl_href, $cl_label] = $closing;
?>
  <!-- ============ CLOSING CTA ============ -->
  <section class="section section-dark lp-closing" id="get-started" data-screen="Get started">
    <div class="container">
      <div class="final-cta contact-panel">
        <div class="final-cta-glow" aria-hidden="true"></div>
        <div class="contact-split">
          <div class="contact-copy">
            <p class="eyebrow eyebrow--light">GET STARTED</p>
            <h2><?= $cl_title ?></h2>
            <p class="contact-lead"><?= e($cl_lead) ?></p>
            <div class="final-cta-actions">
              <a class="btn btn-white" href="<?= e($cl_href) ?>"><?= e($cl_label) ?> <span class="arrow">→</span></a>
              <a class="btn btn-outline-light" href="tel:<?= PHONE_TEL ?>">Call <?= PHONE_DISPLAY ?></a>
            </div>
          </div>

          <div class="contact-card">
            <p class="contact-card-title">Reach our team directly</p>
            <div class="contact-items">
              <a class="contact-item" href="tel:<?= PHONE_TEL ?>">
                <span class="contact-item-icon" aria-hidden="true"><?= icon('phone', 20) ?></span>
                <span class="contact-item-text"><span class="contact-item-label">Call us</span><span class="contact-item-value"><?= PHONE_DISPLAY ?></span></span>
                <span class="contact-item-go" aria-hidden="true">→</span>
              </a>
              <a class="contact-item" href="mailto:<?= CONTACT_EMAIL ?>">
                <span class="contact-item-icon" aria-hidden="true"><?= icon('mail', 20) ?></span>
                <span class="contact-item-text"><span class="contact-item-label">Email</span><span class="contact-item-value">Info@CloudAcropolis.om</span></span>
                <span class="contact-item-go" aria-hidden="true">→</span>
              </a>
              <a class="contact-item" href="<?= WHATSAPP_URL ?>" target="_blank" rel="noopener">
                <span class="contact-item-icon" aria-hidden="true"><?= icon('chat', 20) ?></span>
                <span class="contact-item-text"><span class="contact-item-label">WhatsApp</span><span class="contact-item-value">Chat with our team</span></span>
                <span class="contact-item-go" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
