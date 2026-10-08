import Link from "next/link";
import { cta } from "@/lib/site";
import { heroSpec } from "@/lib/derived";
import { publishedMigrations, migrations } from "@/content/migrations";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Readout } from "@/components/ui/label";
import { ArtifactCanvas } from "@/components/diagrams/artifact-canvas";

/**
 * Server-rendered, no scroll-triggered reveal. The previous site animated its
 * hero in on `whileInView`, which left the H1 invisible on arrival and absent
 * from the HTML entirely. This renders as static markup, headline first in the
 * DOM. Every reference site the client offered has that defect; the register is
 * borrowed, the bug is not.
 *
 * Stacked: the argument runs across the top at full width, and the composition
 * sits underneath it. This is an amendment, and it replaces a two-column split
 * whose right half was the hero aura carrying one frosted card.
 *
 * The reason the split existed is worth keeping, because it is still true: an
 * earlier version put the full two-pane code figure in that column, where it
 * had no height cap and ended up the largest object on the page, so the
 * headline competed with it rather than leading. Shrinking the figure to one
 * clipped pane was the fix at the time. Putting the composition *below* the
 * headline removes the competition structurally instead, which is what lets the
 * figure be large again — and it is the shape of every reference the client has
 * offered, most recently weave.figma.com.
 *
 * The aura moved onto the canvas with the card. It is not decoration added
 * behind the glass; it is what makes the nodes read as glass rather than as
 * grey boxes, which is the whole reason there are only two of them on the site.
 *
 * The badge above the headline is where the reference sites put a review score
 * — "4.8 (2500+) reviews on Trustpilot". We have no reviews and will not invent
 * one, so it carries the published migration path instead and links to it. It
 * does the same visual job and is checkable.
 *
 * The spec readouts stay at footnote size. Three sourced counts set large would
 * read as a stat band, which is the one shape on a vendor homepage a technical
 * buyer has learned to distrust — and these resolve to 5, 4 and 3, which is not
 * a quantity that rewards being shouted. The Evidence band further down carries
 * the figures that do, each with its source.
 */
export function Hero({
  eyebrow,
  lead,
  trail,
  lede,
  children,
  spec = true,
  specimen = true,
}: {
  eyebrow?: string;
  /**
   * The headline, in two phrases set side by side.
   *
   * They are two props rather than one node with a `<br>` because the split is
   * a layout the copy has to survive: `lead` sits in the left column and
   * `trail` in the right, each wrapping to about two lines. A single `title`
   * with a hand-placed break cannot express that, and the break it did carry
   * was tuned to a measure that no longer exists.
   *
   * They render inside ONE `<h1>`, so the document still has a single heading
   * and the full sentence reads in order to a crawler and a screen reader.
   */
  lead: React.ReactNode;
  trail?: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  /** The derived counts rule closing the hero. */
  spec?: boolean;
  /** The node composition below the headline. */
  specimen?: boolean;
}) {
  const pair = publishedMigrations[0] ?? migrations[0];

  return (
    <section data-band data-tone="ground" className="relative">
      <Container width="wide">
        {/* Not `py-band-loose`. The band's job is to get the composition into
            the first screen: on a 900px viewport the nav takes 68, the
            headline 175 and the lede and controls about 140, which leaves
            ~390px of canvas above the fold. At `loose` it left none — the
            canvas started 329px below it. */}
        <div className="pt-12 pb-10 sm:pt-16 sm:pb-14">
          {/* `minmax(0,1fr)` rather than a bare single column. A grid track
              defaults to `auto`, which floors at the content's min-content
              width — and the canvas contains the code pane, whose longest line
              is far wider than a phone. The pane scrolls itself, but only if
              the track above it refuses to grow; without this the whole hero
              was 51px wider than the viewport at 390px, which is a horizontal
              page scroll on the one screen that cannot afford one. The
              two-column version carried the same `minmax(0,…)` for the same
              reason and it was lost in the restructure. */}
          <div className="3xl:gap-16 grid grid-cols-[minmax(0,1fr)] gap-10 lg:gap-14">
            <div className="min-w-0">
              {eyebrow && pair && (
                <Link
                  href={`/migrations/${pair.slug}`}
                  className="glass-strong glass-pill text-ink-muted hover:border-accent-line hover:text-ink mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2.5 text-sm transition-colors"
                >
                  <span className="text-label text-accent font-mono uppercase">
                    {eyebrow}
                  </span>
                  <span aria-hidden className="bg-rule h-3.5 w-px" />
                  {pair.sourcePlatform.shortName} &rarr;{" "}
                  {pair.targetPlatform.shortName}
                </Link>
              )}

              {/* One `<h1>`, two columns. `lg:grid-cols-2` with a `gap-10`
                  gives ~716px columns at 1600px, which is what holds both
                  phrases at two lines at the display cap — see the note on
                  `--text-display`. Below `lg` the two spans stack and read as
                  one sentence, which they are.

                  The spans are `block` rather than inline so each phrase owns
                  its own measure; `text-balance` keeps the two lines of each
                  from ending up 9 words and 1. */}
              <h1 className="text-display grid gap-x-10 gap-y-2 lg:grid-cols-2">
                <span className="block text-balance">{lead}</span>
                {trail && (
                  <span className="text-ink-muted block text-balance">
                    {trail}
                  </span>
                )}
              </h1>

              {/* The lede and controls sit under the LEFT phrase and the spec
                  under the right, which is the 43% of the first screen that
                  used to be empty. */}
              <div className="mt-10 grid items-end gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="min-w-0">
                  {lede && (
                    <p className="text-lead text-ink-muted max-w-xl">{lede}</p>
                  )}

                  {children ?? (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <ButtonLink href={cta.primary.href} size="lg">
                        {cta.primary.label}
                      </ButtonLink>
                      <ButtonLink
                        href={cta.secondary.href}
                        variant="secondary"
                        size="lg"
                      >
                        {cta.secondary.label}
                      </ButtonLink>
                    </div>
                  )}
                </div>

                {spec && (
                  <ul className="border-rule flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t pt-5 sm:gap-x-10">
                    {heroSpec.map((item) => (
                      <li key={item.label}>
                        <Readout value={item.value} label={item.label} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* The aura does the visual work; the nodes are the proof sitting
                on it. Every label in here is a registry string. */}
            {specimen && <ArtifactCanvas />}
          </div>
        </div>
      </Container>
    </section>
  );
}
