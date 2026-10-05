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
 * of twelve. Stating the limit is what makes the surrounding claims credible,
 * and the same grid becomes a roadmap the moment more pairs are confirmed.
 *
 * On a phone the grid is wider than the screen and always will be — four
 * platform names against three columns does not compress into 320px without
 * abbreviating the names into uselessness. So it scrolls, and the three things
 * that make a scrolling table usable are all here: the source column is
 * pinned, so you can always see which row you are reading; the scroller runs
 * to the viewport edge rather than stopping inside the page gutter, so the cut
 * edge reads as "more" instead of as a border; and a fade over that edge says
 * so even when the first screenful looks complete.
 *
 * `border-separate` is not cosmetic here. Under `border-collapse` the browser
 * owns the borders, and borders on a `position: sticky` cell are dropped when
 * it detaches — the pinned column would lose its rules the moment you scrolled.
 */
export function CoverageMatrix() {
  const sources = platforms.filter(
    (p) => p.role === "source" || p.role === "both",
  );
  const targets = platforms.filter(
    (p) => p.role === "target" || p.role === "both",
  );

  const bySlug = new Map(migrations.map((m) => [m.slug, m]));

  /* Rules live on the cells, one edge each, so no interior line is drawn
     twice. The outer frame is the wrapper's own border. */
  const cell = "border-rule border-b border-l";
  /* The first scrolling column would otherwise draw a left rule immediately
     against the pinned column's new right rule. */
  const firstCell = "border-rule border-b";

  return (
    <div>
      {/* Full-bleed below `sm`: the negative margin cancels the Container
          gutter so the scroll region reaches both edges. The gutter goes back
          on the pinned column's own padding rather than on the scroller —
          `sticky left-0` resolves against the scrollport's padding edge, so
          padding here would park the pinned cell in the wrong place.

          The scroller is `relative` so that it, and not an ancestor, is the
          containing block for the `sr-only` spans in the cells. Those are
          absolutely positioned, and an absolutely positioned element is only
          clipped by an `overflow` ancestor that sits inside its containing
          block chain — so without this they were laid out at their static
          position out at 576px, escaped the scroller entirely, and dragged
          the whole page sideways on a phone. */}
      <div className="relative -mx-5 sm:mx-0">
        <div className="border-rule relative overflow-x-auto border-y sm:border-x">
          <table className="w-full min-w-[36rem] border-separate border-spacing-0">
            <caption className="sr-only">
              Migration paths by source and target platform
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="bg-surface-2 border-rule sticky left-0 z-20 border-r border-b p-3 pl-5 sm:pl-3"
                >
                  <span className="sr-only">Source platform</span>
                </th>
                {targets.map((t, i) => (
                  <th
                    key={t.id}
                    scope="col"
                    className={cn(
                      "text-label text-accent bg-surface-2 p-3 text-center font-mono uppercase",
                      i === 0 ? firstCell : cell,
                    )}
                  >
                    {t.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id}>
                  {/* Pinned. Without this, scrolling right to reach the third
                      target column takes the platform name off screen and the
                      marks stop meaning anything. */}
                  <th
                    scope="row"
                    className="text-legacy border-rule bg-surface sticky left-0 z-10 w-px border-r border-b p-3 pl-5 text-left font-mono text-xs whitespace-nowrap sm:pl-3"
                  >
                    {s.shortName}
                  </th>
                  {targets.map((t, i) => {
                    const migration = bySlug.get(`${s.id}-to-${t.id}`);
                    const state = migration?.status ?? "none";

                    return (
                      <td
                        key={t.id}
                        className={cn(
                          "bg-surface p-0 text-center",
                          i === 0 ? firstCell : cell,
                        )}
                      >
                        {migration ? (
                          <Link
                            href={`/migrations/${migration.slug}`}
                            className="hover:bg-accent-soft flex h-full w-full items-center justify-center p-4 transition-colors sm:p-3"
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
                          <span className="flex items-center justify-center p-4 sm:p-3">
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

        {/* The affordance. Decorative and pointer-transparent — it says there
            is more to the right, it does not claim anything. */}
        <div
          aria-hidden
          className="from-ground pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent sm:hidden"
        />
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
        // A 1px rule is effectively invisible on a phone screen held at arm's
        // length, and "no path" is the state this matrix exists to show.
        state === "none" && "bg-rule-strong h-0.5 w-2.5",
      )}
    />
  );
}
