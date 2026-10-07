"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { agents } from "@/content/agents";
import { stageIndex } from "@/lib/derived";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AgentDiagram } from "@/components/diagrams/agent-diagram";
import { PipelineFlow } from "@/components/diagrams/pipeline-flow";

/**
 * The five stages as a pinned rail: the pipeline sticks on the left, marking
 * where you are, while each stage's panel passes on the right.
 *
 * On the motion rule, which shapes most of what follows. Nothing here is gated
 * on scroll. Every stage's heading, copy, diagram and ledger is in the
 * server-rendered HTML and visible on arrival; `position: sticky` moves an
 * element that is already painted, and the one IntersectionObserver below only
 * marks which stage is current. With JavaScript off every stage still reads and
 * the rail simply stops following. That is the line: an observer may decorate,
 * it may not gate.
 *
 * Which is also why the pinned panel holds the *pipeline* and not the current
 * stage's own diagram. A panel that swapped in stage N's diagram would have
 * four of the five hidden at any moment, and with JavaScript off only the first
 * would ever render — "invisible until you scroll", which is exactly the test
 * non-negotiable #2 sets and exactly the bug this rebuild exists to fix. So
 * each `AgentDiagram` stays inside its own panel, and the pinned rail marks
 * position on a shape that asserts only the ordering.
 *
 * Below `lg` the rail unpins and the stages stack. A sticky rail on a phone
 * eats the viewport it is supposed to be orienting you within.
 */
export function AgentRail() {
  const [current, setCurrent] = useState(0);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Only the marking, and only ever forward into `drawn`. A panel that never
    // intersects still rendered, and its diagram is already finished.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = panels.current.indexOf(entry.target as HTMLElement);
          if (i >= 0) setCurrent(i);
        }
      },
      // A band across the middle of the viewport, so the mark changes when a
      // panel reaches reading position rather than when its top edge appears.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of panels.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------- The pinned pipeline ---------------- */}
      <div className="hidden lg:block">
        <div className="sticky top-[var(--spacing-anchor)]">
          <Label className="mb-5">In sequence</Label>
          <PipelineFlow variant="rail" current={current} />

          {/* The current stage's role, restated under the rail. This is the
              one place the pinned panel carries words, and they are a copy of
              what the panel beside it already says — nothing is only here. */}
          <p className="text-ink-muted border-rule mt-6 border-t pt-5 text-xs leading-relaxed">
            {agents[current]?.role}
          </p>
        </div>
      </div>

      {/* ---------------- The panels ---------------- */}
      <div className="flex flex-col gap-5 sm:gap-6">
        {agents.map((agent, i) => (
          <article
            key={agent.slug}
            ref={(el) => {
              panels.current[i] = el;
            }}
            className={cn(
              "border-rule bg-surface shadow-card overflow-hidden rounded-lg border transition-colors duration-300",
              i === current && "border-accent-line",
            )}
          >
            <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <div className="p-5 sm:p-7">
                <div className="flex items-baseline gap-3">
                  <span className="text-accent font-mono text-sm">
                    {stageIndex(agent.step)}
                  </span>
                  <h3 className="font-display text-xl font-semibold">
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {agent.name}
                    </Link>
                  </h3>
                </div>
                <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                  {agent.description}
                </p>

                <dl className="border-rule mt-5 grid gap-x-8 gap-y-4 border-t pt-5 sm:grid-cols-2">
                  <div>
                    <dt>
                      <Label className="mb-2.5">
                        Reads &middot; {agent.inputs.length}
                      </Label>
                    </dt>
                    {agent.inputs.map((input) => (
                      <dd
                        key={input}
                        className="text-ink-muted mt-1.5 text-xs leading-snug"
                      >
                        {input}
                      </dd>
                    ))}
                  </div>
                  <div>
                    <dt>
                      <Label className="mb-2.5">
                        Produces &middot; {agent.outputs.length}
                      </Label>
                    </dt>
                    {agent.outputs.map((output) => (
                      <dd
                        key={output}
                        className="text-ink-muted mt-1.5 text-xs leading-snug"
                      >
                        {output}
                      </dd>
                    ))}
                  </div>
                </dl>
              </div>

              {/* The diagram sits on its own tinted field rather than inside the
                  copy column, so it reads as the panel's subject and not as an
                  illustration dropped next to the text. */}
              <div className="border-rule bg-surface-2 text-ink-muted order-first flex min-h-[12rem] items-center justify-center border-b p-5 sm:order-last sm:border-b-0 sm:border-l">
                <AgentDiagram agent={agent} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
