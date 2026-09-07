import { agents } from "@/content/agents";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/sections/cta-band";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

      <Section bordered={false}>
        <ol className="border-rule divide-rule divide-y border-y">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:bg-surface-2 group grid gap-6 py-10 transition-colors md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10"
              >
                <div className="text-ink-faint group-hover:text-accent font-mono text-sm transition-colors md:w-16">
                  {String(agent.step).padStart(2, "0")}
                </div>
                <div className="max-w-2xl">
                  <h2 className="group-hover:text-accent text-h3 font-serif transition-colors">
                    {agent.name}
                  </h2>
                  <p className="text-ink-muted mt-3 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
                <ArrowRight
                  className="text-ink-faint group-hover:text-accent hidden h-5 w-5 transition-colors md:block"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  );
}
