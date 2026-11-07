/**
 * Builds web-ready brand assets from the supplied Orion Theory logo files
 * (public/brand/logo deliverables/). The logo artwork itself is never redrawn:
 * the supplied SVGs are copied byte-for-byte or rendered by sharp.
 *
 *   public/brand/*.svg         — clean-named copies of the supplied logos
 *   public/brand/orion-theory-mark-512.png — logo for structured data
 *   public/og/*.png            — 1200×630 social images
 *   public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
 *   public/site.webmanifest
 *
 * Run with: npm run og
 */
import sharp from 'sharp';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p) => resolve(root, 'public', p);
const src = (p) => resolve(root, 'public', 'brand', 'logo deliverables', p);

const C = {
  ink: '#0B0B0F',
  paper: '#FFFFFF',
  cream: '#FFF4E3',
  tomato: '#FF5A36',
  sun: '#FFC93D',
  cobalt: '#2350F5',
  mint: '#3ED99B',
};
// Raster text uses system fonts (librsvg); the site itself uses Archivo.
const BLACK = "'Arial Black', 'Arial Bold', Arial, sans-serif";
const SANS = "Arial, 'Helvetica Neue', sans-serif";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------------------------------------------------------------- logo copies
const copies = {
  'brand/lockup-ink.svg': 'lockup-horizontal/orion-theory-horizontal-black-transparent.svg',
  'brand/lockup-paper.svg': 'lockup-horizontal/orion-theory-horizontal-white-transparent.svg',
  'brand/wordmark-ink.svg': 'wordmark/orion-theory-wordmark-black.svg',
  'brand/wordmark-paper.svg': 'wordmark/orion-theory-wordmark-white.svg',
  'brand/mark-ink.svg': 'icon/mark-black.svg',
  'brand/mark-paper.svg': 'icon/mark-white.svg',
};
for (const [to, from] of Object.entries(copies)) {
  await mkdir(dirname(out(to)), { recursive: true });
  await copyFile(src(from), out(to));
  console.log('copied', to);
}
await copyFile(src('icon/favicon-dark.svg'), out('favicon.svg'));
console.log('copied favicon.svg');

/** Embed a supplied SVG file at (x, y) with the given width, keeping its proportions. */
async function place(file, x, y, width) {
  const svg = await readFile(src(file), 'utf8');
  const [, vw, vh] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
  const height = (width * Number(vh)) / Number(vw);
  return svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<svg\b[^>]*>/, `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${vw} ${vh}">`);
}

/** The logo's four-point star (same geometry as the mark), centred at cx, cy. */
const star = (cx, cy, r, fill) => {
  const a = r * 0.6;
  const b = r * 0.4;
  return `<path d="M${cx} ${cy - r}C${cx} ${cy - r + a} ${cx + b} ${cy} ${cx + r} ${cy}C${cx + b} ${cy} ${cx} ${cy + b} ${cx} ${cy + r}C${cx} ${cy + b} ${cx - b} ${cy} ${cx - r} ${cy}C${cx - b} ${cy} ${cx} ${cy - b} ${cx} ${cy - r}Z" fill="${fill}"/>`;
};

/** Stacked colour panels rising from the bottom edge (the site's hero motif). */
const stack = (x, y, w, colors) =>
  colors
    .map(
      (c, i) =>
        `<rect x="${x + i * 18}" y="${y + i * 62}" width="${w - i * 36}" height="400" rx="34" fill="${c}"/>`,
    )
    .join('');

// ---------------------------------------------------------------- OG images
async function brandOg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.ink}"/>
  ${await place('lockup-horizontal/orion-theory-horizontal-white-transparent.svg', 210, 92, 780)}
  ${stack(140, 420, 920, [C.sun, C.cobalt, C.tomato])}
