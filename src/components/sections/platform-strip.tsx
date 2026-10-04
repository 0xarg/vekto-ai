import {
  counts,
  coverageCells,
  sourcePlatforms,
  targetPlatforms,
} from "@/lib/derived";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";

/**
 * The platform names, set as a wordmark strip.
 *
 * This occupies the slot every reference site fills with a customer logo wall.
 * We have no customer logos and no permission to show any, so this shows the
 * platforms instead — and says, in the same breath, how much of the matrix is
 * actually documented.
 *
 * The framing matters and is deliberate. `src/app/platform/page.tsx` refuses to
 * render this registry as a "supported platforms" table, on the grounds that
 * `platforms.ts` holds factual names rather than capability claims, and that
 * refusal is right. So the heading is what we document, not what we support, and
 * the published count sits next to it rather than being left for the visitor to
 * discover on /migrations. Leading with the limit is what makes the rest of the
 * page credible.
 */
export function PlatformStrip() {
  return (
    <section
      data-band
      data-tone="ground"
      className="border-rule py-band-tight border-y"
    >
      <Container width="wide">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="lg:max-w-56 lg:shrink-0">
            <Label className="mb-2">Documented paths</Label>
            <p className="text-ink-faint font-mono text-xs leading-relaxed">
              {counts.publishedPaths} of {coverageCells} source-to-target
              combinations documented today.
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {sourcePlatforms.map((p) => (
                <li
                  key={p.id}
                  className="text-legacy text-lg font-medium whitespace-nowrap"
                >
                  {p.shortName}
                </li>
              ))}
            </ul>

            <span aria-hidden className="text-ink-faint shrink-0 font-mono">
              &rarr;
            </span>

            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {targetPlatforms.map((p) => (
                <li
                  key={p.id}
                  className="text-accent text-lg font-medium whitespace-nowrap"
                >
                  {p.shortName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
