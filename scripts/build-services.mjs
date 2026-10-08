// ═══════════════════════════════════════════════════════════════════════════
//  npm run pages
//
//  Writes one page per service (linux-server.html, …) into the site root,
//  next to index.html, from content/services.json — plus the company pages
//  (contact.html, partner.html), whose copy lives at the bottom of this file.
//
//  The header, mobile nav, contact panel and footer are lifted straight out
//  of index.html, so the home page stays the single source for them — edit
//  it there, then re-run this script. The current page is marked in the menus.
//
//  Page copy lives in content/services.json and is taken word for word from
//  the live cloudacropolis.om service pages.
// ═══════════════════════════════════════════════════════════════════════════

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTACT_EMAIL = "info@cloudacropolis.om";

const { pages } = JSON.parse(await readFile(join(root, "content/services.json"), "utf8"));
const home = (await readFile(join(root, "index.html"), "utf8")).replace(/\r\n/g, "\n");

// ─── Helpers ───────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Cut a block out of index.html between two markers (start included).
function slice(from, to) {
  const a = home.indexOf(from);
  const b = home.indexOf(to, a + from.length);
  if (a < 0 || b < 0) throw new Error(`index.html marker not found: ${a < 0 ? from : to}`);
  return home.slice(a, b).trimEnd();
}

// Same folder as index.html, so only the home and in-page links change:
// "#faq" on the home page means index.html#faq from here.
function relink(html) {
  return html
    .replace(/href="\/"/g, 'href="index.html"')
    .replace(/href="#(?!main")([a-z][\w-]*)"/g, 'href="index.html#$1"');
}

// Mark the page we're on in the desktop mega menu, the mobile list and the
// top-level nav ("Our Services" instead of "Home").
function markCurrent(html, file) {
  return html
    .replace(' class="nav-link is-current" href="index.html" aria-current="page"', ' class="nav-link" href="index.html"')
    .replace('<button class="nav-link" aria-expanded="false" data-menu="services">', '<button class="nav-link is-current" aria-expanded="false" data-menu="services">')
    .replace(new RegExp(`<a class="mega-svc" href="${file}">`, "g"), `<a class="mega-svc" href="${file}" aria-current="page">`)
    .replace(new RegExp(`(<details class="mobile-services")>`), "$1 open>")
    .replace(new RegExp(`<a href="${file}">`, "g"), `<a href="${file}" aria-current="page">`);
}

const header = slice("<!-- ============ HEADER ============ -->", "<!-- Section pager");
// Drop .screen: inside pages don't snap (see the screen-mode block in _home.scss).
const contact = slice("<!-- ============ LOCATION / CONTACT ============ -->", "\n</main>").replace(
  " screen contact-section",
  " contact-section"
);
const footer = slice("<!-- ============ FOOTER ============ -->", "\n<script");
const scripts = slice('<script src="assets/js/gsap.min.js"', "\n</body>");

