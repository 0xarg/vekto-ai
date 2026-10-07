/**
 * The shared contract every diagram on the site is drawn against.
 *
 * Before the diagrams existed the repo contained no SVG at all, so these rules
 * are the contract rather than a house style, and they are what let one diagram
 * sit on a tinted card, a dark band or a glass panel with no variant:
 *
 * - Colour resolves from `currentColor`, or from a token the caller sets.
 *   Never a hex — non-negotiable #5, and the reason a diagram re-themes for
 *   free when the page does.
 * - Strokes that animate carry `pathLength="1"`, so the dash length is
 *   normalised and nothing has to measure a path. The resting state is the
 *   finished drawing, which means a failed or instant animation just leaves the
 *   diagram simply there.
 * - `aria-label` is required, not optional. A diagram with no label is a
 *   decoration that announces itself as an image.
 *
 * This lived as a byte-identical copy in `agent-diagram.tsx` and
 * `concept-diagram.tsx`. Adding a third consumer is what made the duplication
 * worth removing.
 */
export const stroke = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Svg({
  children,
  label,
  viewBox = "0 0 180 110",
  className = "diagram",
}: {
  children: React.ReactNode;
  label: string;
  /** The stage diagrams share one frame; the pipeline needs its own. */
  viewBox?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}
