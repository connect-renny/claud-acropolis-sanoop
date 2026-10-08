# Ready to HTML — v6.1

A static HTML starter kit. Bootstrap 5.3 for the grid, Swiper 14 for sliders,
Lenis 1.3 for smooth scroll, and an SCSS design-token layer that owns every
colour, size and easing on the page.

No bundler, no framework, no build step at deploy time. Sass compiles to one
stylesheet; everything else is plain HTML plus a single `main.js`.

**Contents**

1. [Quick start](#quick-start)
2. [npm scripts](#npm-scripts)
3. [Project layout](#project-layout)
4. [How the pieces fit](#how-the-pieces-fit)
5. [Design tokens](#design-tokens)
6. [Sass toolbox](#sass-toolbox)
7. [CSS reference](#css-reference)
8. [JavaScript](#javascript)
9. [Accessibility](#accessibility)
10. [RTL](#rtl)
11. [Updating a vendored library](#updating-a-vendored-library)
12. [Deploying](#deploying)
13. [Troubleshooting](#troubleshooting)

---

## Quick start

Requires Node 20+.

```bash
npm install
npm run vendor   # copy Bootstrap, Swiper, Lenis, icons and the font into assets/
npm run dev      # Sass --watch + browser-sync on http://localhost:3000
```

`npm run dev` recompiles on save and reloads the browser. Open `index.html`,
put your markup inside `<main>`, and go.

Before you ship:

```bash
npm run build    # expanded + compressed CSS, both autoprefixed
```

Then upload the HTML files and `assets/` — see [Deploying](#deploying).

## npm scripts

| Script      | What it does                                                             |
| ----------- | ------------------------------------------------------------------------ |
| `dev`       | Watch SCSS and serve with live reload on port 3000                       |
| `vendor`    | Copy third-party bundles from `node_modules` into `assets/`              |
| `build:css` | Compile `style.css` (expanded) and `style.min.css` (compressed)          |
| `prefix`    | Run Autoprefixer over both compiled files, in place                      |
| `build`     | `build:css` then `prefix` — run this before deploying                    |
| `lint:css`  | Stylelint over `scss/` — unknown properties, bad values, duplicate rules |
| `format`    | Prettier over HTML, SCSS, JS, JSON and Markdown                          |
| `clean`     | Delete the compiled CSS and source maps                                  |

Browser support is the `browserslist` field in `package.json`. Change it there
and Autoprefixer follows; nothing else needs touching.

## Project layout

```
index.html        blank starter: <head> wired up, skip link, empty <main>
scss/
  style.scss      the entry point — import order matters, see below
  abstracts/      functions, mixins, Sass variables — emits no CSS
  base/           tokens (_root), @font-face, reset, typography, a11y
  layout/         container, header, navigation, section, footer
  components/     buttons, cards, forms, swiper, loader, back-to-top, animations
  pages/          page-specific styles only (_home)
  utilities/      spacing and helpers — last, so their !important wins
assets/
  css/            vendor stylesheets + compiled style.css / style.min.css
  js/             vendor bundles + main.js
  fonts/          Orbitron Variable (one woff2, 400–900) + Bootstrap Icons
  images/         favicons, logo
scripts/
  vendor.mjs      the only thing that writes vendor files into assets/
```

Import order in `scss/style.scss`: abstracts → base → layout → components →
pages → utilities. Tokens must land before anything that reads them, and
utilities go last so their `!important` actually applies.

Compiled CSS (`style.css`, `style.min.css`, `*.map`) is gitignored —
regenerate it with `npm run build`.

## How the pieces fit

**`index.html`** loads, in order: Bootstrap CSS, Bootstrap Icons, Swiper CSS,
then `style.css` last because it owns the tokens the others are themed with. A
~120-byte inline script restores a saved dark theme before first paint. At the
bottom, `bootstrap.bundle`, `lenis`, `swiper` and finally `main.js`, which reads
`window.Lenis` and `window.Swiper` at init and therefore must come last.

`<html>` starts with `class="no-js"`; `main.js` removes it. Anything that
depends on JavaScript (reveal animations, for one) falls back to a visible,
static state while the class is present.

**Every module in `main.js` is independent.** Each one looks for its own
markup, bails out silently if it isn't there, and never assumes another module
ran. An empty `<body>` boots cleanly, and you can delete any block of HTML
without breaking the rest.

**Two things live in exactly one place:**

- The fixed-header offset is `scroll-padding-top` on `<html>`
  (`scss/base/_reset.scss`). Anchor jumps, `scrollIntoView()` and Lenis all
  honour it, so don't add `scroll-margin-top` to sections or offsets in JS.
- Layering is the `--z-*` scale in `_root.scss`. Never write a raw `z-index`.

## Design tokens

Everything themeable is a CSS custom property in `scss/base/_root.scss`:

| Group      | Tokens                                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Colour     | `--color-brand` / `--color-brand-rgb`, `--color-accent`, semantic (`--color-text`, `-text-muted`, `-heading`, `-bg`, `-surface`, `-border`, `-link`, `-link-hover`, `-focus`), feedback (`-success`, `-warning`, `-danger`, `-info`), `--dark-100…950` |
| Type       | `--primary-font` / `--body-font` / `--heading-font` / `--mono-font`, `--fw-*` 200–900, `--lh-*`, `--ls-*`                                                                                                                                              |
| Type scale | Fixed `--fs-xs … --fs-10xl`, `--fs-display-xs … -4xl`; fluid `--fs-fluid-md … -7xl`                                                                                                                                                                    |
| Spacing    | `--space-3xs` (4px) … `--space-3xl` (96px), `--section-space` (fluid 64→120px), `--container-gutter`, `--container-max`                                                                                                                                |
| Radius     | `--radius-none / sm / md / lg / xl / pill / circle`                                                                                                                                                                                                    |
| Elevation  | `--shadow-sm / md / lg`, `--shadow-header`                                                                                                                                                                                                             |
| Motion     | `--transition-fast / duration / slow`, `--ease-out / in-out / spring`                                                                                                                                                                                  |
| Layering   | `--z-below / base / sticky / header / drawer / overlay / modal / toast / loader`                                                                                                                                                                       |
| Sizing     | `--header-height`, `--header-height-fixed`                                                                                                                                                                                                             |

Change `--color-brand` and the whole site follows — shadows and the hero scrim
are derived from `--color-brand-rgb`, so update both together.

They're custom properties rather than Sass variables on purpose: they can be
read and changed at runtime, which is what makes the dark theme a one-line
toggle instead of a second stylesheet. Compile-time-only values (breakpoints,
which utilities to generate) stay as Sass variables in `abstracts/_variables.scss`.

**Prefer the fluid sizes** (`--fs-fluid-*`) for anything display-sized. They
interpolate with the viewport between 576px and 1600px, so headings need no
media queries.

### Font

One variable font file (`orbitron-latin-wght-normal.woff2`, 12KB) covers
weights 400–900, so every `.fw-*` helper renders as a real weight rather than a
faux-bold. It's preloaded in the `<head>` with `font-display: swap`.

To swap the typeface: install another `@fontsource-variable/*` package, add it
to `scripts/vendor.mjs`, update `scss/base/_fonts.scss` and `--primary-font`,
and change the `<link rel="preload">` in `index.html`.

### Dark theme

Inert until something sets `<html data-theme="dark">`. Toggle it with
`App.theme.toggle()` or add `data-theme-toggle` to any button. The choice
persists in `localStorage`, and the inline script in `<head>` restores it
before first paint so there's no light→dark flash. `prefers-color-scheme` is
deliberately ignored, so a light-only build stays light.

In dark mode `--color-brand` becomes a lighter tint (`#8577c2`) rather than
white: it has to work as ink on the dark background _and_ as a surface under
white text (`.section--brand`, `.footer`, the default `.btn`). Style a
dark-only override with the `dark` mixin.

## Sass toolbox

Everything in `scss/abstracts/`, available in any partial via
`@use "../abstracts" as *;`.

**Functions**

| Function        | Returns                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `bp("md")`      | The breakpoint value, or a compile error naming the valid keys              |
| `rem(24)`       | `1.5rem`                                                                    |
| `fluid(32, 64)` | A `clamp()` that grows 32→64px from 576px to 1600px (`$from`/`$to` to tune) |

**Mixins**

| Mixin                                        | Emits                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `mq-up("md")` / `mq-down("md")`              | `@media (width >= 768px)` / `@media (width < 768px)` — range syntax    |
| `mq-between("md", "xl")`                     | `@media (768px <= width < 1200px)`                                     |
| `cq-up(480px)`                               | A container query; put `.cq` on the wrapper                            |
| `dark`                                       | `[data-theme="dark"] & { … }`                                          |
| `motion-ok`                                  | `@media (prefers-reduced-motion: no-preference)`                       |
| `hover`                                      | `:hover` only on devices that hover — no sticky hover on touch         |
| `transEase((opacity, transform), $duration)` | A `transition` list using the motion tokens                            |
| `focus-ring($color, $offset)`                | A visible `:focus-visible` outline                                     |
| `flex-center` / `flex-between`               | The usual flex shorthands, with optional `$gap`                        |
| `cover`                                      | `position: absolute; inset: 0` fill                                    |
| `auto-grid($min, $gap)`                      | `repeat(auto-fit, minmax(...))` grid that wraps without breakpoints    |
| `ratio(16, 9)`                               | `aspect-ratio` box whose `img`/`video`/`iframe` child is object-fitted |
| `line-clamp(3)` / `truncate`                 | Multi-line / single-line ellipsis                                      |
| `visually-hidden`                            | Hidden from sight, present for screen readers                          |

Breakpoints (`sm` 576 · `md` 768 · `lg` 992 · `xl` 1200 · `xxl` 1400 ·
`xxxl` 1600) match Bootstrap 1:1, so `.px-md-16px` and Bootstrap's `.px-md-3`
kick in at the same width.

## CSS reference

Class names the kit ships. Bootstrap's own classes work alongside all of these.

### Layout

| Class                                                                                           | Notes                                                                      |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `.container` / `.container-fluid`                                                               | Bootstrap's, capped at 1600px with a guaranteed 16px gutter at every width |
| `.container-narrow`                                                                             | Full-bleed section with an inner container-width column                    |
| `.section`                                                                                      | Fluid vertical rhythm (`--section-space`)                                  |
| `.section--sm` / `--lg`                                                                         | 0.6× / 1.4× the padding                                                    |
| `.section--flush-top` / `--flush-bottom`                                                        | Drop one side                                                              |
| `.section--surface` / `--brand`                                                                 | Surface-grey / brand-coloured background (brand flips headings to white)   |
| `.section-head` (`--center`), `-eyebrow`, `-title`, `-lead`                                     | Section heading block                                                      |
| `.header`, `.navbar-main`                                                                       | Fixed header. `main.js` adds `.navbar-fixed` past 10px of scroll           |
| `.navbar-toggler`                                                                               | Hamburger: three `<span>`s, animates on `aria-expanded="true"`             |
| `.navbar-nav`                                                                                   | Becomes an off-canvas drawer below `lg`; `.is-open` shows it               |
| `.navbar-backdrop`                                                                              | Dimmed layer behind the drawer; `.is-open`                                 |
| `.has-fixed-header`                                                                             | Put on `<main>` when there's no hero and the nav would overlap section one |
| `.footer`, `-grid`, `-brand`, `-title`, `-links`, `-social`, `-bottom`, `-copy`                 | Footer pieces                                                              |
| `.hero`, `-slide`, `-bg`, `-content`, `-eyebrow`, `-title`, `-text`, `-actions`, `.hero-scroll` | Home hero (`pages/_home.scss`)                                             |

### Components

| Class                                                                                 | Notes                                                                                              |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `.btn`                                                                                | Base button — brand fill, 48px min height. `.btn-primary` is a legacy alias for `.btn.btn--light`  |
| `.btn--light` / `--outline` / `--outline-light` / `--accent` / `--ghost`              | Colour variants — each only overrides four custom properties                                       |
| `.btn--sm` / `--lg` / `--block` / `--pill` / `--icon`                                 | Size and shape                                                                                     |
| `.btn--shine`                                                                         | Diagonal gloss sweep on hover                                                                      |
| `.link-arrow`                                                                         | Uppercase text link whose icon nudges on hover                                                     |
| `.card-item` › `.card-media`, `.card-body`, `.card-title`, `.card-text`, `.card-meta` | Card. The title link is stretched over the whole card, so it's one link to a screen reader         |
| `.auto-grid` (`--sm`, `--lg`)                                                         | Wrapping card grid, no breakpoints (280 / 200 / 360px minimum columns)                             |
| `.stat` › `.stat-value`, `.stat-label`                                                | Big number + label, tabular digits so counters don't jitter                                        |
| `.form-field`, `.form-label` (`.required`), `.form-control`, `.form-select`           | Pair every control with a real `<label>`                                                           |
| `.form-error`, `.form-hint`, `.form-check`                                            | Field-level messaging                                                                              |
| `.form-hp`                                                                            | Honeypot — bots fill it, humans never see it, `main.js` blocks the submit                          |
| `.form-status`                                                                        | Submit feedback; `data-state="success                                                              | error"`, hidden when empty |
| `.loader-overlay` › `.loader`, `.loader-bar`                                          | Preloader. Only include it if you really need it — `main.js` hides it on `load` with a 5s failsafe |
| `.return-top`                                                                         | Back-to-top button; `.is-visible` after scrolling                                                  |
| `.swiper` (+ `.js-swiper`)                                                            | Swiper markup, styled in `components/_swiper.scss`                                                 |

### Typography

`.lead`, `.eyebrow`, `.text-muted`, `.prose` (opts a block back into list
markers), `.measure` / `.measure-sm` (68ch / 48ch max width).

### Utilities

Spacing classes are pixel-based and use **logical properties**, so they mirror
in RTL:

```
{prop}{-breakpoint}-{value}px      .pt-24px   .px-md-16px   .gap-lg-32px
```

- Props: `p px py pt pb ps pe`, `m mx my mt mb ms me`, `gap gap-x gap-y`
- Values: `0 4 8 12 16 20 24 32 40 48 64 80 100 128`
- Breakpoints: `md lg xl xxl` (mobile-first)
- Also `.w-{n}px` / `.h-{n}px` — fixed sizing, with min/max locked

The lists that generate these live in `abstracts/_variables.scss`
(`$spaces`, `$utility-breakpoints`). They're the biggest thing the stylesheet
emits (~4KB gzipped by default), so add a value only when you reach for it.

Other helpers (`utilities/_helpers.scss`):

| Group      | Classes                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Type       | `.fs-xs … .fs-10xl`, `.fs-fluid-md … -7xl`, `.fw-400 … .fw-900`, `.line-clamp-1…6`, `.truncate`                                        |
| Colour     | `.text-brand / -accent / -text / -text-muted / -success / -warning / -danger / -info / -white`, `.bg-brand / -accent / -bg / -surface` |
| Shape      | `.radius-none / -sm / -md / -lg / -xl / -pill / -circle`, `.shadow-sm / -md / -lg / -none`                                             |
| Media      | `.ratio-16x9 / -4x3 / -3x2 / -1x1 / -21x9`, `.object-cover`, `.object-contain`                                                         |
| Layout     | `.flex-center`, `.flex-between`, `.stack`, `.full-cover`, `.full-bleed`, `.cq`                                                         |
| Visibility | `.hide-{md,lg,xl,xxl}-up`, `.hide-{md,lg,xl,xxl}-down`                                                                                 |
| State      | `.link-inherit`, `.pointer-none`, `.pointer-auto`, `.no-select`, `.cursor-pointer`                                                     |

## JavaScript

`assets/js/main.js` exposes `window.App`:

| Member                       | Description                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `App.lenis`                  | The smooth-scroll instance, or `null` (reduced motion, or Lenis not loaded)            |
| `App.sliders`                | `{ banner, galleryBig, galleryThumb, custom0… }` — or the name from `data-swiper-name` |
| `App.scrollTo(target, opts)` | Scrolls to an element, selector or px offset, clearing the fixed header                |
| `App.theme.get/set/toggle()` | Dark theme control                                                                     |

`document` fires **`app:ready`** (with `App` in `event.detail`) once every
module has booted — hook page-specific code there rather than on
`DOMContentLoaded`.

### Markup hooks

Add the attribute, get the behaviour. No JS to write.

| Hook                                  | Effect                                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `data-reveal`                         | Fades and slides in on scroll. Values: `left`, `right`, `zoom`, `fade`. `data-reveal-delay="120"` (ms) staggers it.              |
| `data-count="99.9"`                   | Counts up when scrolled into view. Also `data-count-decimals`, `-prefix`, `-suffix`, `-duration`. Uses `Intl` grouping.          |
| `data-validate` on a `<form>`         | Inline validation on blur, focus to the first invalid field on submit, honeypot check. `data-error` on a field sets its message. |
| `data-validate="fetch"`               | Same, then POSTs with `fetch()` and writes the result to `.form-status`. `data-success-message` / `data-fail-message`.           |
| `data-nav-hide` on `.navbar-main`     | Hides the header on scroll down, reveals on scroll up.                                                                           |
| `.js-swiper` + `data-swiper='{…}'`    | A one-off slider configured from JSON. `data-swiper-name="x"` exposes it as `App.sliders.x`.                                     |
| `data-theme-toggle`                   | Flips the dark theme and maintains `aria-pressed`.                                                                               |
| `data-no-scroll` on an `a[href^="#"]` | Opts a hash link out of `App.scrollTo`. Bootstrap tabs and collapse triggers are skipped automatically.                          |
| `data-lenis-prevent`                  | Opts an inner scroll container out of Lenis (also `-wheel`, `-touch`, `-vertical`, `-horizontal`).                               |
| `.year`                               | Filled with the current year. Never hard-code a copyright year.                                                                  |

### Reveal animations vs AOS

`data-reveal` is ~200 bytes of CSS against AOS's 16KB, and it respects
`prefers-reduced-motion`. AOS is neither loaded nor initialised. Its files
(`aos.css`, `aos.js`) are still in `assets/` in case a project needs its
attribute API — add the `<link>`, the `<script>` and an `AOS.init()` call
yourself, or delete the two files.

## Accessibility

Built in, and worth not undoing:

- A skip link (`.skip-link`) is the first focusable element on the page.
- Real focus rings on every interactive element (`focus-ring` mixin,
  `--color-focus`).
- The mobile drawer traps Tab, closes on Escape, restores focus to the
  hamburger, and is `inert` while off-screen (with `visibility: hidden` as
  the CSS-only safety net).
- In-page links move focus to the target section, not just the viewport.
- `body.is-locked` locks scroll without the layout jumping — `main.js` sets
  `--scrollbar-width` first.
- 48px minimum touch targets on buttons; 44px on the hamburger.
- `prefers-reduced-motion` disables smooth scroll, autoplay, reveals and
  counters.
- Form errors are linked with `aria-describedby`; `.form-status` is a live
  region.
- Form controls use a 16px minimum font size, below which iOS Safari zooms the
  page on focus.
- `.sr-only` / `.visually-hidden` for icon-only buttons; `.sr-only-focusable`
  for things that should appear on focus.

## RTL

Set `dir="rtl"` on `<html>` and swap `bootstrap.min.css` for
`bootstrap.rtl.min.css` (both are vendored). The kit's own spacing utilities
use logical properties (`padding-inline-start`, not `padding-left`), so they
mirror themselves — as do the drawer's slide direction and the select's
chevron.

## Updating a vendored library

The bundles in `assets/css`, `assets/js` and `assets/fonts` are **copies**
owned by `scripts/vendor.mjs`. To bump Swiper (or anything else):

```bash
npm install swiper@latest
npm run vendor
```

The script prints the versions it copied. Never hand-edit a vendored file —
the next `npm run vendor` overwrites it. (`aos.css` / `aos.js` are the
exception: they're not in the vendor list and won't be touched.)

Shipped versions: Bootstrap 5.3.8 · Bootstrap Icons 1.13.1 · Swiper 14.2 ·
Lenis 1.3.26 · Orbitron Variable (Fontsource 5.3).

After bumping Lenis, re-check `scss/components/_smooth-scroll.scss` against
`node_modules/lenis/dist/lenis.css` — the required Lenis stylesheet is inlined
there so it can't be forgotten when the kit is copied.

## Deploying

```bash
npm run build
```

Upload the HTML files and `assets/`. Nothing else is needed at runtime —
`scss/`, `scripts/`, `node_modules/` and the config files stay behind.

## Troubleshooting

**`npm run prefix` exits with "You did not set any plugins"** —
`postcss.config.js` is missing or was moved. It has to sit at the project root.

**The header overlaps the first section** — the page has no hero. Add
`.has-fixed-header` to `<main>`.

**A section jumps to the wrong offset from an anchor link** — something added
`scroll-margin-top` or a JS offset. Remove it; `scroll-padding-top` on `<html>`
already accounts for the header.

**Reveal elements never appear** — `main.js` isn't loaded, or is loaded before
Lenis/Swiper. It must be the last `<script>`. With no JS at all the `.no-js`
class keeps everything visible.

**`npm audit` reports an `immutable` advisory** — it's inside browser-sync, a
dev-server dependency. Nothing from it ships. Safe to ignore.