// ─── Icons ─────────────────────────────────────────────────────────────────
// Same line-icon style as the home page (24×24, 1.8 stroke).
const ICON_PATHS = {
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><line x1="7" y1="7.5" x2="7.01" y2="7.5"/><line x1="7" y1="16.5" x2="7.01" y2="16.5"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 9 10 12 7 15"/><line x1="12" y1="15" x2="17" y2="15"/>',
  windows: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
  chip: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  layers: '<polygon points="12 3 21 8 12 13 3 8 12 3"/><polyline points="3 13 12 18 21 13"/><polyline points="3 17.5 12 22.5 21 17.5"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="14" width="4" height="6" rx="1.5"/><rect x="17.5" y="14" width="4" height="6" rx="1.5"/><path d="M19.5 20a3 3 0 0 1-3 2H13"/>',
  bolt: '<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.5 18a10 10 0 1 1 17 0"/><circle cx="12" cy="14" r="1.5"/>',
  network: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="5" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M7 11l10-5M7 13l10 5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/><line x1="12" y1="10" x2="12" y2="17"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
  building: '<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><line x1="2" y1="21" x2="22" y2="21"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="16" y2="15"/>',
  scale: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.66 2.69 3 6 3s6-1.34 6-3V7"/><path d="M9 15v2c0 1.66 2.69 3 6 3s6-1.34 6-3v-5c0-1.5-2.2-2.8-5.2-3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  forward: '<polyline points="15 5 20 10 15 15"/><path d="M4 19v-2a7 7 0 0 1 7-7h9"/>',
  menu: '<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4.5" cy="6" r="1.3"/><circle cx="4.5" cy="12" r="1.3"/><circle cx="4.5" cy="18" r="1.3"/>',
  mobile: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart: '<line x1="4" y1="20" x2="20" y2="20"/><rect x="5" y="11" width="3" height="6" rx="0.8"/><rect x="10.5" y="7" width="3" height="10" rx="0.8"/><rect x="16" y="4" width="3" height="13" rx="0.8"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><line x1="12" y1="13" x2="12" y2="21"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>',
  cloud: '<path d="M17.5 19H7a5 5 0 1 1 .9-9.92A6 6 0 0 1 19 11a4 4 0 0 1-1.5 8z"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
  briefcase: '<rect x="3" y="8" width="18" height="12" rx="1.8"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 13.9L7 22l5-3 5 3-1.5-8.1"/>',
  refresh: '<polyline points="21 4 21 10 15 10"/><polyline points="3 20 3 14 9 14"/><path d="M5.5 9a7 7 0 0 1 11.6-2.6L21 10M3 14l3.9 3.6A7 7 0 0 0 18.5 15"/>',
};

function icon(name, size = 20) {
  const paths = ICON_PATHS[name];
  if (!paths) throw new Error(`Unknown icon "${name}" in content/services.json`);
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

const CHECK =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

// ─── Shared pieces ─────────────────────────────────────────────────────────
// Top-level service categories (the live site's sub-nav). Category URLs show
// their first service, so the tabs link straight to it.
const CATEGORIES = [
  { key: "infrastructure", label: "Infrastructure", href: "linux-server.html", icon: "server" },
  { key: "domain", label: "Domain", href: "https://my.cloudacropolis.om/cart.php?a=add&domain=register", icon: "globe", external: true },
  { key: "saas", label: "SaaS", href: "cloud-pbx.html", icon: "layers" },
  { key: "bundle", label: "Business Bundle", href: "business-bundle.html", icon: "briefcase" },
  { key: "security", label: "Security Services", href: "ssl-certificates.html", icon: "shield" },
  { key: "gpu", label: "GPU", href: "gpu.html", icon: "chip" },
];

const linkHref = (l) => l.local || l.href;
const extAttrs = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "");

