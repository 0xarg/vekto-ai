import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "About",
  description: `Who builds ${site.product}, and why ${site.name} approaches integration migration the way it does.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="Who builds this."
        lede="Enterprise buyers check whether the team behind a migration tool has actually run migrations. This page needs to answer that."
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <Section bordered={false}>
        <Pending
          item="Founder and team names, roles, photos and LinkedIn profiles"
          due="15 Sep"
          note="Also useful: the origin story — what the founders were doing before this, and what made them build it. That paragraph does more for credibility than any feature list."
        />
      </Section>

      <CtaBand />
    </>
  );
}
