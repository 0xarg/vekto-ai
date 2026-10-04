import Link from "next/link";
import { cta } from "@/lib/site";
import { heroSpec } from "@/lib/derived";
import { publishedMigrations, migrations } from "@/content/migrations";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Readout } from "@/components/ui/label";
import { CodeCard } from "./code-transform";

/**
 * Server-rendered, no scroll-triggered reveal. The previous site animated its
 * hero in on `whileInView`, which left the H1 invisible on arrival and absent
 * from the HTML entirely. This renders as static markup, headline first in the
 * DOM. Every reference site the client offered has that defect; the register is
 * borrowed, the bug is not.
 *
 * Split: the argument runs down the left, and the right is a gradient panel
 * carrying one small card.
 *
 * An earlier version put the full two-pane code figure here. It had no height
 * cap, sat in the wider of the two columns, and ended up the largest object on
 * the page — the headline was competing with it rather than leading. The full
 * figure now has its own band further down, where that size is the point; here
 * a single clipped pane does the same job of proving the product is real.
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
  title,
  lede,
  children,
  spec = true,
  specimen = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  /** The derived counts rule closing the hero. */
  spec?: boolean;
  /** The worked code specimen below the headline. */
  specimen?: boolean;
}) {
  const pair = publishedMigrations[0] ?? migrations[0];

  return (
    <section data-band data-tone="ground" className="relative">
      <Container width="wide">
        <div className="py-band-loose">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="max-w-xl min-w-0">
              {eyebrow && pair && (
                <Link
                  href={`/migrations/${pair.slug}`}
                  className="border-rule bg-surface shadow-card text-ink-muted hover:border-accent-line hover:text-ink mb-8 inline-flex items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-2.5 text-sm transition-colors"
                >
                  <span className="text-label text-accent font-mono uppercase">
                    {eyebrow}
                  </span>
                  <span aria-hidden className="bg-rule h-3.5 w-px" />
                  {pair.sourcePlatform.shortName} &rarr;{" "}
                  {pair.targetPlatform.shortName}
                </Link>
              )}

              <h1 className="text-display">{title}</h1>

              {lede && (
                <p className="text-lead text-ink-muted mt-6 max-w-xl">{lede}</p>
              )}

              {children ?? (
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
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

              {spec && (
                <ul className="border-rule mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t pt-5">
                  {heroSpec.map((item) => (
                    <li key={item.label}>
                      <Readout value={item.value} label={item.label} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* The gradient does the visual work; the card is the proof sitting
                on it. */}
            {specimen && (
              <div className="mesh-warm border-rule relative flex min-h-[20rem] min-w-0 items-center justify-center rounded-xl border p-5 sm:min-h-[22rem] sm:p-12">
                <CodeCard />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