function requestHref(req) {
  const subject = `Service Request: ${req.category} – ${req.plan}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

// ─── Sections ──────────────────────────────────────────────────────────────
function hero(p, cat) {
  const tabs = CATEGORIES.map((c) => {
    const active = c.key === p.category;
    return `          <li><a class="service-tab${active ? " is-active" : ""}" href="${esc(c.href)}"${active ? ' aria-current="true"' : ""}${c.external ? extAttrs(c.href) : ""}>${icon(c.icon, 16)}${esc(c.label)}</a></li>`;
  }).join("\n");

  return `  <!-- ============ PAGE HERO ============ -->
  <section class="page-hero">
    <img src="assets/images/${esc(p.image)}" alt="" class="page-hero-img">
    <div class="page-hero-overlay"></div>
    <div class="container page-hero-inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="index.html">Home</a></li>
          <li>Our Services</li>
          <li><a href="${esc(cat.href)}">${esc(cat.label)}</a></li>
          <li aria-current="page">${esc(p.h1)}</li>
        </ol>
      </nav>
      <p class="page-kicker">${esc(p.sidebarTitle)}</p>
      <h1>${esc(p.h1)}</h1>
      <nav aria-label="Service categories">
        <ul class="service-tabs">
${tabs}
        </ul>
      </nav>
    </div>
  </section>`;
}

function sidebar(p) {
  const groups = p.sidebar
    .map((g) => {
      // A group whose only link repeats its own name ("Colocation" →
      // "Colocation") reads as a duplicate, so it shows as a plain link.
      const solo = g.links.length === 1 && g.links[0].label.toLowerCase() === g.group.toLowerCase();
      const links = g.links
        .map((l) => {
          const href = linkHref(l);
          const current = l.local && l.local === `${p.slug}.html`;
          return `              <a class="mega-svc" href="${esc(href)}"${current ? ' aria-current="page"' : ""}${extAttrs(href)}>${esc(l.label)}<span class="mega-go">${/^https?:/.test(href) ? "↗" : "→"}</span></a>`;
        })
        .join("\n");
      return `            <div class="side-group${solo ? " side-group--solo" : ""}">
${solo ? "" :`              <p class="mega-cat">${esc(g.group)}</p>\n`}${links}
            </div>`;
    })
    .join("\n");

  return `        <aside class="service-side reveal" aria-label="${esc(p.sidebarTitle)} services">
          <div class="side-card">
            <div class="side-body">
              <p class="side-title"><span class="brand-quad" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${esc(p.sidebarTitle)}</p>
              <div class="side-groups">
${groups}
              </div>
            </div>
            <div class="side-help">
              <p class="mega-featured-label">Not sure what you need?</p>
              <a class="mega-featured-link" href="mailto:${CONTACT_EMAIL}?subject=Inquiry%20Request">Talk to our cloud specialists <span class="arrow">→</span></a>
            </div>
          </div>
        </aside>`;
}

function plan(pl, i) {
  const highlight = !!pl.badge;
  const isOrder = !!pl.button.href;
  const href = isOrder ? pl.button.href : requestHref(pl.button.request);
  // Ordering is the primary action; a quote request is the quieter one —
  // unless the card is the recommended plan.
  const btnClass = isOrder || highlight ? "btn btn-primary btn-block" : "btn btn-outline btn-block";
  const delay = i ? ` style="--d:${i * 80}ms"` : "";
  const lines = [
    `          <article class="price-card${highlight ? " price-card--highlight" : ""} reveal"${delay}>`,
    highlight ? `            <p class="price-badge">${esc(pl.badge)}</p>` : null,
    `            <h3>${esc(pl.name)}</h3>`,
    pl.price ? `            <p class="price-tag">OMR ${esc(pl.price)}<span>${esc(pl.period)}</span></p>` : null,
    pl.desc ? `            <p class="price-desc">${esc(pl.desc)}</p>` : null,
    `            <ul class="price-features">`,
    ...pl.features.map((f) => `              <li>${CHECK} ${esc(f)}</li>`),
    `            </ul>`,
    `            <a class="${btnClass}" href="${esc(href)}"${extAttrs(href)}>${esc(pl.button.label)}</a>`,
    `          </article>`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

function plans(p) {
  const grid = p.plans.length === 2 ? "pricing-grid pricing-grid--2" : "pricing-grid";
  return `  <!-- ============ PLANS ============ -->
  <section class="section" id="plans" data-screen="Plans">
    <div class="container service-layout">
${sidebar(p)}

      <div class="service-content">
        <div class="split-head">
          <div>
            <p class="eyebrow">Plans &amp; Pricing</p>
            <h2 class="visually-hidden">${esc(p.h1)} plans</h2>
          </div>
        </div>
        <div class="${grid}">
${p.plans.map(plan).join("\n\n")}
        </div>
      </div>
    </div>
  </section>`;
}

function features(p) {
  if (!p.features) return "";
  const f = p.features;
  const grid = f.items.length % 3 === 0 || f.items.length === 5 ? "feature-grid feature-grid--3" : "feature-grid";
  const cards = f.items
    .map(
      (it, i) => `        <div class="feature-card reveal" style="--d:${(i % 4) * 60}ms">
          <span class="feature-icon" aria-hidden="true">${icon(it.icon, 22)}</span>
          <h3>${esc(it.title)}</h3>
          <p>${esc(it.text)}</p>
        </div>`
    )
    .join("\n");
  return `
  <!-- ============ FEATURES ============ -->
  <section class="section section-alt" id="features" data-screen="Features">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Features</p>
          <h2 class="section-title">${esc(f.title)}</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">${esc(f.intro)}</p>
        </div>
      </div>
      <div class="${grid}">
${cards}
      </div>
    </div>
  </section>
`;
}

function faq(p) {
  if (!p.faq) return "";
  const items = p.faq.items
    .map(
      (q, i) => `        <div class="faq-item">
          <button class="faq-q" aria-expanded="${i === 0}">
            <span>${esc(q.q)}</span>
            <span class="faq-toggle"></span>
          </button>
          <div class="faq-a"><p>${q.a}</p></div>
        </div>`
    )
    .join("\n");
  return `
  <!-- ============ FAQ ============ -->
  <section class="section" id="faq" data-screen="FAQ">
    <div class="container faq-grid">
      <div class="faq-head">
        <p class="eyebrow">FAQ</p>
        <h2 class="section-title">${esc(p.faq.title)}</h2>
        <p class="section-intro">${esc(p.faq.intro)}</p>
      </div>

      <div class="faq-list">
${items}
      </div>
    </div>
  </section>
`;
}

// ─── Document shell ────────────────────────────────────────────────────────
function documentHtml({ title, description, image, source, chrome, main }) {
  return `<!doctype html>
<!--
  Generated by \`npm run pages\` (scripts/build-services.mjs)${source ? ` from\n  ${source}. Edit those` : ". Edit that"}, not this file — it is overwritten.
-->
<html lang="en" dir="ltr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="assets/images/${esc(image)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="assets/images/logo.png">
<meta name="theme-color" content="#ffffff">

<link rel="preload" href="assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

${chrome(header)}

${main}

${chrome(footer)}

${relink(scripts)}
</body>
</html>
`;
}

