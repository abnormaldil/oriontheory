import { site } from '~/data/site';

/** Absolute, slash-less canonical URL for a path ("/" stays as the root). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === '/' ? '/' : path.replace(/\/+$/, '');
  return new URL(clean, site.url).toString();
}

export interface Crumb {
  name: string;
  href: string;
}

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export function organizationSchema(email: string | null) {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: site.name,
    url: `${site.url}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(site.logo),
      width: 512,
      height: 512,
    },
    ...(email
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email,
          },
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: site.locale,
    publisher: { '@id': organizationId },
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image: string;
  published: Date;
  updated?: Date | undefined;
}) {
  return {
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntityOfPage: absoluteUrl(opts.path),
    image: absoluteUrl(opts.image),
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    inLanguage: site.locale,
    author: { '@type': 'Organization', name: site.name, url: `${site.url}/` },
    publisher: { '@id': organizationId },
  };
}

export { organizationId };
