export const HIGHLIGHT_FROM = [111, 111, 111] as const;
export const HIGHLIGHT_TO = [244, 244, 244] as const;
export const HIGHLIGHT_EDGE = 3;

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns the interpolated colour for a word in the manifesto.
 * The highlight is a soft leading edge that sweeps across the statement as
 * the user scrolls.
 */
export function wordColor(
  progress: number,
  index: number,
  total: number,
  edge = HIGHLIGHT_EDGE,
): string {
  const p = clamp(progress);
  const local = clamp((p * (total + edge) - index) / edge);
  const r = Math.round(HIGHLIGHT_FROM[0] + (HIGHLIGHT_TO[0] - HIGHLIGHT_FROM[0]) * local);
  const g = Math.round(HIGHLIGHT_FROM[1] + (HIGHLIGHT_TO[1] - HIGHLIGHT_FROM[1]) * local);
  const b = Math.round(HIGHLIGHT_FROM[2] + (HIGHLIGHT_TO[2] - HIGHLIGHT_FROM[2]) * local);
  return `rgb(${r}, ${g}, ${b})`;
}