// ─── Service page ──────────────────────────────────────────────────────────
function page(p) {
  const file = `${p.slug}.html`;
  const cat = CATEGORIES.find((c) => c.key === p.category);
  const chrome = (html) => markCurrent(relink(html), file);

  return documentHtml({
    title: `${p.h1} | Cloud Acropolis`,
    description: p.description,
    image: p.image,
    source: "content/services.json",
    chrome,
    main: `<main id="main" class="service-page">

${hero(p, cat)}

${plans(p)}
${features(p)}${faq(p)}
${chrome(contact)}

</main>`,
  });
}

// ═══ COMPANY PAGES (contact.html, partner.html) ════════════════════════════
// Copy is taken word for word from cloudacropolis.om/Contact_us and /partner;
// the layout is ours. Forms have no backend — main.js turns a submit into a
// pre-filled email to CONTACT_EMAIL (form[data-mailto]).

const PHONE = { href: "tel:+96892394675", label: "+968 9239 4675" };
const WHATSAPP = "https://api.whatsapp.com/send?phone=96892394675";
const ADDRESS_LINES = ["Cloud Data Center", "Building 2073, Way 6025", "Ghala Industrial Area", "Muscat, Sultanate of Oman"];
const MAPS_QUERY = "Cloud Acropolis, Building 2073, Way 6025, Ghala Industrial Area, Muscat, Oman";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;

// Top-level nav: drop "Home" as current and mark this page's own link.
function markCompany(html, file) {
  return html
    .replace(' class="nav-link is-current" href="index.html" aria-current="page"', ' class="nav-link" href="index.html"')
    .replace(`<a class="nav-link" href="${file}">`, `<a class="nav-link is-current" href="${file}" aria-current="page">`)
    .replace(`<a class="mobile-top-link" href="${file}">`, `<a class="mobile-top-link" href="${file}" aria-current="page">`);
}

function pageHero({ image, crumb, kicker, h1, lead, chips }) {
  return `  <!-- ============ PAGE HERO ============ -->
  <section class="page-hero page-hero--company">
    <img src="assets/images/${esc(image)}" alt="" class="page-hero-img">
    <div class="page-hero-overlay"></div>
    <div class="container page-hero-inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="index.html">Home</a></li>
          <li aria-current="page">${esc(crumb)}</li>
        </ol>
      </nav>
      <p class="page-kicker">${esc(kicker)}</p>
      <h1>${esc(h1)}</h1>
      <p class="page-lead">${esc(lead)}</p>
      <ul class="service-tabs">
${chips.map((c) => `        <li>${c}</li>`).join("\n")}
      </ul>
    </div>
  </section>`;
}

