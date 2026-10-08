import {
  counts,
  coverageCells,
  sourcePlatforms,
  targetPlatforms,
} from "@/lib/derived";
import type { Platform } from "@/content/platforms";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";

/**
 * The platform names, set as a moving wordmark strip.
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
 *
 * It scrolls because a logo wall moves, and because there are only seven names:
 * a static row of seven words reads as a short list, where a continuous one
 * reads as an inventory. The two rows travel opposite ways, sources against
 * targets, which is the same direction-of-travel encoding the rest of the site
 * uses. `platforms.ts` carries no logo, icon or colour field, so this is type —
 * which is the honest version of this band anyway.
 *
 * And because it is type, it is set at the size type gets when it IS the
 * subject. This band is the direct analogue of the reference's "use all the
 * models" section, which sets the same kind of list at 94px and gives it a
 * screen; ours was seven words at 18px in a strip you could miss. The names
 * are the content here — there is nothing else in the band — so they take the
 * display face at a size between `h2` and `display`. Nothing about what is
 * claimed changed: the count beside them still says how much of the matrix is
 * actually documented, and that is still the first thing the band says.
 */
function Row({
  platforms,
  tone,
  reverse,
}: {
  platforms: Platform[];
  tone: "legacy" | "accent";
  reverse?: boolean;
}) {
  // Two identical halves, translated by exactly -50%, is what makes the loop
  // seamless. The second half is hidden from the accessibility tree so the
  // names are not announced twice.
  const half = (hidden?: boolean) => (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-x-12 pr-12 sm:gap-x-16 sm:pr-16"
    >
      {platforms.map((p) => (
        <li
          key={p.id}
          className={`font-display text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] leading-none font-semibold tracking-[-0.025em] whitespace-nowrap ${
            tone === "legacy" ? "text-legacy" : "text-accent"
          }`}
        >
          {p.shortName}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex min-w-0 overflow-hidden">
      <div
        className="animate-marquee flex w-max"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {half()}
        {half(true)}
      </div>
    </div>
  );
}

export function PlatformStrip() {
  return (
    <section
      data-band
      data-tone="ground"
      className="border-rule py-band border-y"
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

          <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-7">
            <Row platforms={sourcePlatforms} tone="legacy" />
            <Row platforms={targetPlatforms} tone="accent" reverse />
          </div>
        </div>
      </Container>
    </section>
  );
}
