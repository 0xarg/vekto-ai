import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { agents, getAgent } from "@/content/agents";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Label } from "@/components/ui/label";
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

export default async function AgentPage({ params }: Params) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const index = agents.findIndex((a) => a.slug === agent.slug);
  const previous = agents[index - 1];
  const next = agents[index + 1];

  return (
    <>
      <PageHeader
        eyebrow={`Stage ${String(agent.step).padStart(2, "0")} of ${agents.length}`}
        title={agent.name}
        lede={agent.description}
        crumbs={[
          { name: "Agents", path: "/agents" },
          { name: agent.name, path: `/agents/${agent.slug}` },
        ]}
      />

      <Section bordered={false}>
        <div className="grid gap-px sm:grid-cols-2">
          <div className="border-rule bg-surface border p-8">
            <Label className="mb-5">Reads</Label>
            <ul className="space-y-3">
              {agent.inputs.map((input) => (
                <li key={input} className="flex gap-3 text-sm leading-relaxed">
                  <span className="text-legacy mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span className="text-ink-muted">{input}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-rule bg-surface border p-8">
            <Label className="mb-5">Produces</Label>
            <ul className="space-y-3">
              {agent.outputs.map((output) => (
                <li key={output} className="flex gap-3 text-sm leading-relaxed">
                  <span className="text-accent mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span className="text-ink-muted">{output}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section bordered heading="Where this sits in the pipeline">
        <nav className="grid gap-px sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/agents/${previous.slug}`}
              className="border-rule bg-surface hover:border-rule-strong group border p-6 transition-colors"
            >
              <span className="text-ink-faint flex items-center gap-2 font-mono text-xs">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Previous stage
              </span>
              <span className="group-hover:text-accent mt-3 block font-serif text-lg transition-colors">
                {previous.name}
              </span>
            </Link>
          ) : (
            <div className="border-rule bg-surface-2 border p-6">
              <span className="text-ink-faint font-mono text-xs">
                First stage in the pipeline
              </span>
            </div>
          )}

          {next ? (
            <Link
              href={`/agents/${next.slug}`}
              className="border-rule bg-surface hover:border-rule-strong group border p-6 text-right transition-colors"
            >
              <span className="text-ink-faint flex items-center justify-end gap-2 font-mono text-xs">
                Next stage
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="group-hover:text-accent mt-3 block font-serif text-lg transition-colors">
                {next.name}
              </span>
            </Link>
          ) : (
            <div className="border-rule bg-surface-2 border p-6 text-right">
              <span className="text-ink-faint font-mono text-xs">
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
