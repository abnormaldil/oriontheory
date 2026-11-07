// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://oriontheory.store',
  // Canonical URLs never end in a slash (e.g. /policy, /terms).
  // `format: 'file'` emits policy.html, terms.html, … which static hosts
  // (Cloudflare Pages, Netlify, GitHub Pages, Vercel with cleanUrls) serve at /policy.
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
});
