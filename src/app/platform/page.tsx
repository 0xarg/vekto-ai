import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { softwareApplicationSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: `${site.product} platform`,
  description:
    "How VektoForge is put together: the agent pipeline, where it runs, what it reads from your source platform and what it hands back.",
  path: "/platform",
});

export default function PlatformPage() {
  return (
    <>
      <JsonLd schema={softwareApplicationSchema()} />

      <PageHeader
        eyebrow="Platform"
        title="VektoForge, end to end."
        lede="A migration engine built around a single idea: read the estate you actually have, not the one the documentation describes."
        crumbs={[{ name: "Platform", path: "/platform" }]}
      />

      <PipelineStrip />

      <Section
        eyebrow="Architecture"
        heading="How the platform is put together"
        lede="Enterprise buyers evaluate this section before anything else. It needs to be specific about deployment model, data flow and boundaries."
      >
        <Pending
          item="Platform architecture: deployment model, data flow, and system boundaries"
          due="15 Sep"
          note="Needs: where the agents execute (our cloud, your VPC, on-prem), what leaves your network, and what a deployment looks like. A diagram would carry this section."
        />
      </Section>

      <Section
        tone="surface"
        eyebrow="Output"
        heading="What you get back"
        lede="The migration produces artefacts your team owns and can review — source code and configuration in the target platform's own formats, plus the record of how each item was handled."
      >
        <div className="grid gap-px sm:grid-cols-3">
          {[
            {
              title: "Working implementations",
              body: "Target-platform source and configuration, in your conventions, in your repository.",
            },
            {
              title: "A complete inventory",
              body: "Every artefact found on the source platform and the dependencies between them.",
            },
            {
              title: "An audit trail",
              body: "What was converted mechanically, what was changed by hand, and what remains open.",
            },
          ].map((item) => (
            <div key={item.title} className="border-rule bg-surface border p-6">
              <h3 className="font-serif text-lg">{item.title}</h3>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Integrations"
        heading="Supported platforms and versions"
      >
        <Pending
          item="Confirmed source and target platform list, with supported versions"
          due="5 Sep"
          note="The registry in src/content/platforms.ts is currently seeded from the existing site. Every entry needs confirming, and version coverage needs adding."
        />
      </Section>

      <CtaBand />
    </>
  );
}