</svg>`;
}

async function whatFlagOg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.sun}"/>
  ${await place('lockup-horizontal/orion-theory-horizontal-black-transparent.svg', 52, 44, 250)}
  <text x="60" y="300" font-family="${BLACK}" font-style="italic" font-size="128" fill="${C.ink}" letter-spacing="-5">What</text>
  <text x="60" y="420" font-family="${BLACK}" font-style="italic" font-size="128" fill="${C.ink}" letter-spacing="-5">Flag</text>
  <text x="64" y="486" font-family="${SANS}" font-weight="700" font-size="30" fill="${C.ink}">How well do you know the flags of the world?</text>
  <rect x="64" y="526" width="380" height="54" rx="12" fill="${C.ink}"/>
  <circle cx="92" cy="553" r="9" fill="${C.tomato}"/>
  <text x="112" y="562" font-family="${SANS}" font-weight="700" font-size="24" fill="${C.paper}">Coming soon to Google Play</text>
  <g transform="translate(700 120) scale(1.18)">
    <ellipse cx="200" cy="284" rx="150" ry="10" fill="rgba(11,11,15,0.14)"/>
    ${star(330, 50, 20, C.ink)}
    ${star(44, 209, 13, C.paper)}
    <circle cx="352" cy="214" r="7" fill="${C.cobalt}"/>
    <rect x="86" y="36" width="10" height="250" rx="3" fill="${C.ink}"/>
    <circle cx="91" cy="32" r="11" fill="${C.ink}"/>
    <path d="M96 48C150 30 200 72 252 56C284 46 304 40 332 50V176C304 166 284 172 252 182C200 198 150 156 96 174Z" fill="${C.tomato}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
    <text x="212" y="152" text-anchor="middle" font-family="${BLACK}" font-size="120" fill="${C.paper}" stroke="${C.ink}" stroke-width="4" paint-order="stroke">?</text>
  </g>
  <text x="1136" y="600" text-anchor="end" font-family="${SANS}" font-size="16" fill="${C.ink}" opacity="0.7">Pre-release artwork</text>
</svg>`;
}

async function articleOg(lines, category) {
  const text = lines
    .map(
      (l, i) =>
        `<text x="64" y="${262 + i * 84}" font-family="${BLACK}" font-style="italic" font-size="66" fill="${C.ink}" letter-spacing="-2">${esc(l)}</text>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.mint}"/>
  ${await place('lockup-horizontal/orion-theory-horizontal-black-transparent.svg', 52, 44, 250)}
  <text x="64" y="172" font-family="${SANS}" font-weight="700" font-size="26" fill="${C.ink}">Journal · ${esc(category)}</text>
  ${text}
  ${await place('icon/mark-black.svg', 860, 250, 300)}
  <text x="64" y="590" font-family="${SANS}" font-weight="700" font-size="22" fill="${C.ink}">oriontheory.store/journal</text>
</svg>`;
}

async function png(input, file, size) {
  const path = out(file);
  await mkdir(dirname(path), { recursive: true });
  const isMarkup = typeof input === 'string' && input.trimStart().startsWith('<');
  let img = sharp(isMarkup ? Buffer.from(input) : input, { density: 300 });
  if (size) img = img.resize(size, size);
  await img.png({ compressionLevel: 9 }).toFile(path);
  console.log('wrote', file);
}

await png(await brandOg(), 'og/orion-theory.png');
await png(await whatFlagOg(), 'og/what-flag.png');
await png(await articleOg(['Meet Orion Theory:', 'Our First Game Is', 'What Flag'], 'Studio'), 'og/meet-orion-theory-what-flag.png');

// Square logo on paper for structured data (Organization.logo).
await png(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="${C.paper}"/>${await place('icon/mark-black.svg', 0, 0, 512)}</svg>`,
  'brand/orion-theory-mark-512.png',
);
await png(src('icon/app-icon-dark.svg'), 'apple-touch-icon.png', 180);
await png(src('icon/app-icon-dark.svg'), 'icon-192.png', 192);
await png(src('icon/app-icon-dark.svg'), 'icon-512.png', 512);
await png(src('icon/favicon-dark.svg'), 'favicon-32.png', 32);

await writeFile(
  out('site.webmanifest'),
  JSON.stringify(
    {
      name: 'Orion Theory',
      short_name: 'Orion Theory',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: C.paper,
      background_color: C.paper,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);
console.log('wrote site.webmanifest');
