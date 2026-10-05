import { getCollection } from "@/lib/content/loader";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";

/**
 * The customer quote, as a glass card floating on a full-bleed aura.
 *
 * There is exactly one quote on this site and there will be exactly one until
 * the client clears another. `permissionOnFile` is typed `z.literal(true)` in
 * the frontmatter schema, so a quote cannot even parse unless written permission
 * is asserted — which is why this renders a single quote rather than the
 * three-up carousel the reference sites use. Two of those three would be
 * invented.
 *
 * The attribution is a role, not a person: the customer is anonymized by
 * agreement. That is stated plainly rather than dressed up with a stock avatar —
 * the reference sites put a face here, and ours would have to be a stranger's.
 *
 * The aura is the third on the site, and the only one that is full-bleed. It
 * earns that because the card is the subject: a frosted panel needs something
 * behind it to be frosted against, and the band exists to hold one object.
 */
export function PullQuote() {
  const study = getCollection("case-studies")[0];
  const quote = study?.frontmatter.quote;
  if (!quote) return null;

  return (
    <section
      data-band
      data-tone="inverse"
      className="aura-quote py-band-loose relative overflow-hidden"
    >
      <Container width="default">
        {/* The stacked edges under the card. Two inset slivers rather than a
            second and third copy of the card, so the depth costs no duplicated
            text for a screen reader to read out twice. */}
        <div className="relative mx-auto max-w-3xl">
          <div
            aria-hidden
            className="glass absolute inset-x-6 -bottom-2 h-10 rounded-xl opacity-60"
          />
          <div
            aria-hidden
            className="glass absolute inset-x-12 -bottom-4 h-10 rounded-xl opacity-35"
          />

          <figure className="glass relative rounded-xl p-6 sm:p-10">
            <Label className="mb-6">From the case study</Label>
            <blockquote className="text-ink font-display text-xl leading-snug font-medium text-balance sm:text-[1.75rem]">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="border-rule text-ink-muted mt-8 border-t pt-5 text-sm">
              {quote.attribution}
              <span className="text-ink-faint">
                {" "}
                &middot; {study.frontmatter.industry}
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
