import { cta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action on the dark surface.
 *
 * No tone props. `data-tone="inverse"` paints the band and reassigns the
 * tokens, so `primary` resolves to the periwinkle fill here and the deep indigo
 * on a light band, each clearing the 3:1 floor for a control's own boundary.
 *
 * This is the second of the site's two auras, and the only one that appears on
 * every page. The heading and lede sit on `.aura-cta` DIRECTLY — this is the
 * one declared exception to "an aura never sits behind copy that has to be
 * read", and `pnpm contrast` enforces it by measuring both inks against
 * `--aura-cta-peak`, the aura's brightest pixel. This comment used to claim the
 * copy sat on a flat interior; there is no flat interior and there never was,
 * which is exactly the kind of thing a comment gets to be wrong about for a
 * long time. The rule in AGENTS.md had it right.
 *
 * The dark set is punctuation now rather than the dominant surface, so this is
 * one of only three places it appears: here, the code specimen's interior, and
 * the pull quote.
 */
export function CtaBand({
  heading = "Find out what your migration actually involves.",
  lede = "A migration assessment runs Discovery and Analysis against your real estate and returns the inventory, the classification and the list of decisions only your team can make.",
}: {
  heading?: string;
  lede?: string;
}) {
  return (
    <section data-band data-tone="ground" className="py-band-loose">
      <Container width="wide">
        {/* A panel rather than a full-bleed band. The page ends on an object
            sitting on the ground, which is what gives the closing ask a shape
            instead of letting it bleed into the footer — that argument still
            holds, so this stays a panel. What changed is its size: it now runs
            the full `wide` measure with a taller interior, so it reads as the
            page's closing statement rather than as one more card. */}
        <div
          data-tone="inverse"
          className="aura-cta shadow-panel relative overflow-clip rounded-2xl px-5 py-16 sm:px-14 sm:py-24"
        >
          {/* One arc drawing itself into the panel, sweeping out of the right
              edge. A mark, on the same `pathLength="1"` contract as every other
              stroke on the site: it runs on load and its resting state is the
              finished curve, so where it fails or is instant the arc is simply
              there. `preserveAspectRatio="none"` would distort the weight, so
              the viewBox matches nothing in particular and the SVG is sized to
              overflow instead — the curve is a gesture, not a measurement.

              The panel is already `overflow-clip`, which is what clips it. */}
          <svg
            aria-hidden
            className="text-accent pointer-events-none absolute -top-1/4 -right-16 h-[150%] opacity-40"
            viewBox="0 0 200 300"
            fill="none"
          >
            <path
              d="M 196 -10 C 120 60, 60 120, 70 190 C 78 248, 140 282, 198 296"
              pathLength="1"
              stroke="currentColor"
              strokeWidth="1.5"
              className="animate-draw"
              style={{ animationDelay: "240ms" }}
            />
          </svg>

          <div className="relative grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.025em]">
                {heading}
              </h2>
              <p className="text-lead text-ink-muted mt-5">{lede}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <ButtonLink
                href={cta.primary.href}
                size="lg"
                className="w-full md:w-auto"
              >
                {cta.primary.label}
              </ButtonLink>
              <ButtonLink
                href={cta.secondary.href}
                size="lg"
                variant="secondary"
                className="w-full md:w-auto"
              >
                {cta.secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
