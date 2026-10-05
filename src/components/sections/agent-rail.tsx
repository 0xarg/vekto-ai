"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { agents } from "@/content/agents";
import { stageIndex } from "@/lib/derived";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AgentDiagram } from "@/components/diagrams/agent-diagram";

/**
 * The five stages as a pinned rail: the list sticks on the left while each
 * stage's panel passes on the right.
 *
 * This replaces a five-card bento whose five graphic zones were identical,
 * because `inputs.length` is 2 and `outputs.length` is 3 for every agent in the
 * registry. The rail gives each stage room for its own diagram, which is the
 * actual difference.
 *
 * On the motion rule: nothing here is gated on scroll. Every stage's heading,
 * copy, diagram and ledger is in the server-rendered HTML and visible on
 * arrival — `position: sticky` moves an element that is already painted. The one
 * IntersectionObserver below sets which rail item is marked current. It reveals
 * nothing; with JavaScript off, every stage still reads and the rail simply
 * stops highlighting. That is the line: an observer may decorate, it may not
 * gate content.
 *
 * Below `lg` the rail unpins and the stages stack. A sticky rail on a phone eats
 * the viewport it is supposed to be orienting you within.
 */
export function AgentRail() {
  const [current, setCurrent] = useState(0);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Only the marking. A panel that never intersects still rendered.
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
      {/* ---------------- The rail ---------------- */}
      <div className="hidden lg:block">
        <div className="sticky top-[var(--spacing-anchor)]">
          <Label className="mb-5">In sequence</Label>
          <ol className="border-rule border-l">
            {agents.map((agent, i) => {
              const active = i === current;
              return (
                <li key={agent.slug} className="relative">
                  {/* The current mark. A 2px rule against the hairline the list
                      already sits on, so nothing moves when it changes. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-0 -left-px h-full w-0.5 transition-colors duration-300",
                      active ? "bg-accent" : "bg-transparent",
                    )}
                  />
                  <Link
                    href={`/agents/${agent.slug}`}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "group flex items-baseline gap-3 py-3 pl-5 transition-colors duration-200",
                      active ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-sm transition-colors duration-200",
                        active ? "text-accent" : "text-ink-faint",
                      )}
                    >
                      {stageIndex(agent.step)}
                    </span>
                    <span className="font-display text-lg font-semibold">
                      {agent.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
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
            className="border-rule bg-surface shadow-card overflow-hidden rounded-lg border"
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
