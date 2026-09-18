import Link from "next/link";
import type { Migration } from "@/content/migrations";
import type { Platform } from "@/content/platforms";
import { cn } from "@/lib/utils";
import { Label, Readout } from "@/components/ui/label";

/**
 * One end of a migration. Source is rendered in the "legacy" tone and target in
 * the accent tone — the same two semantic poles used everywhere a migration is
 * depicted, so the direction of travel is readable without reading.
 *
 * The vendor is shown because it is a real field and it disambiguates: an
 * architect evaluating "IBM ACE" and "IBM Sterling" needs to see which IBM.
 */
export function PlatformPole({
  platform,
  pole,
  size = "default",
  className,
}: {
  platform: Platform;
  pole: "source" | "target";
  /** `compact` fits the pole inside a narrow column, such as the hero specimen. */
  size?: "default" | "compact";
  className?: string;
}) {
  const compact = size === "compact";
  return (
    <div className={cn("min-w-0", className)}>
      <Label className={pole === "source" ? "text-legacy" : "text-accent"}>
        {pole}
      </Label>
      <div
        className={cn(
          "text-ink font-serif leading-snug",
          compact ? "mt-1.5 text-sm" : "mt-2 text-lg",
        )}
      >
        {platform.name}
      </div>
      <div
        className={cn(
          "text-ink-faint font-mono",
          compact ? "mt-0.5 text-[0.6875rem]" : "mt-1 text-xs",
        )}
      >
        {platform.vendor}
      </div>
    </div>
  );
}

/**
 * The migration index as a ruled ledger rather than a grid of cards.
 *
 * Three reasons it is not a card grid. Cards forced a fake call-to-action into
 * every tile ("View migration path →") when the whole tile was already the
 * link. `gap-px` between bordered cards doubled every interior hairline to 2px.
 * And drafts are stripped from production builds, so the grid rendered six
 * tiles in preview and exactly one in production, where a lone card in a
 * three-column grid reads as a broken page — a single ledger row does not.
 *
 * Every column is a real field: platform names and vendors from the platform
 * registry, the artifact-class count from the pair's own `sourceArtifacts`, and
 * a status tag that appears only when it carries information.
 */
export function MigrationLedger({
  migrations,
  className,
}: {
  migrations: Migration[];
  className?: string;
}) {
  return (
    <ul
      className={cn("divide-rule border-rule divide-y border-y", className)}
      data-count={migrations.length}
    >
      {migrations.map((m) => (
        <li key={m.slug}>
          <Link
            href={`/migrations/${m.slug}`}
            className="group hover:bg-surface block py-7 transition-colors sm:px-6"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start sm:gap-6">
                <PlatformPole platform={m.sourcePlatform} pole="source" />
                <span
                  aria-hidden
                  className="text-ink-faint group-hover:text-accent hidden self-center font-mono text-sm transition-colors sm:block"
                >
                  &rarr;
                </span>
                <PlatformPole platform={m.targetPlatform} pole="target" />
              </div>

              <div className="flex items-start gap-8 lg:justify-end">
                <div className="flex flex-col gap-2">
                  <Readout
                    orientation="stacked"
                    value={m.sourceArtifacts.length}
                    label="artifact classes"
                  />
                  {/* The count drawn as well as stated. It varies 3-5 across
                      pairs, so the rows stop reading as identical. */}
                  <span aria-hidden className="flex items-center gap-[3px]">
                    {m.sourceArtifacts.map((artifact) => (
                      <span
                        key={artifact}
                        className="bg-legacy-line block h-2.5 w-0.5"
                      />
                    ))}
                  </span>
                </div>
                {m.status === "draft" && (
                  <span className="text-label border-warn-line bg-warn-soft text-warn rounded-sm border px-2 py-1 font-mono uppercase">
                    Unconfirmed
                  </span>
                )}
              </div>
            </div>

            <p className="text-ink-muted mt-5 max-w-3xl text-sm leading-relaxed">
              {m.summary}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