const chipLink = (href, ic, label) =>
  `<a class="service-tab" href="${esc(href)}"${extAttrs(href)}>${icon(ic, 16)}${esc(label)}</a>`;
const chipStatic = (ic, label) => `<span class="service-tab service-tab--static">${icon(ic, 16)}${esc(label)}</span>`;

// ─── Form fields ───────────────────────────────────────────────────────────
function field({ id, label, type = "text", required = true, autocomplete, full, options, rows }) {
  const req = required ? " required" : "";
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : "";
  const star = required ? ' <span class="req" aria-hidden="true">*</span>' : "";
  let control;
  if (type === "textarea") {
    control = `<textarea class="ca-input" id="${id}" name="${id}" rows="${rows || 5}"${req}></textarea>`;
  } else if (type === "select") {
    control = `<select class="ca-input ca-select" id="${id}" name="${id}"${req}${ac}>\n${options
      .map((o) => `                ${o.group ? `<optgroup label="${esc(o.group)}">${o.items.map((i) => `<option${i === "Oman" ? " selected" : ""}>${esc(i)}</option>`).join("")}</optgroup>` : `<option>${esc(o)}</option>`}`)
      .join("\n")}\n              </select>`;
  } else {
    control = `<input class="ca-input" id="${id}" name="${id}" type="${type}"${ac}${req}>`;
  }
  return `            <div class="ca-field${full ? " ca-field--full" : ""}">
              <label for="${id}">${esc(label)}${star}</label>
              ${control}
            </div>`;
}

const HONEYPOT = `            <div class="form-hp" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>`;

function formNote() {
  return `<p class="ca-form-note">Submitting opens your email app with the message ready to send to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>`;
}

// ─── Contact page ──────────────────────────────────────────────────────────
function infoCard({ ic, label, lines, href, cta }) {
  const ext = href ? extAttrs(href) : "";
  const body = `<span class="info-card-icon" aria-hidden="true">${icon(ic, 22)}</span>
            <span class="info-card-text">
              <span class="info-card-label">${esc(label)}</span>
              <span class="info-card-value">${lines.map(esc).join("<br>")}</span>
              ${cta ? `<span class="info-card-cta">${esc(cta)} <span class="arrow">${ext ? "↗" : "→"}</span></span>` : ""}
            </span>`;
  return href
    ? `          <a class="info-card reveal" href="${esc(href)}"${ext}>
            ${body}
          </a>`
    : `          <div class="info-card reveal">
            ${body}
          </div>`;
}

