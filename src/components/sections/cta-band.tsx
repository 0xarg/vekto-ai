import { cta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action on the inverse surface.
 *
 * Buttons take `tone="inverse"`: the accent measures 2.15:1 against this band,
 * so a navy primary here sat below the 3:1 floor for a control's own boundary
 * and barely read as a shape. The light fill is 17.22:1 and is also the
 * stronger hierarchy on a dark ground.
 */
export function CtaBand({
  heading = "Find out what your migration actually involves.",
  lede = "A migration assessment runs Discovery and Analysis against your real estate and returns the inventory, the classification and the list of decisions only your team can make.",
}: {
  heading?: string;
  lede?: string;
}) {
  return (
    <section
      data-band
      data-tone="inverse"
      className="bg-inverse text-ink-inverse"
    >
      <Container width="wide">
        <div className="py-band grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-h2 text-ink-inverse">{heading}</h2>
            <p className="text-lead text-ink-inverse-muted mt-5">{lede}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <ButtonLink
              href={cta.primary.href}
              size="lg"
              tone="inverse"
              className="w-full lg:w-auto"
            >
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink
              href={cta.secondary.href}
              size="lg"
              variant="ghost"
              tone="inverse"
              className="w-full lg:w-auto"
            >
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
