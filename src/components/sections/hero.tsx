import { cta } from "@/lib/site";
import { heroSpec } from "@/lib/derived";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Label, Readout } from "@/components/ui/label";
import { TransformationSpecimen } from "./transformation-specimen";

/**
 * Server-rendered, no scroll-triggered reveal. The previous site animated its
 * hero in on `whileInView`, which left the H1 invisible on arrival and absent
 * from the HTML entirely. This renders as static markup, and the headline stays
 * first in the DOM ahead of the specimen beside it.
 *
 * There is no backdrop graphic. An earlier version drew a 4rem hairline grid
 * behind the headline — the one purely decorative mark on the site, encoding
 * nothing. What sits here instead is a worked specimen of a real migration pair
 * and a spec line of real counts, both read from the content registries.
 *
 * The text column stays deliberately wide. The headline is the strongest thing
 * on the page and shrinking it to make room for a graphic would be a bad trade.
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
  /** The worked pair specimen alongside the headline. */
  specimen?: boolean;
}) {
  return (
    <section data-band data-tone="ground">
      <Container width="wide">
        <div className="py-band-loose">
          <div
            className={
              specimen
                ? "grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-center lg:gap-16"
                : ""
            }
          >
            <div className={specimen ? "min-w-0" : "max-w-4xl"}>
              {eyebrow && <Label className="mb-6">{eyebrow}</Label>}
              <h1 className="text-display">{title}</h1>
              {lede && (
                <p className="text-lead text-ink-muted mt-7 max-w-2xl">
                  {lede}
                </p>
              )}
              {children ?? (
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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

            {specimen && <TransformationSpecimen className="min-w-0" />}
          </div>

          {spec && (
            <ul className="border-rule mt-14 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t pt-5">
              {heroSpec.map((item) => (
                <li key={item.label}>
                  <Readout value={item.value} label={item.label} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
