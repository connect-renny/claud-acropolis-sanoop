<?php // "Ready to move to the cloud?" panel, closing the home and service pages. Only the home page snaps (.screen). ?>
  <!-- ============ LOCATION / CONTACT ============ -->
  <section class="section section-dark<?= $page['section'] === 'home' ? ' screen' : '' ?> contact-section" id="contact" data-screen="Contact">
    <div class="container">
      <div class="final-cta contact-panel" id="finalCtaPanel">
        <div class="final-cta-glow" aria-hidden="true"></div>
        <div class="contact-split">
          <div class="contact-copy">
            <p class="eyebrow eyebrow--light">GET IN TOUCH</p>
            <h2>Ready to move your business to the <span class="text-glow">cloud?</span></h2>
            <p class="contact-lead">Talk to our cloud specialists and discover the right infrastructure, security and digital services for your organization.</p>
            <div class="final-cta-actions">
              <a class="btn btn-white" href="mailto:<?= CONTACT_EMAIL ?>?subject=Inquiry%20Request">Talk to an Expert <span class="arrow">→</span></a>
              <a class="btn btn-outline-light" href="contact.php">Request a Consultation</a>
            </div>
          </div>

          <div class="contact-card">
            <p class="contact-card-title">Reach our team directly</p>
            <div class="contact-items">
              <a class="contact-item" href="tel:+96892394675">
                <span class="contact-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                <span class="contact-item-text"><span class="contact-item-label">Call us</span><span class="contact-item-value">+968 9239 4675</span></span>
                <span class="contact-item-go" aria-hidden="true">→</span>
              </a>
              <a class="contact-item" href="mailto:Info@CloudAcropolis.om">
                <span class="contact-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg></span>
                <span class="contact-item-text"><span class="contact-item-label">Email</span><span class="contact-item-value">Info@CloudAcropolis.om</span></span>
                <span class="contact-item-go" aria-hidden="true">→</span>
              </a>
              <a class="contact-item" href="https://api.whatsapp.com/send?phone=96892394675" target="_blank" rel="noopener">
                <span class="contact-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
                <span class="contact-item-text"><span class="contact-item-label">WhatsApp</span><span class="contact-item-value">Chat with our team</span></span>
                <span class="contact-item-go" aria-hidden="true">↗</span>
              </a>
              <!-- TODO: replace with the exact Google Maps place URL for the data center -->
              <a class="contact-item" href="https://www.google.com/maps/search/?api=1&amp;query=Cloud+Acropolis+Muscat+Oman" target="_blank" rel="noopener">
                <span class="contact-item-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg></span>
                <span class="contact-item-text"><span class="contact-item-label">Location</span><span class="contact-item-value">Muscat, Oman</span></span>
                <span class="contact-item-go" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
