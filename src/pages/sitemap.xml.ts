import type { APIRoute } from 'astro';
import { products, productPath } from '~/data/products';
import { getPublishedPosts, postPath } from '~/lib/journal';
import { getLegalDocs } from '~/lib/legal';
import { absoluteUrl } from '~/lib/seo';
import { isoDate } from '~/lib/dates';

/**
 * Built from real routes only: static pages, every game and app in src/data/products.ts, the
 * legal documents in src/content/legal, and published (non-draft) journal posts. The 404 page is excluded.
 */
const staticPaths = ['/', '/games', '/apps', '/about', '/journal', '/contact', '/support'];

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const legalDocs = await getLegalDocs();

  const entries: { loc: string; lastmod?: string }[] = [
    ...staticPaths.map((p) => ({ loc: absoluteUrl(p) })),
    ...products.map((p) => ({ loc: absoluteUrl(productPath(p)) })),
    ...legalDocs.map((d) => ({
      loc: absoluteUrl(d.data.path),
      ...(d.data.updated ? { lastmod: isoDate(d.data.updated) } : {}),
    })),
    ...posts.map((p) => ({
      loc: absoluteUrl(postPath(p)),
      lastmod: isoDate(p.data.updatedAt ?? p.data.publishedAt),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
