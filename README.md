# oriontheory.store

Website for **Orion Theory**, an independent mobile app and game publisher.
Static site built with [Astro 6](https://astro.build) and TypeScript: every page is
pre-rendered HTML, there are no third-party scripts, no cookies and no analytics, and fonts
are self-hosted.

Content source of truth: [`oriontheory-content.md`](./oriontheory-content.md).

## Deploying

The GitHub repository is connected to the Vercel project `oriontheory-web`: every push to `main`
builds and publishes https://oriontheory.store automatically. Pushes to other branches get preview
URLs. `vercel deploy --prod` from this folder still works for a manual deploy.

The original logo deliverables, planning documents and `.claude/` are git-ignored, so they stay out
of the public repository; keep your own copy of `public/brand/logo deliverables/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (Node ≥ 22.12) |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Type-check (`astro check`), then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run og` | Copy the supplied logo SVGs to `public/brand/`, and regenerate social images and icons from them |

## Routes

`/` · `/games` · `/games/[slug]` (What Flag) · `/apps` · `/apps/[slug]` (none yet) · `/about` ·
`/journal` · `/journal/[slug]` · `/contact` · `/support` · `/policy` · `/terms` · `/404` ·
`/sitemap.xml` · `/robots.txt`

Canonical URLs never end in a slash. The build emits `policy.html`, `terms.html`, and so on
(`build.format: 'file'`). Cloudflare Pages, Netlify, GitHub Pages and Vercel (with the included
`vercel.json`) serve these at `/policy`. If a host returns 404 for `/policy/`, the custom 404 page
redirects to `/policy`. **After deploying, open `https://oriontheory.store/policy` and
`/terms` directly before you paste them into Play Console.**

## Where things live

```
src/
  data/site.ts        Site config, navigation, contact + legal owner inputs
  data/products.ts    Every game and app (typed; "available" requires a Play Store URL),
                      plus the app areas shown on /apps
  data/legal.ts       Privacy Policy + Terms draft framework
  content/journal/    Journal articles (Markdown). Filename = URL slug
  content.config.ts   Journal schema (title, description, dates, category, tags, cta, draft)
  components/         Header, Footer, Logo (supplied logo files), OrionMark (animated mark),
                      Star, HeroStack, PageHero, ProductFeature, ProductPage (shared
                      game/app detail template), WhatFlagArt, AppsArt, …
  lib/stage.ts        Colour tones for the shared "stage" hero
  layouts/BaseLayout  <head>: title, description, canonical, Open Graph, JSON-LD
  pages/              One file per route; sitemap.xml.ts and robots.txt.ts
  styles/global.css   Design tokens and shared styles
scripts/generate-images.mjs   Brand assets built from public/brand/logo deliverables
```

## Design system

- **Brand source:** the logo files in `public/brand/logo deliverables/`. `npm run og` copies them
  unchanged to `public/brand/{lockup,wordmark,mark}-{ink,paper}.svg`; the site only ever shows
  those files (`Logo.astro`). `OrionMark.astro` inlines the mark's exact geometry so it can animate.
- **Colour:** Ink `#0B0B0F` and Paper `#FFFFFF` are the foundation. Cream, tomato, sun, cobalt and
  mint are supporting colours (games lean tomato/sun, apps cobalt, journal mint).
- **Dark mode:** follows the visitor's system setting; the half-circle button in the header
  switches theme and remembers the choice (`localStorage`, key `theme`). `--ink`/`--paper` never
  change; everything themeable goes through tokens in `global.css` (`--bg`, `--fg`, `--fg-2`,
  `--surface`, `--raised`, `--line`, `--rule`, `--link`). Colour panels keep their own text colour
  via `.on-light` / `.on-dark`. The header logo swaps between the supplied black and white files.
- **Type:** Archivo Expanded Italic for display (echoing the 12° wordmark), upright Archivo for
  titles, Figtree for reading. All self-hosted.
- **Motif:** the four-point star from the mark (`Star.astro`), and the "stage": a colour panel
  with two panels peeking out behind it, used for every page hero.
- **Motion** (all in `global.css` unless noted): hero panels dealt in and fanned on scroll
  (`HeroStack`), stage heroes rising, section reveals, a slanted fill sweep on buttons, a panel
  that opens to full width (`.scroll-expand`) or settles from a tilt (`.scroll-tilt`) on scroll,
  and cross-page View Transitions. Scroll-linked effects only run where the browser supports
  them and on screens 48rem+. With `prefers-reduced-motion: reduce`, nothing moves and all
  content is visible.

### Publish a journal article
Add `src/content/journal/<slug>.md` with the frontmatter in `content.config.ts`. Set the real
`publishedAt` date. Articles with `draft: true` are excluded from routes, listings and the sitemap.
`recognizing-country-flags-beginners-guide.md` is an unpublished draft. Fact-check it before you
publish it.

### Release What Flag
In `src/data/products.ts`, change the entry to `status: 'available'` and add the verified
`playStoreUrl`. You can also add a real `icon`, original `screenshots`, and a `releaseDate` (only
if officially announced). The Google Play buttons and `SoftwareApplication` structured data turn on
automatically. Also update the policy's scope (§2) to list the app.

### Add a game or app
Add an entry to `products` in `src/data/products.ts` with `kind: 'game'` or `kind: 'app'`, a
`theme` (its colour world), and `artwork` (a real image: `{ src, alt, width, height }`). It then
appears on `/games` or `/apps`, gets its own `/games/<slug>` or `/apps/<slug>` page, joins the
homepage section and the sitemap, and is listed on `/support`. Add its support answers in
`src/pages/support.astro`. Only add a product once it is real: released, approved, or officially
announced.

## Owner checklist: still needs your input

- [x] **Contact email.** `oriontheoryconnect@gmail.com`, set in `src/data/site.ts` (`contact`). It is
      also used as the privacy and terms contact unless `legal.privacyEmail` is set.
- [ ] **Privacy Policy** (`src/data/legal.ts` + `legal` in `site.ts`): publication date, privacy
      email, publisher identity/address, real data practices, SDKs/providers, retention, children's
      privacy, rights, transfers. It must match the Play Console Data safety form.
- [ ] **Terms**: publication date, contact, governing law and disputes (legally reviewed),
      ads/purchases section if applicable, age requirements.
- [ ] Once both documents are complete and reviewed, set `legal.reviewed = true`. That removes the
      "Draft" notice and the publisher notes.
- [ ] **Hosting logs.** Confirm what your host logs (IP addresses, retention) for the website section
      of the policy.
- [ ] **Launch article date.** `meet-orion-theory-what-flag.md` uses `publishedAt: 2026-11-07`.
      Change it if the site goes live on a different day.
- [ ] Confirm the final store title "What Flag" (content.md marks it as a working title).
- [ ] Tagline/headline in use: "Good games. Useful apps. A little more wonder." Change it in
      `site.ts` and `src/pages/index.astro`.
- [ ] The `/apps` page lists four areas of interest (productivity, organization, creativity,
      utilities), each marked as not an announced product. Edit `appDirections` in `products.ts`
      if your direction changes.
- [ ] **Logo folder is public.** `public/brand/logo deliverables/` (including `build_final.py` and
      the brand sheet) is published with the site. Move it outside `public/` if you don't want that,
      and point `src` in `scripts/generate-images.mjs` at the new location.
