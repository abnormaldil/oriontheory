import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'journal'>;

/** Published (non-draft) posts, newest first. Drafts never reach routes or the sitemap. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('journal', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPostsTagged(tag: string): Promise<Post[]> {
  return (await getPublishedPosts()).filter((p) => p.data.tags.includes(tag));
}

/** Related posts: same tags first, then same category, excluding the current post. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id);
  const score = (p: Post) =>
    p.data.tags.filter((t) => post.data.tags.includes(t)).length * 2 +
    (p.data.category === post.data.category ? 1 : 0);
  return others
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}

export const postPath = (post: Post) => `/journal/${post.id}`;
