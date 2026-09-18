import { migrations } from "@/content/migrations";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { MigrationLedger } from "@/components/sections/migration-ledger";
import { CtaBand } from "@/components/sections/cta-band";
import { CoverageMatrix } from "@/components/sections/coverage-matrix";

export const metadata = buildMetadata({
  title: "Migration paths",
  description:
    "Every source and target integration platform pair VektoForge supports, with the artifacts read on the source side and how they map onto the target.",
  path: "/migrations",
});

export default function MigrationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Migrations"
        title="Every path we support, documented."
        lede="A migration path is defined by what it reads on the source platform and what it produces on the target. Each page states both, along with the parts that stay a human decision."
        crumbs={[{ name: "Migrations", path: "/migrations" }]}
      />

      <Section bordered={false}>
        <MigrationLedger migrations={migrations} />
      </Section>

      <Section
        tone="accent"
        eyebrow="Coverage"
        heading="Which paths we document."
        lede="A path exists when we can describe what we read on the source side and how it maps onto the target. The blanks are as much the point as the marks."
      >
        <CoverageMatrix />
      </Section>

      <CtaBand />
    </>
  );
}
