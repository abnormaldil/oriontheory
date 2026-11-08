import { getCollection, type CollectionEntry } from 'astro:content';

export type LegalDoc = CollectionEntry<'legal'>;

export async function getLegalDocs(): Promise<LegalDoc[]> {
  return getCollection('legal');
}

export async function getLegalDoc(path: string): Promise<LegalDoc> {
  const doc = (await getLegalDocs()).find((d) => d.data.path === path);
  if (!doc) throw new Error(`No legal document in src/content/legal with path "${path}"`);
  return doc;
}

/** "What Flag — Privacy Policy" → "Privacy Policy" */
export function shortTitle(doc: LegalDoc): string {
  return doc.data.title.split(' — ').pop() ?? doc.data.title;
}

/**
 * Documents to link from a legal page: its companion (privacy ↔ terms in the
 * same scope) and its counterparts (studio ↔ product documents of the same kind).
 */
export async function relatedLegalDocs(doc: LegalDoc) {
  const all = await getLegalDocs();
  const companion = all.find((d) => d.data.product === doc.data.product && d.data.kind !== doc.data.kind);
  const counterparts = all.filter(
    (d) => d.data.kind === doc.data.kind && d.data.product !== doc.data.product && (doc.data.product ? !d.data.product : true),
  );
  return { companion, counterparts };
}

/** Product-specific legal pages for a product, if any. */
export async function productLegal(slug: string) {
  const all = await getLegalDocs();
  return {
    privacy: all.find((d) => d.data.product === slug && d.data.kind === 'privacy'),
    terms: all.find((d) => d.data.product === slug && d.data.kind === 'terms'),
  };
}
