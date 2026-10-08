// ═══════════════════════════════════════════════════════════════════════════
//  npm run vendor
//
//  Copies the third-party bundles out of node_modules into assets/, so the
//  versions shipped are always the versions in package.json. Bump a version,
//  `npm install`, `npm run vendor` — done. Never hand-edit the files in
//  assets/css, assets/js or assets/fonts that this script owns.
// ═══════════════════════════════════════════════════════════════════════════

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = join(root, "node_modules");
const out = (...p) => join(root, "assets", ...p);
// Read package.json directly — some packages (Lenis) don't export it.
const version = async (pkg) =>
  JSON.parse(await readFile(join(nm, pkg, "package.json"), "utf8")).version;

// [source (relative to node_modules), destination (relative to assets/)]
const files = [
  ["bootstrap/dist/css/bootstrap.min.css", "css/bootstrap.min.css"],
  ["bootstrap/dist/css/bootstrap.rtl.min.css", "css/bootstrap.rtl.min.css"],
  ["bootstrap/dist/js/bootstrap.bundle.min.js", "js/bootstrap.bundle.min.js"],
  ["bootstrap-icons/font/fonts/bootstrap-icons.woff2", "fonts/bootstrap-icons.woff2"],
  ["bootstrap-icons/font/fonts/bootstrap-icons.woff", "fonts/bootstrap-icons.woff"],
  ["swiper/swiper-bundle.min.css", "css/swiper-bundle.min.css"],
  ["swiper/swiper-bundle.min.js", "js/swiper-bundle.min.js"],
  ["lenis/dist/lenis.min.js", "js/lenis.min.js"],
  ["gsap/dist/gsap.min.js", "js/gsap.min.js"],
  [
    "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    "fonts/inter-latin-wght-normal.woff2",
  ],
];

await Promise.all([
  mkdir(out("css"), { recursive: true }),
  mkdir(out("js"), { recursive: true }),
  mkdir(out("fonts"), { recursive: true }),
]);

for (const [src, dest] of files) {
  await copyFile(join(nm, src), out(dest));
}

// Bootstrap Icons expects its fonts in ./fonts/ next to the CSS. The kit keeps
// fonts one level up in assets/fonts/, so rewrite the two url()s on the way in.
const icons = await readFile(join(nm, "bootstrap-icons/font/bootstrap-icons.min.css"), "utf8");
await writeFile(
  out("css/bootstrap-icons.min.css"),
  icons.replaceAll('url("fonts/', 'url("../fonts/')
);

const pkgs = ["bootstrap", "bootstrap-icons", "swiper", "lenis", "gsap", "@fontsource-variable/inter"];
const summary = await Promise.all(pkgs.map(async (p) => `  ${p.padEnd(32)} ${await version(p)}`));
console.log(`Vendored into assets/:\n${summary.join("\n")}`);
