import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Migration } from "@/content/migrations";
import { cn } from "@/lib/utils";

/**
 * Migration pair card. Source is rendered in the "legacy" tone and target in
 * the accent tone — the same two semantic poles used everywhere a migration is
 * depicted, so the direction of travel is readable without reading.
 */
export function MigrationCard({ migration }: { migration: Migration }) {
  const { sourcePlatform, targetPlatform, slug, status, summary } = migration;

  return (
    <Link
      href={`/migrations/${slug}`}
      className="border-rule bg-surface hover:border-rule-strong group flex flex-col border p-6 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-legacy bg-legacy-soft border-legacy-line rounded-sm border px-2 py-1 font-mono text-xs">
          {sourcePlatform.shortName}
        </span>
        <ArrowRight
          className="text-ink-faint h-3.5 w-3.5 shrink-0"
          aria-hidden
        />
        <span className="text-accent bg-accent-soft border-accent-line rounded-sm border px-2 py-1 font-mono text-xs">
          {targetPlatform.shortName}
        </span>
      </div>

      <h3 className="group-hover:text-accent mt-5 font-serif text-xl transition-colors">
        {sourcePlatform.name} to {targetPlatform.shortName}
      </h3>
      <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
        {summary}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-accent text-sm font-medium">
          View migration path
        </span>
        {status === "draft" && (
          <span className="text-label text-warn bg-warn-soft rounded-sm px-2 py-1 font-mono uppercase">
            Unconfirmed
          </span>
        )}
      </div>
    </Link>
  );
}

export function MigrationGrid({
  migrations,
  className,
}: {
  migrations: Migration[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-3", className)}>
      {migrations.map((m) => (
        <MigrationCard key={m.slug} migration={m} />
      ))}
    </div>
  );
}
