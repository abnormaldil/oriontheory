/** Colour tones for the shared stage hero (see PageHero.astro). */
export type StageTone = 'tomato' | 'sun' | 'cobalt' | 'mint' | 'cream' | 'ink' | 'mist';

/** Panel colour, text colour, and the two layers peeking out behind it. */
/** `scheme`: which text tokens the panel needs — fixed light/dark, or the page's own. */
export const stageTones: Record<StageTone, { bg: string; fg: string; l1: string; l2: string; scheme: 'light' | 'dark' | 'page' }> = {
  tomato: { bg: 'var(--tomato)', fg: 'var(--ink)', l1: 'var(--layer-ink)', l2: 'var(--sun)', scheme: 'light' },
  sun: { bg: 'var(--sun)', fg: 'var(--ink)', l1: 'var(--layer-ink)', l2: 'var(--tomato)', scheme: 'light' },
  cobalt: { bg: 'var(--cobalt)', fg: 'var(--paper)', l1: 'var(--layer-ink)', l2: 'var(--mint)', scheme: 'dark' },
  mint: { bg: 'var(--mint)', fg: 'var(--ink)', l1: 'var(--layer-ink)', l2: 'var(--cobalt)', scheme: 'light' },
  cream: { bg: 'var(--cream-surface)', fg: 'var(--fg)', l1: 'var(--tomato)', l2: 'var(--sun)', scheme: 'page' },
  ink: { bg: 'var(--raised)', fg: 'var(--paper)', l1: 'var(--cobalt)', l2: 'var(--tomato)', scheme: 'dark' },
  mist: { bg: 'var(--surface)', fg: 'var(--fg)', l1: 'var(--surface-3)', l2: 'var(--surface-2)', scheme: 'page' },
};

/** Inline style string for a .stage element. */
export const stageStyle = (t: StageTone) => {
  const s = stageTones[t];
  return `--stage-bg:${s.bg};--stage-fg:${s.fg};--l1:${s.l1};--l2:${s.l2}`;
};
