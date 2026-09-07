import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Use cases",
  description:
    "What teams run on VektoForge: platform exits, cost-driven consolidation, post-acquisition integration estates and end-of-support deadlines.",
  path: "/use-cases",
});

export default function UseCasesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Use cases"
        title="Why teams start a migration."
        lede="The technical path is only half of it. These are the situations that put a migration on the roadmap in the first place."
        crumbs={[{ name: "Use cases", path: "/use-cases" }]}
      />

      <Section bordered={false}>
        <Pending
          item="Use case list, with the trigger and the outcome for each"
          due="10 Sep"
          note="Best source is your own pipeline: what did the last ten prospects say when they explained why they were looking? Each becomes /use-cases/[slug]."
        />
      </Section>

      <CtaBand />
    </>
  );
}
