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
 */
function Ticks({ count, pole }: { count: number; pole: "source" | "target" }) {
  return (
    <span aria-hidden className="flex items-center gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block h-3 w-0.5",
            pole === "source" ? "bg-legacy-on-dark" : "bg-accent-on-dark",
          )}
        />
      ))}
    </span>
  );
}

/**
 * The five-stage pipeline as a hairline-ruled strip on the dark surface.
 * Doubles as internal linking into every agent detail page from any layout that
 * renders it, and is the site's second tonal event — before it, the only dark
 * band was the closing CTA, so every page ran pale until its last screen.
 *
 * Each cell carries a rail across its head — the stage index on the left, its
 * real input and output counts on the right — and because the column dividers
 * are a single pixel, those rails line up into one rule running the width of
 * the strip. That is what makes it read as a pipeline rather than five adjacent
 * boxes. Every number resolves from the agent registry.
 */
export function PipelineStrip() {
  return (
    <div
      data-band
      data-tone="inverse"
      className="bg-inverse border-rule-inverse border-y"
    >
      <Container width="wide" className="px-0! sm:px-0!">
        <ol className="divide-rule-inverse grid divide-y sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:bg-inverse-lifted group flex h-full flex-col p-6 transition-colors"
              >
                <div className="border-rule-inverse -mx-6 flex items-center justify-between gap-4 border-b px-6 pb-4">
                  <span className="text-label text-ink-inverse-faint group-hover:text-accent-on-dark font-mono transition-colors">
                    {stageIndex(agent.step)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ticks count={agent.inputs.length} pole="source" />
                    <span
                      aria-hidden
                      className="text-ink-inverse-faint font-mono text-xs"
                    >
                      &middot;
                    </span>
                    <Ticks count={agent.outputs.length} pole="target" />
                  </span>
                </div>
                <div className="text-ink-inverse group-hover:text-accent-on-dark mt-4 font-serif text-lg transition-colors">
                  {agent.name}
                </div>
                <p className="text-ink-inverse-muted mt-2 flex-1 text-sm leading-snug">
                  {agent.role}
                </p>
                <p className="text-label text-ink-inverse-faint mt-4 font-mono">
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
