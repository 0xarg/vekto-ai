import Link from "next/link";
import { agents } from "@/content/agents";
import { Container } from "@/components/ui/container";

/**
 * The five-stage pipeline as a hairline-ruled strip. Doubles as internal
 * linking into every agent detail page from any layout that renders it.
 */
export function PipelineStrip() {
  return (
    <div className="border-rule border-y">
      <Container width="wide" className="px-0! sm:px-0!">
        <ol className="divide-rule border-rule grid divide-y sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:bg-surface-2 group block h-full p-6 transition-colors"
              >
                <div className="text-label text-ink-faint group-hover:text-accent font-mono transition-colors">
                  {String(agent.step).padStart(2, "0")}
                </div>
                <div className="text-ink group-hover:text-accent mt-3 font-serif text-lg transition-colors">
                  {agent.name}
                </div>
                <p className="text-ink-muted mt-2 text-sm leading-snug">
                  {agent.role}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
