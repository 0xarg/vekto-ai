import { migrations, publishedMigrations } from "@/content/migrations";
import { stageIndex } from "@/lib/derived";
import { Readout } from "@/components/ui/label";
import { PlatformPole } from "./migration-ledger";

/**
 * A worked specimen of one real migration pair, drawn rather than described.
 *
 * Everything in it resolves from the registry: the two platforms with their
 * vendors, and the pair's own `sourceArtifacts` enumerated down the left. The
 * bus running down the right of that list, tapped once per row and continuing
 * as a single line into the target, is the product's whole claim in one mark —
 * many source artifacts, one generated target.
 *
 * Drawn with CSS rules rather than an SVG on purpose. The rows are not uniform
 * height (artifact names wrap differently), so an SVG would need to know each
 * row's position to attach its lines; a stub rendered inside each row lands at
 * the right height by construction, at any width. Orthogonal bus routing also
 * suits a technical specimen better than diagonal fan lines, which read as a
 * marketing diagram.
 */
export function TransformationSpecimen({ className }: { className?: string }) {
  // Production strips drafts, so the published pair is normally the only one.
  // Falling back keeps the homepage rendering if the last pair is unpublished.
  const migration = publishedMigrations[0] ?? migrations[0];
  if (!migration) return null;

  const { sourcePlatform, targetPlatform, sourceArtifacts } = migration;

  return (
    <figure className={className}>
      <div className="border-rule bg-surface border">
        <figcaption className="border-rule text-label text-ink-faint flex items-baseline justify-between gap-3 border-b px-4 py-2.5 font-mono">
          <span className="uppercase">Specimen</span>
          <span>
            {sourcePlatform.shortName} &rarr; {targetPlatform.shortName}
          </span>
        </figcaption>

        <div className="grid grid-cols-[minmax(0,1fr)_1.75rem_minmax(4.5rem,7.5rem)] items-stretch px-4 py-5">
          <div className="min-w-0">
            <PlatformPole
              platform={sourcePlatform}
              pole="source"
              size="compact"
            />
            {/* The right border is the bus; each row taps it with a stub. */}
            <ol className="divide-rule border-legacy-line mt-4 divide-y border-r">
              {sourceArtifacts.map((artifact, i) => (
                <li
                  key={artifact}
                  className="relative flex items-baseline gap-2.5 py-2 pr-3"
                >
                  <span className="text-legacy text-label shrink-0 font-mono">
                    {stageIndex(i + 1)}
                  </span>
                  <span className="text-ink-muted text-[0.6875rem] leading-snug">
                    {artifact}
                  </span>
                  <span
                    aria-hidden
                    className="bg-legacy-line absolute top-1/2 right-0 h-px w-2"
                  />
                </li>
              ))}
            </ol>
          </div>

          <div aria-hidden className="flex items-center gap-1 self-stretch">
            <span className="bg-accent-line h-px flex-1" />
            <span className="text-accent text-[0.5rem] leading-none">
              &#9656;
            </span>
          </div>

          <div className="flex min-w-0 items-center">
            <PlatformPole
              platform={targetPlatform}
              pole="target"
              size="compact"
            />
          </div>
        </div>

        <div className="border-rule border-t px-4 py-3">
          <Readout
            value={sourceArtifacts.length}
            label="artifact classes read"
          />
        </div>
      </div>
    </figure>
  );
}
