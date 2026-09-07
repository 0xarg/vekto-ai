import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Case studies",
  description:
    "Migrations Vekto AI has run, with the estate size, the platforms involved, the timeline and the measured outcome.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Migrations we have run."
        lede="Each study states the estate we started with, the platforms involved, how long it took and what was measured afterwards."
        crumbs={[{ name: "Case studies", path: "/case-studies" }]}
      />

      <Section bordered={false}>
        <Pending
          item="At least one customer migration story, with real numbers"
          due="10 Sep"
          note="Anonymised is fine — 'a global life-sciences manufacturer' works well. This page cannot launch empty; it is the page enterprise buyers open first. Also need written sign-off for any customer logo or quote."
        />
      </Section>

      <CtaBand />
    </>
  );
}
