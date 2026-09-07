import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Technical writing on integration migration: platform comparisons, migration guides and field notes from real estates.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Field notes on integration migration."
        lede="Guides, platform comparisons and write-ups from real migrations. This is the surface that compounds — it is the difference between a brochure and a site that earns traffic."
        crumbs={[{ name: "Resources", path: "/resources" }]}
      />

      <Section bordered={false}>
        <Pending
          item="First three articles, or approval to draft them from your engineers' notes"
          owner="Anurag"
          due="20 Sep"
          note="The publishing machine ships with the site; the corpus does not. Launching with three solid pieces and a working template beats launching with none."
        />
      </Section>

      <CtaBand />
    </>
  );
}
