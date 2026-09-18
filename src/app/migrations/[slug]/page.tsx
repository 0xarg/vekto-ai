import { notFound } from "next/navigation";

import { migrations, getMigration } from "@/content/migrations";
import { agents } from "@/content/agents";
import { buildMetadata } from "@/lib/seo";
import { howToSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { PendingSection } from "@/components/ui/pending-section";
import { Readout } from "@/components/ui/label";
import { PlatformPole } from "@/components/sections/migration-ledger";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { CtaBand } from "@/components/sections/cta-band";
import { stageIndex } from "@/lib/derived";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return migrations.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const migration = getMigration(slug);
  if (!migration) return {};

  return buildMetadata({
    title: migration.headline,
    description: migration.summary,
    path: `/migrations/${migration.slug}`,
    // Unconfirmed paths must never be indexed, even if they render.
    indexable: migration.status === "published",
  });
}

export default async function MigrationPage({ params }: Params) {
  const { slug } = await params;
  const migration = getMigration(slug);
  if (!migration) notFound();

  const { sourcePlatform, targetPlatform, sourceArtifacts } = migration;

  return (
    <>
      <JsonLd
        schema={howToSchema({
          name: migration.headline,
          description: migration.summary,
          steps: agents.map((a) => ({ name: a.name, text: a.role })),
        })}
      />

      <PageHeader
        eyebrow="Migration path"
        title={migration.headline}
        lede={migration.summary}
        crumbs={[
          { name: "Migrations", path: "/migrations" },
          {
            name: `${sourcePlatform.shortName} to ${targetPlatform.shortName}`,
            path: `/migrations/${migration.slug}`,
          },
        ]}
      >
        {/* The same pair-and-count idiom the index ledger uses, so the row you
            clicked and the page you land on state the pair identically. */}
        <div className="border-rule grid gap-6 border-t pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start sm:gap-6">
            <PlatformPole platform={sourcePlatform} pole="source" />
            <span
              aria-hidden
              className="text-ink-faint hidden self-center font-mono text-sm sm:block"
            >
              &rarr;
            </span>
            <PlatformPole platform={targetPlatform} pole="target" />
          </div>
          <Readout
            orientation="stacked"
            value={sourceArtifacts.length}
            label="artifact classes"
            className="lg:text-right"
          />
        </div>
      </PageHeader>

      <PipelineStrip />

      {migration.status === "draft" && (
        <Section bordered={false} density="tight">
          <Pending
            item={`Confirm Vekto supports ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
            due="5 Sep"
            note="This page is scaffolded but excluded from the sitemap and set to noindex until confirmed. It will not appear in production builds."
          />
        </Section>
      )}

      <Section
        bordered={false}
        tone="legacy"
        density="loose"
        eyebrow="Source estate"
        heading={`What we read on the ${sourcePlatform.shortName} side`}
        lede="Discovery inventories these artifacts and the dependencies between them before anything is changed."
      >
        {/* A numbered inventory rather than a card grid: the count is real, it
            differs from pair to pair, and an enumerated list is what this
            section actually is. The index is the item's position in the pair's
            own `sourceArtifacts`. */}
        <ol className="divide-rule border-rule divide-y border-y">
          {sourceArtifacts.map((artifact, i) => (
            <li
              key={artifact}
              className="flex items-baseline gap-5 py-4 sm:gap-8"
            >
              <span className="text-legacy text-label shrink-0 font-mono">
                {stageIndex(i + 1)}
              </span>
              <span className="text-ink text-sm leading-relaxed sm:text-base">
                {artifact}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <PendingSection
        tone="surface"
        eyebrow="Process"
        heading="How the migration runs"
        lede="The same five stages run on every path. What changes between paths is the mapping strategy Analysis selects and the conventions Transformation writes to."
        item={`Platform-specific mapping detail for ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
        due="15 Sep"
        note="Needs an engineer to describe how each source artifact class maps onto the target. This is the section that makes the page rank and makes it credible."
      />

      <PendingSection
        bordered={false}
        eyebrow="Evidence"
        heading="Migrations we have run on this path"
        item={`A customer story for ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
        due="10 Sep"
        note="Anonymized is fine. Without it this page argues capability without proof."
      />

      <CtaBand />
    </>
  );
}
