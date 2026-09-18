import { notFound } from "next/navigation";
import Link from "next/link";

import { agents, getAgent } from "@/content/agents";
import { buildMetadata } from "@/lib/seo";
import { adjacentAgents, stageIndex } from "@/lib/derived";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Label, Readout } from "@/components/ui/label";
import { CtaBand } from "@/components/sections/cta-band";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};

  return buildMetadata({
    title: `${agent.name} agent`,
    description: agent.description,
    path: `/agents/${agent.slug}`,
  });
}

/**
 * An enumerated list of what a stage reads or produces. Numbered because the
 * count is a real, differing property of each stage, and because "three
 * outputs" is a more useful thing to know at a glance than three bullets.
 */
function StageList({
  items,
  pole,
  heading,
}: {
  items: string[];
  pole: "source" | "target";
  heading: string;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <Label className={pole === "source" ? "text-legacy" : "text-accent"}>
          {heading}
        </Label>
        <span className="text-ink-faint text-label font-mono">
          {items.length}
        </span>
      </div>
      <ol className="divide-rule border-rule divide-y border-t">
        {items.map((item, i) => (
          <li key={item} className="flex items-baseline gap-4 py-3">
            <span
              className={cn(
                "text-label shrink-0 font-mono",
                pole === "source" ? "text-legacy" : "text-accent",
              )}
            >
              {stageIndex(i + 1)}
            </span>
            <span className="text-ink-muted text-sm leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function AgentPage({ params }: Params) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const { previous, next } = adjacentAgents(agent.step);

  return (
    <>
      <PageHeader
        eyebrow={`Stage ${stageIndex(agent.step)} of ${stageIndex(agents.length)}`}
        title={agent.name}
        lede={agent.description}
        crumbs={[
          { name: "Agents", path: "/agents" },
          { name: agent.name, path: `/agents/${agent.slug}` },
        ]}
      >
        <ul className="border-rule flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t pt-6">
          <li>
            <Readout
              value={`${stageIndex(agent.step)} / ${stageIndex(agents.length)}`}
              label="pipeline position"
            />
          </li>
          <li>
            <Readout value={agent.inputs.length} label="inputs" />
          </li>
          <li>
            <Readout value={agent.outputs.length} label="outputs" />
          </li>
        </ul>
      </PageHeader>

      {/* Position rail. The marked cell is this stage, derived from `step`, so
          each of the five pages carries a visibly different mark — which is
          also what stops them reading as near-duplicates to a crawler. */}
      <nav aria-label="Pipeline stages" className="border-rule border-b">
        <Container width="wide" className="px-0! sm:px-0!">
          <ol className="divide-rule flex divide-x">
            {agents.map((a) => {
              const current = a.step === agent.step;
              return (
                <li key={a.slug} className="flex-1">
                  <Link
                    href={`/agents/${a.slug}`}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "text-label block px-2 py-3.5 text-center font-mono transition-colors",
                      current
                        ? "bg-accent text-accent-ink"
                        : "text-ink-faint hover:bg-surface hover:text-ink",
                    )}
                  >
                    <span className="sr-only">{a.name}, stage </span>
                    {stageIndex(a.step)}
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </nav>

      <Section bordered={false} density="loose">
        <div className="lattice sm:grid-cols-2">
          <StageList items={agent.inputs} pole="source" heading="Reads" />
          <StageList items={agent.outputs} pole="target" heading="Produces" />
        </div>
      </Section>

      <Section bordered heading="Where this sits in the pipeline">
        <nav className="lattice sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/agents/${previous.slug}`}
              className="group hover:bg-surface-2 block p-6 transition-colors"
            >
              <span className="text-ink-faint text-label block font-mono">
                <span aria-hidden>&larr;</span> Previous stage
              </span>
              <span className="group-hover:text-accent mt-3 block font-serif text-lg transition-colors">
                {previous.name}
              </span>
            </Link>
          ) : (
            <div className="p-6">
              <span className="text-ink-faint text-label font-mono">
                First stage in the pipeline
              </span>
            </div>
          )}

          {next ? (
            <Link
              href={`/agents/${next.slug}`}
              className="group hover:bg-surface-2 block p-6 text-right transition-colors"
            >
              <span className="text-ink-faint text-label block font-mono">
                Next stage <span aria-hidden>&rarr;</span>
              </span>
              <span className="group-hover:text-accent mt-3 block font-serif text-lg transition-colors">
                {next.name}
              </span>
            </Link>
          ) : (
            <div className="p-6 text-right">
              <span className="text-ink-faint text-label font-mono">
                Final stage in the pipeline
              </span>
            </div>
          )}
        </nav>
      </Section>

      <CtaBand />
    </>
  );
}
