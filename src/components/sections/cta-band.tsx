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
 * every page. Copy sits on the panel's own flat interior, never on a gradient
 * stop — the aura carries the area around the words.
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
            instead of letting it bleed into the footer. */}
        <div
          data-tone="inverse"
          className="aura-cta shadow-panel overflow-hidden rounded-xl px-5 py-12 sm:px-12 sm:py-16"
        >
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-h2">{heading}</h2>
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
