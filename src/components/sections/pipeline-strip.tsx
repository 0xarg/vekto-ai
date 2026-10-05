import Link from "next/link";
import { agents } from "@/content/agents";
import { stageIndex } from "@/lib/derived";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

/**
 * A quantity drawn rather than stated: one mark per item. Inputs take the
 * legacy pole and outputs the accent pole, because that is already what those
 * poles mean — a stage reads from the source side and produces toward the
 * target. Marked aria-hidden; the adjacent "2 in · 3 out" carries the value for
 * anyone not looking at it.
 *
 * The ticks rise on load, staggered across the strip left to right, so the
 * pipeline states its direction once. They animate on `transform` from their
 * own baseline and finish at rest, so a skipped or instant animation leaves
 * every mark present — nothing here is ever hidden waiting for a scroll.
 */
function Ticks({
  count,
  pole,
  delay = 0,
}: {
  count: number;
  pole: "source" | "target";
  delay?: number;
}) {
  return (
    <span aria-hidden className="flex items-center gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "animate-tick-rise block h-3 w-0.5",
            pole === "source" ? "bg-legacy" : "bg-accent",
          )}
          style={{ animationDelay: `${delay + i * 60}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * The five-stage pipeline as a hairline-ruled strip on the dark surface.
 * Doubles as internal linking into every agent detail page from any layout that
 * renders it.
 *
 * Each cell carries a rail across its head — the stage index on the left, its
 * real input and output counts on the right — and because the column dividers
 * are a single pixel, those rails line up into one rule running the width of
 * the strip. That is what makes it read as a pipeline rather than five adjacent
 * boxes. Every number resolves from the agent registry.
 *
 * It takes no top border: on the homepage it sits directly under the hero and
 * the two are meant to read as one continuous dark field.
 */
export function PipelineStrip() {
  return (
    <div data-band data-tone="inverse" className="border-rule border-b">
      <Container width="wide" bleed>
        {/* `.lattice` rather than `divide-*`. `divide-x` adds a left border by
            DOM order, not by grid track, so in a two-column grid it put a
            stray rule down the left edge of every second row — which is why
            it was gated to `lg`, and why the whole 640-1023px range showed two
            columns with no vertical rule between them at all. The lattice
            draws every interior hairline through a 1px gap in its own
            background and does it at any column count.

            `border-0` because the outer div already draws the bottom rule and
            the strip is full-bleed, so a perimeter border would double the
            bottom edge and put two invisible lines at the viewport edges.

            The last cell spans the remainder of its row. Five items in a two-
            or three-column grid leave an empty cell, and an empty cell in a
            lattice is not blank — it is a solid block of the rule colour. */}
        <ol className="lattice border-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {agents.map((agent, index) => (
            <li
              key={agent.slug}
              className="sm:last:col-span-2 lg:last:col-span-1"
            >
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:bg-surface group flex h-full flex-col p-6 transition-colors"
              >
                <div className="border-rule -mx-6 flex items-center justify-between gap-4 border-b px-6 pb-4">
                  <span className="text-label text-ink-faint group-hover:text-accent font-mono transition-colors">
                    {stageIndex(agent.step)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ticks
                      count={agent.inputs.length}
                      pole="source"
                      delay={index * 110}
                    />
                    <span
                      aria-hidden
                      className="text-ink-faint font-mono text-xs"
                    >
                      &middot;
                    </span>
                    <Ticks
                      count={agent.outputs.length}
                      pole="target"
                      delay={index * 110 + 140}
                    />
                  </span>
                </div>
                <div className="group-hover:text-accent font-display mt-4 text-lg font-semibold transition-colors">
                  {agent.name}
                </div>
                <p className="text-ink-muted mt-2 flex-1 text-sm leading-snug">
                  {agent.role}
                </p>
                <p className="text-label text-ink-faint mt-4 font-mono">
                  {agent.inputs.length} in &middot; {agent.outputs.length} out
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