function contactPage() {
  const file = "contact.html";
  const chrome = (html) => markCompany(relink(html), file);

  const main = `<main id="main" class="service-page company-page">

${pageHero({
  image: "oman-network.jpg",
  crumb: "Contact Us",
  kicker: "Contact Us",
  h1: "Get in Touch",
  lead: "Talk to our cloud specialists and discover the right infrastructure, security and digital services for your organization.",
  chips: [
    chipLink(PHONE.href, "phone", PHONE.label),
    chipLink(`mailto:${CONTACT_EMAIL}`, "mail", "Info@CloudAcropolis.om"),
    chipLink(WHATSAPP, "chat", "WhatsApp"),
  ],
})}

  <!-- ============ CONTACT INFO + FORM ============ -->
  <section class="section" id="message" data-screen="Contact">
    <div class="container contact-layout">
      <div class="contact-info">
        <p class="eyebrow">Contact Information</p>
        <h2 class="section-title">We&rsquo;re here to help</h2>
        <p class="section-intro">Headquarters: Ghala Industrial Area. Reach our team by phone, email or WhatsApp &mdash; or send us your requirements and we&rsquo;ll get back to you.</p>

        <div class="info-cards">
${infoCard({ ic: "pin", label: "Address", lines: ADDRESS_LINES, href: MAPS_URL, cta: "Get directions" })}
${infoCard({ ic: "phone", label: "Phone", lines: [PHONE.label], href: PHONE.href, cta: "Call us" })}
${infoCard({ ic: "mail", label: "Email", lines: ["Info@CloudAcropolis.om"], href: `mailto:${CONTACT_EMAIL}`, cta: "Write to us" })}
${infoCard({ ic: "chat", label: "WhatsApp", lines: ["Chat with our team"], href: WHATSAPP, cta: "Start a chat" })}
        </div>
      </div>

      <div class="form-card reveal">
        <p class="eyebrow">Send us a Message</p>
        <h2 class="form-card-title">Tell us what you need</h2>
        <form class="ca-form" data-mailto="${CONTACT_EMAIL}" data-subject="Website enquiry – Contact Us" novalidate>
          <div class="ca-grid">
${field({ id: "name", label: "Your Name", autocomplete: "name", full: true })}
${field({ id: "email", label: "Email Address", type: "email", autocomplete: "email" })}
${field({ id: "phone", label: "Phone Number", type: "tel", autocomplete: "tel", required: false })}
${field({ id: "message", label: "Message / Requirements", type: "textarea", full: true, rows: 6 })}
${HONEYPOT}
          </div>
          <button class="btn btn-primary btn-block" type="submit">Send Message Now <span class="arrow">→</span></button>
          <p class="form-status" role="status" aria-live="polite"></p>
          ${formNote()}
        </form>
      </div>
    </div>
  </section>

  <!-- ============ LOCATION ============ -->
  <section class="section section-alt" id="location" data-screen="Location">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">Our Location</p>
          <h2 class="section-title">Cloud Data Center, Ghala</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">Building 2073, Way 6025, Ghala Industrial Area, Muscat, Sultanate of Oman.</p>
        </div>
      </div>
      <div class="map-card reveal">
        <iframe src="${esc(MAPS_EMBED)}" title="Map showing the Cloud Acropolis data center in Ghala, Muscat" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <div class="map-card-panel">
          <span class="brand-quad" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <p class="map-card-title">Cloud Acropolis</p>
          <p class="map-card-text">${ADDRESS_LINES.map(esc).join("<br>")}</p>
          <a class="btn btn-primary btn-sm" href="${esc(MAPS_URL)}" target="_blank" rel="noopener">Open in Google Maps <span class="arrow">↗</span></a>
        </div>
      </div>
    </div>
  </section>

</main>`;

  return documentHtml({
    title: "Contact Us | Cloud Acropolis",
    description: "Get in touch with Cloud Acropolis — Cloud Data Center, Building 2073, Way 6025, Ghala Industrial Area, Muscat. Call +968 9239 4675 or email Info@CloudAcropolis.om.",
    image: "oman-network.jpg",
    chrome,
    main,
  });
}

// ─── Partner page ──────────────────────────────────────────────────────────
const PARTNER_WAYS = [
  "A dedicated project management and support team to drive your next initiative and boost your brand visibility in the market.",
  "Proven innovation and dependability in the tech industry—offering a solid foundation for building and delivering your services.",
  "State-of-the-art facilities designed to meet every demand of your business's IT infrastructure.",
];

const PARTNER_SERVICES = [
  ["server", "Infrastructure"],
  ["building", "Colocation"],
  ["layers", "SAAS Solutions"],
  ["globe", "Web-Hosting"],
  ["network", "Network Services"],
  ["headset", "Managed Services"],
  ["refresh", "Disaster Recovery"],
  ["chart", "Data Science"],
];

const TECH_PARTNERS = ["Microsoft", "Alien Vault", "Red Hat", "Ubuntu", "RIPE NCC", "Crayon"];

