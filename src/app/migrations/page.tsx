import { migrations } from "@/content/migrations";
import { platforms } from "@/content/platforms";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { MigrationGrid } from "@/components/sections/migration-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Label } from "@/components/ui/label";

export const metadata = buildMetadata({
  title: "Migration paths",
  description:
    "Every source and target integration platform pair VektoForge supports, with the artefacts read on the source side and how they map onto the target.",
  path: "/migrations",
});

export default function MigrationsPage() {
  const sources = platforms.filter((p) => p.role === "source");
  const targets = platforms.filter((p) => p.role === "target");

  return (
    <>
      <PageHeader
        eyebrow="Migrations"
        title="Every path we support, documented."
        lede="A migration path is defined by what it reads on the source platform and what it produces on the target. Each page states both, along with the parts that stay a human decision."
        crumbs={[{ name: "Migrations", path: "/migrations" }]}
      />

      <Section bordered={false}>
        <MigrationGrid migrations={migrations} />
      </Section>

      <Section
        tone="surface"
        eyebrow="Coverage"
        heading="Platforms we read from and write to."
      >
        <div className="grid gap-px sm:grid-cols-2">
          <div className="border-rule bg-surface border p-8">
            <Label className="text-legacy mb-5">Source platforms</Label>
            <ul className="space-y-3">
              {sources.map((p) => (
                <li
                  key={p.id}
                  className="border-rule flex items-baseline justify-between border-b pb-3 last:border-b-0"
                >
                  <span className="text-ink text-sm">{p.name}</span>
                  <span className="text-ink-faint font-mono text-xs">
                    {p.vendor}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-rule bg-surface border p-8">
            <Label className="text-accent mb-5">Target platforms</Label>
            <ul className="space-y-3">
              {targets.map((p) => (
                <li
                  key={p.id}
                  className="border-rule flex items-baseline justify-between border-b pb-3 last:border-b-0"
                >
                  <span className="text-ink text-sm">{p.name}</span>
                  <span className="text-ink-faint font-mono text-xs">
                    {p.vendor}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
