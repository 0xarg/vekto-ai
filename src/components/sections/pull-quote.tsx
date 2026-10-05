import { getCollection } from "@/lib/content/loader";
import { Container } from "@/components/ui/container";

/**
 * The customer quote, on the dark surface.
 *
 * There is exactly one quote on this site and there will be exactly one until
 * the client clears another. `permissionOnFile` is typed `z.literal(true)` in
 * the frontmatter schema, so a quote cannot even parse unless written permission
 * is asserted — which is why this renders a single quote rather than the
 * three-up carousel the reference sites use. Two of those three would be
 * invented.
 *
 * The attribution is a role, not a person: the customer is anonymized by
 * agreement. That is stated plainly rather than dressed up with a stock avatar.
 */
export function PullQuote() {
  const study = getCollection("case-studies")[0];
  const quote = study?.frontmatter.quote;
  if (!quote) return null;

  return (
    <section data-band data-tone="inverse" className="py-band-loose">
      <Container width="default">
        <figure>
          <blockquote className="text-ink max-w-4xl text-2xl leading-snug font-medium tracking-tight text-balance sm:text-[2rem]">
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
      </Container>
    </section>
  );
}