const COUNTRIES = [
  { group: "GCC", items: ["Oman", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain"] },
  { group: "Middle East & Africa", items: ["Egypt", "Iraq", "Jordan", "Lebanon", "Yemen", "Morocco", "Tunisia", "Algeria", "Kenya", "Nigeria", "South Africa"] },
  { group: "Asia", items: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Philippines", "Indonesia", "Malaysia", "Singapore", "China", "Japan"] },
  { group: "Europe & Americas", items: ["United Kingdom", "Germany", "France", "Netherlands", "Turkey", "United States", "Canada", "Brazil", "Australia"] },
  { group: "Other", items: ["Other"] },
];

function partnerPage() {
  const file = "partner.html";
  const chrome = (html) => markCompany(relink(html), file);

  const ways = PARTNER_WAYS.map(
    (w, i) => `          <li class="partner-way reveal" style="--d:${i * 80}ms">
            <span class="partner-way-num">0${i + 1}</span>
            <p>${esc(w)}</p>
          </li>`
  ).join("\n");

  const services = PARTNER_SERVICES.map(
    ([ic, label], i) => `        <div class="partner-svc reveal" style="--d:${(i % 4) * 60}ms">
          <span class="feature-icon" aria-hidden="true">${icon(ic, 22)}</span>
          <h3>${esc(label)}</h3>
        </div>`
  ).join("\n");

  const logos = TECH_PARTNERS.map(
    (name, i) => `            <li class="logo-tile"><img src="assets/images/partner/partner-tech-logo-0${i + 1}.png" alt="${esc(name)}" width="200" height="72" loading="lazy"></li>`
  ).join("\n");

  const main = `<main id="main" class="service-page company-page">

${pageHero({
  image: "hero-datacenter.jpg",
  crumb: "Become a Partner",
  kicker: "Partner Program",
  h1: "Become a partner",
  lead: "Cloud Acropolis is your ideal technology partner and data center in Oman and the Middle East.",
  chips: [
    chipStatic("pulse", "Near 100% Uptime"),
    chipStatic("award", "Rating IV Data Center By Local Authority"),
    chipStatic("shield", "Trusted by Enterprises and Corporates"),
  ],
})}

  <!-- ============ OPPORTUNITY ============ -->
  <section class="section" id="opportunity" data-screen="Opportunity">
    <div class="container partner-intro">
      <div class="partner-intro-copy">
        <p class="eyebrow">Why partner with us</p>
        <h2 class="section-title">Strategic Partnership Opportunity</h2>
        <p class="section-intro">Cloud Acropolis is your ideal technology partner and data center in Oman and the Middle East. We recognize the value of the solutions you provide, and we invite you to collaborate with us. By partnering with Cloud Acropolis, you can harness our infrastructure, facilities, and expert support to deliver exceptional services to your customers.</p>

        <h3 class="partner-ways-title">Three ways we help elevate your business.</h3>
        <ol class="partner-ways">
${ways}
        </ol>
        <a class="btn btn-primary" href="#apply">Partner With Us <span class="arrow">→</span></a>
      </div>

      <figure class="partner-photo reveal">
        <img src="assets/images/why-datacenter.jpg" alt="Inside the Cloud Acropolis data center in Muscat" loading="lazy">
        <figcaption>
          <span class="brand-quad" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span><strong>Rating IV Data Center</strong><span>Ghala, Muscat &mdash; Sultanate of Oman</span></span>
        </figcaption>
      </figure>
    </div>
  </section>

  <!-- ============ SERVICES ============ -->
  <section class="section section-alt" id="services" data-screen="Services">
    <div class="container">
      <div class="split-head">
        <div>
          <p class="eyebrow">What you can deliver</p>
          <h2 class="section-title">Build on our services</h2>
        </div>
        <div class="split-head-aside">
          <p class="section-intro">Harness our infrastructure, facilities, and expert support to deliver exceptional services to your customers.</p>
        </div>
      </div>
      <div class="partner-svc-grid">
${services}
      </div>
    </div>
  </section>

  <!-- ============ CERTIFICATION + TECHNOLOGY PARTNERS ============ -->
  <section class="section" id="trust" data-screen="Certified">
    <div class="container trust-grid">
      <div class="trust-card reveal">
        <p class="eyebrow">Certified</p>
        <h2 class="trust-title">Certified &amp; compliant</h2>
        <div class="cert-row">
          <a class="cert-thumb" href="assets/images/partner/partner-certificate-lg.png" target="_blank" rel="noopener">
            <img src="assets/images/partner/partner-certificate-sm.png" alt="Data center rating certificate" width="200" height="275" loading="lazy">
            <span class="cert-thumb-cta">View certificate <span class="arrow">↗</span></span>
          </a>
          <img class="cert-logos" src="assets/images/partner/certified-logos.png" alt="ISO 9001:2015, ISO 27001 Information Security and PCI DSS Compliant" width="338" height="134" loading="lazy">
        </div>
      </div>

      <div class="trust-card reveal" style="--d:80ms">
        <p class="eyebrow">Technology Partners</p>
        <h2 class="trust-title">Working with industry leaders</h2>
        <ul class="logo-grid">
${logos}
        </ul>
      </div>
    </div>
  </section>

  <!-- ============ PARTNER FORM ============ -->
  <section class="section section-dark apply-section" id="apply" data-screen="Apply">
    <div class="container">
      <div class="final-cta contact-panel">
        <div class="final-cta-glow" aria-hidden="true"></div>
        <div class="contact-split apply-split">
          <div class="contact-copy">
            <p class="eyebrow eyebrow--light">Partner With Us</p>
            <h2>Let&rsquo;s get <span class="text-glow">started</span></h2>
            <p class="contact-lead">Fill out this simple form to get started. Our team will get back to you shortly</p>
            <div class="contact-card">
              <p class="contact-card-title">Prefer to talk first?</p>
              <div class="contact-items">
                <a class="contact-item" href="${PHONE.href}">
                  <span class="contact-item-icon" aria-hidden="true">${icon("phone")}</span>
                  <span class="contact-item-text"><span class="contact-item-label">Call us</span><span class="contact-item-value">${PHONE.label}</span></span>
                  <span class="contact-item-go" aria-hidden="true">→</span>
                </a>
                <a class="contact-item" href="mailto:Info@CloudAcropolis.om">
                  <span class="contact-item-icon" aria-hidden="true">${icon("mail")}</span>
                  <span class="contact-item-text"><span class="contact-item-label">Email</span><span class="contact-item-value">Info@CloudAcropolis.om</span></span>
                  <span class="contact-item-go" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          <div class="form-card">
            <h3 class="form-card-title">Become a partner</h3>
            <form class="ca-form" data-mailto="${CONTACT_EMAIL}" data-subject="Partner Request – Cloud Acropolis" novalidate>
              <div class="ca-grid">
${field({ id: "first-name", label: "First Name", autocomplete: "given-name" })}
${field({ id: "last-name", label: "Last Name", autocomplete: "family-name" })}
${field({ id: "business-email", label: "Business Email", type: "email", autocomplete: "email" })}
${field({ id: "phone", label: "Phone Number", type: "tel", autocomplete: "tel" })}
${field({ id: "company", label: "Company Name", autocomplete: "organization" })}
${field({ id: "country", label: "Country", type: "select", autocomplete: "country-name", options: COUNTRIES })}
${field({ id: "message", label: "Message", type: "textarea", full: true, rows: 4 })}
            <div class="ca-field ca-field--full ca-check">
              <input id="news" name="news" type="checkbox">
              <label for="news">Yes, I&rsquo;d like to receive occasional news and tips</label>
            </div>
${HONEYPOT}
              </div>
              <button class="btn btn-primary btn-block" type="submit">Become A Partner <span class="arrow">→</span></button>
              <p class="form-status" role="status" aria-live="polite"></p>
              ${formNote()}
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>`;

  return documentHtml({
    title: "Become a Partner | Cloud Acropolis",
    description: "Partner with Cloud Acropolis — a Rating IV data center in Oman. Harness our infrastructure, facilities and expert support to deliver exceptional services to your customers.",
    image: "hero-datacenter.jpg",
    chrome,
    main,
  });
}

// ─── Write ─────────────────────────────────────────────────────────────────
for (const p of pages) {
  await writeFile(join(root, `${p.slug}.html`), page(p));
}
await writeFile(join(root, "contact.html"), contactPage());
await writeFile(join(root, "partner.html"), partnerPage());
console.log(`Wrote ${pages.length + 2} pages:\n${[...pages.map((p) => `${p.slug}.html`), "contact.html", "partner.html"].map((f) => `  ${f}`).join("\n")}`);
