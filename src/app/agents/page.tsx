import Link from "next/link";
import { agents } from "@/content/agents";
import { stageIndex } from "@/lib/derived";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Label } from "@/components/ui/label";
import { PipelineFlow } from "@/components/diagrams/pipeline-flow";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "The five agents",
  description:
    "VektoForge runs a five-stage agent pipeline over an existing integration estate: Discovery, Analysis, Transformation, Validation and Reporting. What each stage reads, and what it produces.",
  path: "/agents",
});

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Five agents, in sequence, over your real estate."
        lede="Each stage consumes the output of the one before it. Nothing is inferred from a sample — the pipeline runs against the actual integration estate, and every stage records what it did."
        crumbs={[{ name: "Agents", path: "/agents" }]}
      />

      {/* The sequence as a shape, before the list of stages states it again in
          prose. This page carried neither until now — it was the one place the
          pipeline was described without being drawn. */}
      <Section bordered={false} density="tight">
        <PipelineFlow variant="overview" />
      </Section>

      <Section bordered={false} density="tight">
        <ol className="border-rule divide-rule divide-y border-y">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:bg-surface-2 group grid gap-6 py-10 transition-colors md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-10"
              >
                <div className="text-ink-faint group-hover:text-accent font-mono text-sm transition-colors md:w-16">
                  {stageIndex(agent.step)}
                </div>
                <div className="max-w-2xl">
                  <h2 className="group-hover:text-accent text-h3 font-display font-semibold transition-colors">
                    {agent.name}
                  </h2>
                  {/* The one-line role, then the description. The role was in
                      the registry and rendered nowhere on this page, so every
                      row opened with four sentences and no summary. */}
                  <p className="text-ink mt-2 text-sm font-medium">
                    {agent.role}
                  </p>
                  <p className="text-ink-muted mt-3 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* What the stage actually reads and produces, counted from
                      the registry rather than stated. */}
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
                <span
                  aria-hidden
                  className="text-ink-faint group-hover:text-accent hidden font-mono text-lg transition-colors md:block"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  );
}
