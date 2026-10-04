import { cta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action on the dark surface.
 *
 * No tone props. `data-tone="inverse"` paints the band and reassigns the
 * tokens, so `primary` resolves to the bright teal fill here and the deep one
 * on a light band, each clearing the 3:1 floor for a control's own boundary.
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
          className="mesh-cta shadow-panel relative overflow-hidden rounded-xl px-6 py-16 sm:px-12"
        >
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-h2">{heading}</h2>
              <p className="text-lead text-ink-muted mt-5">{lede}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <ButtonLink
                href={cta.primary.href}
                size="lg"
                className="w-full lg:w-auto"
              >
                {cta.primary.label}
              </ButtonLink>
              <ButtonLink
                href={cta.secondary.href}
                size="lg"
                variant="secondary"
                className="w-full lg:w-auto"
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
