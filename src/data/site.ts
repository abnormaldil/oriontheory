/**
 * Global site configuration.
 *
 * Source of truth for copy and launch-state rules: /oriontheory-content.md
 *
 * OWNER INPUT — values set to `null` are unknown and render as visible
 * bracketed placeholders instead of guesses. Fill them in once verified.
 */

export const site = {
  name: 'Orion Theory',
  url: 'https://oriontheory.store',
  locale: 'en',
  tagline: 'Good games. Useful apps. A little more wonder.',
  description:
    'Orion Theory is an independent publisher of mobile games and apps. Our first planned release is What Flag, a flag-guessing game.',
  defaultOgImage: '/og/orion-theory.png',
  logo: '/brand/orion-theory-mark-512.png',
} as const;

/**
 * Contact routes.
 *
 * The public contact address, set by the owner. It is shown on /contact and
 * used for the topic mailto links and the Organization schema. The legal pages
 * carry their own contact block (src/content/legal/*.md).
 * Setting `verified: false` hides it everywhere and shows a placeholder instead.
 */
export const contact = {
  email: 'oriontheoryconnect@gmail.com',
  verified: true,
} as const;

/** Returns the contact address only once it has been verified. */
export function verifiedEmail(): string | null {
  return contact.verified ? contact.email : null;
}

export const primaryNav = [
  { href: '/games', label: 'Games' },
  { href: '/apps', label: 'Apps' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
] as const;

export const footerNav = {
  make: [
    { href: '/games', label: 'Games' },
    { href: '/apps', label: 'Apps' },
    { href: '/journal', label: 'Journal' },
  ],
  studio: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/support', label: 'Support' },
  ],
  legal: [
    { href: '/policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ],
} as const;
