import Link from "next/link";
import { migrations } from "@/content/migrations";
import { platforms } from "@/content/platforms";
import { cn } from "@/lib/utils";

/**
 * Every source platform against every target platform, with the pairs we
 * actually document marked.
 *
 * A real table, because this is real tabular data with both row and column
 * headers — which also gives the marks their screen-reader text for free.
 *
 * It shows the gaps as loudly as the coverage, and that is deliberate: draft
 * pairs are stripped from production builds, so the live matrix marks one cell
 * of sixteen. Stating the limit is what makes the surrounding claims credible,
 * and the same grid becomes a roadmap the moment more pairs are confirmed.
 */
export function CoverageMatrix() {
  const sources = platforms.filter(
    (p) => p.role === "source" || p.role === "both",
  );
  const targets = platforms.filter(
    (p) => p.role === "target" || p.role === "both",
  );

  const bySlug = new Map(migrations.map((m) => [m.slug, m]));

  return (
    <div>
      <div className="border-rule overflow-x-auto border">
        <table className="w-full min-w-[36rem] border-collapse">
          <caption className="sr-only">
            Migration paths by source and target platform
          </caption>
          <thead>
            <tr>
              <th scope="col" className="bg-surface-2 border-rule border-b p-3">
                <span className="sr-only">Source platform</span>
              </th>
              {targets.map((t) => (
                <th
                  key={t.id}
                  scope="col"
                  className="text-label text-accent bg-surface-2 border-rule border-b border-l p-3 text-center font-mono uppercase"
                >
                  {t.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id}>
                <th
                  scope="row"
                  className="text-legacy border-rule bg-surface w-px border-b p-3 text-left font-mono text-xs whitespace-nowrap"
                >
                  {s.shortName}
                </th>
                {targets.map((t) => {
                  const migration = bySlug.get(`${s.id}-to-${t.id}`);
                  const state = migration?.status ?? "none";

                  return (
                    <td
                      key={t.id}
                      className="border-rule bg-surface border-b border-l p-0 text-center"
                    >
                      {migration ? (
                        <Link
                          href={`/migrations/${migration.slug}`}
                          className="hover:bg-accent-soft flex h-full w-full items-center justify-center p-3 transition-colors"
                        >
                          <Mark state={state} />
                          <span className="sr-only">
                            {s.name} to {t.name},{" "}
                            {state === "published"
                              ? "documented"
                              : "unconfirmed"}
                          </span>
                        </Link>
                      ) : (
                        <span className="flex items-center justify-center p-3">
                          <Mark state="none" />
                          <span className="sr-only">
                            {s.name} to {t.name}, no path documented
                          </span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="text-label text-ink-faint mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono">
        <li className="flex items-center gap-2">
          <Mark state="published" /> documented
        </li>
        <li className="flex items-center gap-2">
          <Mark state="draft" /> unconfirmed
        </li>
        <li className="flex items-center gap-2">
          <Mark state="none" /> no path
        </li>
      </ul>
    </div>
  );
}

function Mark({ state }: { state: "published" | "draft" | "none" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-2.5 w-2.5 shrink-0",
        state === "published" && "bg-accent",
        state === "draft" && "border-accent-line border",
        state === "none" && "bg-rule-strong h-px w-2.5",
      )}
    />
  );
}
