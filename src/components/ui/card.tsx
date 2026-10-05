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
 */
export const tints = {
  clay: {
    "--chip-wash": "var(--tint-clay-wash)",
    "--chip-ink": "var(--tint-clay-ink)",
  },
  blue: {
    "--chip-wash": "var(--tint-blue-wash)",
    "--chip-ink": "var(--tint-blue-ink)",
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
  /** Renders the whole card as a link when set. */
  href?: string;
  variant?: "raised" | "ruled";
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
  const classes = cn(
    "group flex flex-col",
    variant === "raised"
      ? "border-rule rounded-lg border shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out overflow-hidden"
      : "transition-colors hover:bg-surface-2",
    variant === "raised" && (washed && tint ? "shadow-tint" : "bg-surface"),
    // Only a card that goes somewhere lifts. A static one rising under the
    // cursor promises a click that is not there.
    href &&
      variant === "raised" &&
      "hover:border-accent-line hover:shadow-panel hover:-translate-y-0.5",
    className,
  );

  const style = {
    ...(tint ? tints[tint] : {}),
    ...(washed && tint ? { backgroundColor: "var(--chip-wash)" } : {}),
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
