import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The lifted surface used for index cards, feature cells and bento tiles.
 *
 * Extracted originally because the same hover string was repeated across four
 * index pages. It now also carries the three things that were missing from
 * every card on the site: a tint, an icon, and a graphic zone.
 *
 * `tint` is decorative and carries no meaning. The two semantic poles —
 * `--accent` for target, `--legacy` for source — are the only colors on this
 * site that state something, and a tinted card must never be read as asserting
 * one. Tints exist to give a grid of cells visual variety, nothing more.
 *
 * `raised` carries `.sheen`, which composites over whatever fill is underneath
 * — plain white or a tint wash — so a card reads as lit from one direction
 * rather than as flat paper. `ruled` does not: a lattice cell has the grid's
 * hairlines for structure and nothing behind it to catch light, and a sheen on
 * every cell of a twelve-cell matrix is noise rather than gloss.
 */
export const tints = {
  rose: {
    "--chip-wash": "var(--tint-rose-wash)",
    "--chip-ink": "var(--tint-rose-ink)",
  },
  teal: {
    "--chip-wash": "var(--tint-teal-wash)",
    "--chip-ink": "var(--tint-teal-ink)",
  },
  sage: {
    "--chip-wash": "var(--tint-sage-wash)",
    "--chip-ink": "var(--tint-sage-ink)",
  },
  amber: {
    "--chip-wash": "var(--tint-amber-wash)",
    "--chip-ink": "var(--tint-amber-ink)",
  },
  violet: {
    "--chip-wash": "var(--tint-violet-wash)",
    "--chip-ink": "var(--tint-violet-ink)",
  },
} as const;

export type Tint = keyof typeof tints;

export function Card({
  href,
  variant = "raised",
  tint,
  icon,
  graphic,
  washed = false,
  className,
  children,
}: {
  /**
   * `glass` is legal only inside an aura panel. Over flat `--ground` a
   * translucent card is indistinguishable from a solid one and costs a
   * compositing layer for nothing — see the glass block in globals.css.
   */
  /** Renders the whole card as a link when set. */
  href?: string;
  variant?: "raised" | "ruled" | "glass";
  /** Decorative hue for the icon chip and, with `washed`, the card's fill. */
  tint?: Tint;
  /** Goes in a `.chip` tile above the content. */
  icon?: React.ReactNode;
  /** A full-bleed zone above the content — a diagram, a mini panel, a mark. */
  graphic?: React.ReactNode;
  /** Fill the card with the tint's wash instead of plain white. */
  washed?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const lifted = variant === "raised" || variant === "glass";

  const classes = cn(
    "group flex flex-col",
    variant === "raised" &&
      "sheen border-rule rounded-lg border shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out overflow-hidden",
    variant === "raised" && (washed && tint ? "shadow-tint" : "bg-surface"),
    variant === "glass" &&
      "glass rounded-lg transition-[transform,box-shadow,border-color] duration-200 ease-out overflow-hidden",
    variant === "ruled" && "transition-colors hover:bg-surface-2",
    // Only a card that goes somewhere lifts. A static one rising under the
    // cursor promises a click that is not there.
    href && lifted && "hover:border-accent-line hover:-translate-y-0.5",
    href && variant === "raised" && "hover:shadow-panel",
    className,
  );

  const style = {
    ...(tint ? tints[tint] : {}),
    // A wash is an opaque fill, so it would paint over the glass and defeat it.
    ...(washed && tint && variant === "raised"
      ? { backgroundColor: "var(--chip-wash)" }
      : {}),
  } as React.CSSProperties;

  const inner = (
    <>
      {graphic}
      {/* p-5 below `sm`: at 320px a full-width card is 280px across, and 24px
          of padding each side left a 232px interior for a heading, a
          paragraph and sometimes a two-column list. */}
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", graphic && "pt-5")}>
        {icon && <span className="chip mb-5">{icon}</span>}
        {children}
      </div>
    </>
  );

  if (!href)
    return (
      <div className={classes} style={style}>
        {inner}
      </div>
    );
  return (
    <Link href={href} className={classes} style={style}>
      {inner}
    </Link>
  );
}
