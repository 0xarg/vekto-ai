import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { heroSpec } from "@/lib/derived";
import { softwareApplicationSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { PendingSection } from "@/components/ui/pending-section";
import { Readout } from "@/components/ui/label";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: `${site.product} platform`,
  description:
    "How VektoForge is put together: the agent pipeline, where it runs, what it reads from your source platform and what it hands back.",
  path: "/platform",
});

const outputs = [
  {
    title: "Working implementations",
    body: "Target-platform source and configuration, in your conventions, in your repository.",
  },
  {
    title: "A complete inventory",
    body: "Every artifact found on the source platform and the dependencies between them.",
  },
  {
    title: "An audit trail",
    body: "What was converted mechanically, what was changed by hand, and what remains open.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <JsonLd schema={softwareApplicationSchema()} />

      <PageHeader
        eyebrow="Platform"
        title="VektoForge, end to end."
        lede="A migration engine built around a single idea: read the estate you actually have, not the one the documentation describes."
        crumbs={[{ name: "Platform", path: "/platform" }]}
      >
        <ul className="border-rule flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t pt-6">
          {heroSpec.map((item) => (
            <li key={item.label}>
              <Readout value={item.value} label={item.label} />
            </li>
          ))}
        </ul>
      </PageHeader>

      <PipelineStrip />

      <PendingSection
        bordered={false}
        density="loose"
        eyebrow="Architecture"
        heading="How the platform is put together"
        lede="Enterprise buyers evaluate this section before anything else. It needs to be specific about deployment model, data flow and boundaries."
        item="Platform architecture: deployment model, data flow, and system boundaries"
        due="15 Sep"
        note="Needs: where the agents execute (our cloud, your VPC, on-prem), what leaves your network, and what a deployment looks like. A diagram would carry this section."
      />

      <Section
        tone="accent"
        eyebrow="Output"
        heading="What you get back"
        lede="The migration produces artifacts your team owns and can review — source code and configuration in the target platform's own formats, plus the record of how each item was handled."
      >
        <div className="lattice sm:grid-cols-3">
          {outputs.map((item) => (
            <div key={item.title} className="p-6">
              <h3 className="font-serif text-lg">{item.title}</h3>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stays a whole-band gap rather than rendering the seeded registry as a
          capability table: platforms.ts is explicit that its entries are
          factual names, not assertions that we support them. Listing them here
          under "supported" would be the fabricated-capability problem in a
          different costume. */}
      <PendingSection
        eyebrow="Integrations"
        heading="Supported platforms and versions"
        item="Confirmed source and target platform list, with supported versions"
        due="5 Sep"
        note="The registry in src/content/platforms.ts is currently seeded from the existing site. Every entry needs confirming, and version coverage needs adding."
      />

      <CtaBand />
    </>
  );
}
