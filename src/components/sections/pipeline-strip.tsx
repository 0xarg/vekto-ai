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
      <Container width="wide" className="px-0! sm:px-0!">
        <ol className="divide-rule grid divide-y sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {agents.map((agent, index) => (
            <li key={agent.slug}>
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
                <div className="group-hover:text-accent mt-4 text-lg font-semibold tracking-tight transition-colors">
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
