/* ═══════════════════════════════════════════════════════════════════════════
   landing.js — Google Ads landing pages (infrastructure-oman, domain-
   registration-oman, thank-you). Loaded after main.js.

   Every module is independent and bails out if its markup is missing.

     1. Attribution   UTM / GCLID from the landing URL → hidden form fields
     2. Preselect     [data-service] CTAs choose the service in the form
     3. Lead forms    validate, POST to lead.php, go to the thank-you page
     4. Domain search search box events + carrying the name to the form
     5. Events        phone / WhatsApp clicks (secondary, not leads)

   Conversions are NOT pushed from here: thank-you.php pushes
   "generate_lead" once per stored lead. Everything below only pushes
   secondary events.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = { event: event };
    for (var k in data) payload[k] = data[k];
    window.dataLayer.push(payload);
  }

  /* ─── 1. Attribution ────────────────────────────────────────────────────── */
  // Saved on first landing for 90 days (Google Ads' click window), so a
  // visitor who comes back without the ad parameters is still attributed.
  (function () {
    var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"];
    var STORE = "ca_attribution";
    var MAX_AGE = 90 * 864e5;

    var params = new URLSearchParams(window.location.search);
    var fresh = {};
    var hasFresh = false;
    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) {
        fresh[k] = v.slice(0, 255);
        hasFresh = true;
      }
    });

    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (saved && Date.now() - saved.ts > MAX_AGE) saved = null;
      if (hasFresh) {
        saved = { ts: Date.now(), values: fresh, referrer: document.referrer.slice(0, 500) };
        localStorage.setItem(STORE, JSON.stringify(saved));
      }
    } catch (e) {
      // Storage blocked: the URL values (already in the fields) still apply.
    }

    var values = hasFresh ? fresh : (saved && saved.values) || {};
    var referrer = (saved && saved.referrer) || document.referrer.slice(0, 500);

    document.querySelectorAll("input[data-attr]").forEach(function (input) {
      var key = input.getAttribute("data-attr");
      if (key === "referrer") {
        if (!input.value) input.value = referrer;
      } else if (!input.value && values[key]) {
        input.value = values[key];
      }
    });
  })();

  /* ─── 2. Service preselect ──────────────────────────────────────────────── */
  // A CTA like <a href="#quote" data-service="gpu-server"> picks the service
  // in the form it links to, then puts the cursor in the first empty field.
  // data-domain-ext=".om" also starts the domain field with that extension.
  (function () {
    var ctas = document.querySelectorAll("a[data-service]");
    if (!ctas.length) return;

    ctas.forEach(function (cta) {
      cta.addEventListener("click", function () {
        var section = document.querySelector(cta.getAttribute("href"));
        var form = section && section.querySelector("form[data-lead]");
        if (!form) return;

        var select = form.querySelector('select[name="service"]');
        if (select) {
          select.value = cta.getAttribute("data-service");
          select.setAttribute("aria-invalid", "false");
          clearError(select);
        }

        var domain = form.querySelector('input[name="domain"]');
        var ext = cta.getAttribute("data-domain-ext");
        if (domain && ext && !domain.value) domain.value = ext;

        // Let the smooth scroll start, then focus without a second jump.
        setTimeout(function () {
          var empty = Array.prototype.find.call(form.querySelectorAll("input:not([type=hidden]):not([tabindex='-1']), textarea"), function (el) {
            return !el.value || el.value === ext;
          });
          if (empty) {
            empty.focus({ preventScroll: true });
            if (empty === domain && ext) empty.setSelectionRange(0, 0);
          }
        }, 450);
      });
    });
  })();

  /* ─── 3. Lead forms ─────────────────────────────────────────────────────── */
  function errorEl(field) {
    var id = field.id + "-error";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.className = "ca-error";
      el.id = id;
      field.closest(".ca-field").appendChild(el);
      field.setAttribute("aria-describedby", id);
    }
    return el;
  }

  function showError(field, message) {
    field.setAttribute("aria-invalid", "true");
    errorEl(field).textContent = message;
  }

  function clearError(field) {
    var el = document.getElementById(field.id + "-error");
    if (el) el.textContent = "";
  }

  function messageFor(field) {
    if (field.validity.valueMissing) {
      if (field.dataset.error) return field.dataset.error;
      var label = field.labels && field.labels[0] ? field.labels[0].textContent.replace(/\*|\(optional\)/g, "").trim() : "this field";
      return "Please enter your " + label.toLowerCase() + ".";
    }
    if (field.type === "email") return "Please enter a valid email address.";
    return field.validationMessage;
  }

  (function () {
    var forms = document.querySelectorAll("form[data-lead]");
    if (!forms.length || !window.fetch) return;

    forms.forEach(function (form) {
      var status = form.querySelector(".form-status");
      var button = form.querySelector('button[type="submit"]');
      var fields = form.querySelectorAll("input:not([type=hidden]), select, textarea");

      function setStatus(state, text) {
        if (!status) return;
        if (state) status.setAttribute("data-state", state);
        else status.removeAttribute("data-state");
        status.textContent = text || "";
      }

      fields.forEach(function (field) {
        if (field.closest(".form-hp")) return;
        field.addEventListener("blur", function () {
          if (field.value && !field.checkValidity()) showError(field, messageFor(field));
        });
        field.addEventListener("input", function () {
          if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
            field.setAttribute("aria-invalid", "false");
            clearError(field);
          }
        });
        field.addEventListener("change", function () {
          if (field.tagName === "SELECT" && field.checkValidity()) {
            field.setAttribute("aria-invalid", "false");
            clearError(field);
          }
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.classList.contains("is-sending")) return;

        var firstBad = null;
        fields.forEach(function (field) {
          if (field.closest(".form-hp")) return;
          if (field.checkValidity()) {
            field.setAttribute("aria-invalid", "false");
            clearError(field);
          } else {
            showError(field, messageFor(field));
            if (!firstBad) firstBad = field;
          }
        });
        if (firstBad) {
          setStatus("error", "Please check the highlighted fields.");
          firstBad.focus();
          return;
        }

        form.classList.add("is-sending");
        button.disabled = true;
        var label = button.innerHTML;
        button.textContent = "Sending…";
        setStatus(null, "");

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          credentials: "same-origin"
        })
          .then(function (res) {
            return res.json().catch(function () {
              return { ok: false };
            });
          })
          .then(function (data) {
            if (data.ok && data.redirect) {
              window.location.href = data.redirect;
              return;
            }
            var errors = data.errors || {};
            var first = null;
            Object.keys(errors).forEach(function (name) {
              var field = form.querySelector('[name="' + name + '"]');
              if (!field) return;
              showError(field, errors[name]);
              if (!first) first = field;
            });
            setStatus("error", data.message || "Sorry, something went wrong. Please try again.");
            if (first) first.focus();
            done();
          })
          .catch(function () {
            setStatus("error", "We couldn't reach the server. Please check your connection and try again.");
            done();
          });

        function done() {
          form.classList.remove("is-sending");
          button.disabled = false;
          button.innerHTML = label;
        }
      });
    });
  })();

  /* ─── 4. Domain search ──────────────────────────────────────────────────── */
  (function () {
    var search = document.querySelector("form[data-domain-search]");
    if (!search) return;
    var input = search.querySelector('input[name="query"]');
    var enquiryDomain = document.querySelector('form[data-lead="domain"] input[name="domain"]');

    function clean(v) {
      return v.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/[/\s]+$/, "");
    }

    // Tapping a popular extension chip completes the name in the box.
    document.querySelectorAll(".lp-tld-chips li").forEach(function (chip) {
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      function pick() {
        var name = clean(input.value).split(".")[0] || "yourcompany";
        input.value = name + chip.textContent.trim();
        input.focus();
      }
      chip.addEventListener("click", pick);
      chip.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick();
        }
      });
    });

    search.addEventListener("submit", function (e) {
      var term = clean(input.value);
      if (!term) {
        e.preventDefault();
        input.focus();
        return;
      }
      input.value = term;
      track("domain_search", { search_term: term });
      if (enquiryDomain && !enquiryDomain.value) enquiryDomain.value = term;

      // No live checker configured: hand the name to the enquiry form.
      if (search.getAttribute("action") === "#enquiry") {
        e.preventDefault();
        var target = document.getElementById("enquiry");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });

    // "Contact our domain team" takes whatever is typed in the search box.
    document.querySelectorAll("[data-carry-domain]").forEach(function (link) {
      link.addEventListener("click", function () {
        var term = clean(input.value);
        if (term && enquiryDomain) enquiryDomain.value = term;
      });
    });
  })();

  /* ─── 5. Secondary events ───────────────────────────────────────────────── */
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    var event = href.indexOf("tel:") === 0 ? "phone_click"
      : /whatsapp\.com|wa\.me/.test(href) ? "whatsapp_click"
      : null;
    if (!event) return;
    // Where on the page: the section id, or "header" / "footer".
    var area = link.closest("header, footer, section");
    track(event, { link_location: area ? area.id || area.tagName.toLowerCase() : "" });
  });
})();
