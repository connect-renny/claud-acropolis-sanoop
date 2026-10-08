// ═══════════════════════════════════════════════════════════════════════════
//  npm run pages
//
//  Writes one page per service (linux-server.html, …) into the site root,
//  next to index.html, from content/services.json.
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

// ─── Page ──────────────────────────────────────────────────────────────────
function page(p) {
  const file = `${p.slug}.html`;
  const cat = CATEGORIES.find((c) => c.key === p.category);
  const title = `${p.h1} | Cloud Acropolis`;
  const chrome = (html) => markCurrent(relink(html), file);

  return `<!doctype html>
<!--
  Generated by \`npm run pages\` (scripts/build-services.mjs) from
  content/services.json. Edit those, not this file — it is overwritten.
-->
<html lang="en" dir="ltr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="assets/images/${esc(p.image)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="assets/images/logo.png">
<meta name="theme-color" content="#ffffff">

<link rel="preload" href="assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

${chrome(header)}

<main id="main" class="service-page">

${hero(p, cat)}

${plans(p)}
${features(p)}${faq(p)}
${chrome(contact)}

</main>

${chrome(footer)}

${relink(scripts)}
</body>
</html>
`;
}

for (const p of pages) {
  await writeFile(join(root, `${p.slug}.html`), page(p));
}
console.log(`Wrote ${pages.length} pages:\n${pages.map((p) => `  ${p.slug}.html`).join("\n")}`);
