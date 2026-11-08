import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Journal articles live in src/content/journal/*.md.
 * The filename is the URL slug: /journal/<filename>.
 * Set `draft: true` to keep an article out of the site, sitemap and feeds.
 */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string().max(110),
    /** Meta description and listing summary. Aim for 120–160 characters. */
    description: z.string().min(50).max(200),
    /** Only real dates. Shown on the page and used in structured data. */
    publishedAt: z.coerce.date(),
    /** Only set when the article has actually been revised. */
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['Studio', 'Guides', 'Release notes', 'Support']),
    /** e.g. "what-flag" links the article to that game page. */
    tags: z.array(z.string()).default([]),
    /** Topic-relevant call to action shown at the end of the article. */
    cta: z.object({ label: z.string(), href: z.string().startsWith('/') }).optional(),
    /** Path under /public for the social image. Falls back to the site image. */
    ogImage: z.string().startsWith('/').optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Legal documents live in src/content/legal/*.md (owner-supplied text).
 * Each one is rendered by src/components/LegalPage.astro at its `path`.
 * `effective` and `updated` are shown only once set — never a placeholder.
 */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    /** The document's own title, shown as the page H1. */
    title: z.string(),
    /** <title> tag. */
    seoTitle: z.string(),
    description: z.string().min(50).max(200),
    /** Public URL, e.g. "/policy" or "/games/what-flag/policy". */
    path: z.string().startsWith('/'),
    kind: z.enum(['privacy', 'terms']),
    /** Product slug for product-specific documents; omit for studio-wide ones. */
    product: z.string().optional(),
    effective: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { journal, legal };
