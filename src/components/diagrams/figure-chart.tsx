import type { SourcedFigure } from "@/lib/content/schemas";

/**
 * The drawn form of a sourced figure.
 *
 * Renders only when the figure declares a `chart` in its frontmatter, and
 * returns `null` otherwise — the same discipline `Pending` uses. That is the
 * whole safety property: "Zero" and "Same quarter" are real, sourced figures
 * that have no shape, and a bar drawn for them would be inventing one.
 *
 * Nothing here parses `value` or `source`. The numbers come from the declared
 * field, so the only way a bar can be the wrong length is if someone wrote the
 * wrong number down, not if a regex misread a sentence.
 */
export function FigureChart({ figure }: { figure: SourcedFigure }) {
  const chart = figure.chart;
  if (!chart) return null;

  // Both kinds reduce to "this much of that much", which is why they share a
  // track. They differ in what the remainder means, so they differ in how the
  // remainder is drawn.
  const fraction =
    chart.kind === "proportion"
      ? chart.value / chart.of
      : chart.value / chart.against;

  const pct = Math.max(0, Math.min(1, fraction)) * 100;

  return (
    <div className="mt-4" aria-hidden>
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--chip-ink) 18%, transparent)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: "var(--chip-ink)" }}
        />
      </div>
      {/* The denominator, stated. A bar without the thing it is a fraction of
          is just a decorative length. */}
      <p className="text-ink-muted mt-2 font-mono text-[0.6875rem]">
        {chart.kind === "proportion"
          ? `${chart.value} of ${chart.of}`
          : `${chart.value} against ${chart.against} ${chart.unit}`}
      </p>
    </div>
  );
}
