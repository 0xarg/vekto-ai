import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";
import { EngagementModels } from "@/components/sections/engagement-models";

export const metadata = buildMetadata({
  title: "Engagement models",
  description:
    "Three ways to work with Vekto AI: managed migration delivered by our team, self-serve access to the VektoForge platform, and partner licensing.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engagement"
        title="Three ways to work with us."
        lede="Migration programs differ more in who does the work than in what the work is. Pick the shape that matches your team."
        crumbs={[{ name: "Engagement models", path: "/pricing" }]}
      />

      <Section bordered={false}>
        <EngagementModels withCta />

        <Pending
          className="mt-10"
          item="Decide whether this page shows prices, ranges, or 'contact us' only"
          due="15 Sep"
          note="Enterprise integration buyers usually expect no public pricing, but they do expect to understand the commercial shape. Right now the page describes the models without any commercial signal at all."
        />
      </Section>

      <CtaBand />
    </>
  );
}
