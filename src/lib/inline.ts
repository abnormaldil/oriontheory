/**
 * Tiny, safe inline formatter for data-driven copy (legal pages, notes).
 * Escapes HTML first, then applies a very small, closed set of patterns.
 */
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[\[(.+?)\]\]/g, '<mark class="placeholder">[$1]</mark>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\{\{link:(\/[a-z0-9\-/]*)\|(.+?)\}\}/g, '<a href="$1">$2</a>');
}
