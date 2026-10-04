import { getCollection } from "@/lib/content/loader";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { ButtonLink } from "@/components/ui/button";
import { tints, type Tint } from "@/components/ui/card";

/**
 * The homepage's figures band, read from the most recent published case study.
 *
 * This is the honest form of the thing every competitor site puts here. The
 * reference sites run "200K / 30,000+ / ₹10Cr" and "30hr / $42k / 98% / 3x" —
 * round, large, and attached to nothing. Non-negotiable #1 forbids that, and the
 * schema enforces it: `sourcedFigure` makes `source` a required field with a
 * minimum length, so a figure physically cannot be added without stating where
 * it came from.
 *
 * So each value renders with its source line underneath. That line is not a
 * disclaimer to be set in the smallest type available — for the audience this
 * site is written for it is the reason to believe the number above it, and it is
 * what a row of unsourced figures can never buy.
 *
 * Renders nothing when there is no published case study, which is what
 * production did until the client supplied one.
 */
/** Rotated across the figure cells so a row of six is not one flat colour. */
const figureTints: Tint[] = ["clay", "blue", "sage", "amber", "violet", "clay"];

export function Evidence() {
  const study = getCollection("case-studies")[0];
  if (!study) return null;

  const { frontmatter: fm, slug } = study;

  return (
    <section
      data-band
      data-tone="ground"
      className="py-band-loose border-rule border-t"
    >
      <Container width="wide">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Label className="mb-4">Evidence</Label>
            <h2 className="text-h2">{fm.customer}, measured.</h2>
            <p className="text-lead text-ink-muted mt-5">{fm.description}</p>
          </div>
          <div className="shrink-0">
            <ButtonLink href={`/case-studies/${slug}`} variant="secondary">
              Read the full study
            </ButtonLink>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fm.results.map((r, i) => (
            <div
              key={r.label}
              className="border-rule shadow-tint flex flex-col rounded-lg border p-6"
              style={{
                ...tints[figureTints[i % figureTints.length]],
                backgroundColor: "var(--chip-wash)",
              }}
            >
              <dt className="text-label text-ink-faint font-mono uppercase">
                {r.label}
              </dt>
              <dd
                className="mt-3 text-[2.75rem] leading-none font-semibold tracking-tight tabular-nums"
                style={{ color: "var(--chip-ink)" }}
              >
                {r.value}
              </dd>
              {/* Every figure carries its source. The scope forbids unsourced
                  statistics and the schema enforces it — this line is the
                  reason the number above it is believable. */}
              <dd className="text-ink-muted mt-auto pt-5 text-xs leading-relaxed">
                {r.source}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
