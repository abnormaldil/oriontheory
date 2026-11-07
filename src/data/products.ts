/**
 * Products: every Orion Theory game and app.
 *
 * Add an entry here to publish a product. Listing pages (/games, /apps), detail
 * pages (/games/[slug], /apps/[slug]), the homepage, the sitemap and structured
 * data all read from this file.
 *
 * Release-state rules (content.md §13):
 *  - Keep `status: 'in-development'` until the Google Play listing is public.
 *  - `status: 'available'` REQUIRES a verified `playStoreUrl` (TypeScript enforces it).
 *  - Only list confirmed features. Never add ratings, download counts, prices or
 *    release dates that are not verified.
 *  - Only add a product once it is real: released, approved, or officially announced.
 */

export type ProductKind = 'game' | 'app';

export interface FaqItem {
  question: string;
  answer: string;
}

/** Colour world for a product. Values are CSS colours or tokens. */
export interface ProductTheme {
  /** Artwork / feature background */
  bg: string;
  /** Text and line colour on `bg` */
  ink: string;
  /** Accent used sparingly on `bg` */
  accent: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductBase {
  kind: ProductKind;
  slug: string;
  name: string;
  /** One-line promise, shown large. */
  promise: string;
  /** One or two sentences for listings. */
  summary: string;
  /** Paragraph for the detail page. */
  description: string;
  /** e.g. "Quiz / Trivia" */
  category: string;
  /** schema.org applicationCategory — used only once available. */
  applicationCategory: 'GameApplication' | 'UtilitiesApplication' | 'EducationalApplication' | 'ProductivityApplication' | 'MultimediaApplication';
  /** Confirmed features only. */
  features: { title: string; body: string }[];
  platformLabel: string;
  theme: ProductTheme;
  /**
   * Original key artwork. `'what-flag'` maps to a built-in illustration; any
   * other product supplies a real image.
   */
  artwork: 'what-flag' | ImageAsset;
  faq: FaqItem[];
  seo: { title: string; description: string };
  /** Journal posts tagged with this value are shown as related reading. */
  relatedTag: string;
}

interface UnreleasedProduct extends ProductBase {
  status: 'in-development';
}

interface ReleasedProduct extends ProductBase {
  status: 'available';
  /** Verified public Google Play listing. */
  playStoreUrl: `https://play.google.com/store/apps/details?id=${string}`;
  /** Real app icon (under /public). */
  icon?: ImageAsset;
  /** Original screenshots only — never mock-ups. */
  screenshots?: ImageAsset[];
  /** Only if officially announced. ISO date. */
  releaseDate?: string;
}

export type Product = UnreleasedProduct | ReleasedProduct;

export const products: Product[] = [
  {
    kind: 'game',
    slug: 'what-flag',
    name: 'What Flag',
    status: 'in-development',
    promise: 'How well do you know the flags of the world?',
    summary: 'Recognize flags, identify countries, and put your world knowledge to the test.',
    description:
      'What Flag turns country-flag recognition into a quick, approachable mobile game. Take a look, make your guess, and see how much of the world you know.',
    category: 'Quiz / Trivia',
    applicationCategory: 'GameApplication',
    features: [
      {
        title: 'A world of flags, one guess at a time.',
        body: 'What Flag is being built around a simple idea: make learning and recognizing flags feel like play.',
      },
    ],
    platformLabel: 'Google Play',
    theme: { bg: 'var(--sun)', ink: 'var(--ink)', accent: 'var(--tomato)' },
    artwork: 'what-flag',
    faq: [
      {
        question: 'What is What Flag?',
        answer: 'What Flag is a mobile flag-guessing game from Orion Theory.',
      },
      {
        question: 'When will What Flag be released?',
        answer:
          'The release date has not been announced. Check this page or the Orion Theory journal for updates.',
      },
      {
        question: 'Where can I download it?',
        answer: 'The Google Play link will be published here once the listing is live.',
      },
      {
        question: 'Who makes What Flag?',
        answer: 'What Flag is developed and published by Orion Theory.',
      },
    ],
    seo: {
      title: 'What Flag — Flag Quiz Game | Orion Theory',
      description:
        'What Flag is an upcoming mobile flag quiz game from Orion Theory. Test your knowledge of country flags and discover the game’s release updates.',
    },
    relatedTag: 'what-flag',
  },
];

export const games = products.filter((p) => p.kind === 'game');
export const apps = products.filter((p) => p.kind === 'app');

export const productPath = (p: Pick<Product, 'kind' | 'slug'>) =>
  `/${p.kind === 'game' ? 'games' : 'apps'}/${p.slug}`;

export function isAvailable(p: Product): p is ReleasedProduct {
  return p.status === 'available';
}

/** Plain-language release line. Never implies availability before release. */
export function releaseLine(p: Product): string {
  return isAvailable(p) ? `Available on ${p.platformLabel}` : `Coming soon to ${p.platformLabel}`;
}

/**
 * The kinds of apps Orion Theory wants to make. These are areas of interest,
 * NOT announced products — the /apps page presents them that way.
 */
export const appDirections = [
  {
    name: 'Productivity',
    body: 'Tools that help you focus, keep time and get things finished.',
    color: 'var(--tomato)',
  },
  {
    name: 'Organization',
    body: 'Simple ways to keep track of the paperwork and plans of everyday life.',
    color: 'var(--sun)',
  },
  {
    name: 'Creativity',
    body: 'Places to collect ideas, images and the things you want to remember.',
    color: 'var(--mint)',
  },
  {
    name: 'Utilities',
    body: 'Dependable everyday helpers that do one job really well.',
    color: 'var(--cream)',
  },
] as const;
