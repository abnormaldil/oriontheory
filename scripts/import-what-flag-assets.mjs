/**
 * Copies What Flag artwork from the game's design pack into the website,
 * resized for the web. Astro then serves AVIF/WebP versions at build time.
 *
 *   node scripts/import-what-flag-assets.mjs [path-to-GeoQuest/design]
 *
 * Default source: ../GeoQuest/design (next to this repository).
 * Outputs: src/assets/what-flag/*  and  public/og/what-flag.png
 * The artwork is the game's own; nothing is redrawn.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const design = resolve(process.argv[2] ?? resolve(root, '..', 'GeoQuest', 'design'));
const img = (p) => resolve(design, 'store_screenshots', 'source', 'img', p);
const out = (p) => resolve(root, 'src', 'assets', 'what-flag', p);
await mkdir(out(''), { recursive: true });

async function save(input, file, { width, height, fit = 'inside', format = 'png' } = {}) {
  let s = sharp(input).resize({ width, height, fit, withoutEnlargement: true });
  s = format === 'jpg' ? s.jpeg({ quality: 88, mozjpeg: true }) : s.png({ compressionLevel: 9, palette: false });
  await s.toFile(out(file));
  console.log('wrote', file);
}

// App icon: the finished icon plus its two layers (background, character with transparency).
await save(resolve(design, 'icon_real', 'main_icon.png'), 'icon.png', { width: 768 });
await save(resolve(design, 'icon_real', 'background.png'), 'icon-background.jpg', { width: 900, format: 'jpg' });
await save(resolve(design, 'icon_real', 'foreground.png'), 'icon-character.png', { width: 900 });

// 3D game props (transparent PNG).
for (const name of ['flag', 'globe', 'coin', 'star', 'trophy', 'map_pin', 'palette']) {
  await save(img(`${name}_3d.png`), `prop-${name.replace('_', '-')}.png`, { width: 320 });
}

// Real in-game screenshots from the build in development.
const screens = {
  'home2.png': 'screen-levels.png',
  'name1.png': 'screen-name-the-country.png',
  'map1.png': 'screen-find-on-map.png',
  'paint4.png': 'screen-paint-the-flag.png',
  'c7b.png': 'screen-country-collected.png',
};
for (const [from, to] of Object.entries(screens)) await save(img(from), to, { width: 720 });

// Social image: the game's Play Store feature graphic, cropped to 1200×630.
await mkdir(resolve(root, 'public', 'og'), { recursive: true });
await sharp(resolve(design, 'store_screenshots', 'whatflag_feature_graphic.png'))
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'public', 'og', 'what-flag.png'));
console.log('wrote public/og/what-flag.png');
