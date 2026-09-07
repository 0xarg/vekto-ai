import { notFound } from "next/navigation";

import { migrations, getMigration } from "@/content/migrations";
import { agents } from "@/content/agents";
import { buildMetadata } from "@/lib/seo";
import { howToSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { CtaBand } from "@/components/sections/cta-band";

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

  const { sourcePlatform, targetPlatform } = migration;

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
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-legacy bg-legacy-soft border-legacy-line rounded-sm border px-3 py-1.5 font-mono text-sm">
            {sourcePlatform.name}
          </span>
          <span className="text-ink-faint font-mono text-sm">&rarr;</span>
          <span className="text-accent bg-accent-soft border-accent-line rounded-sm border px-3 py-1.5 font-mono text-sm">
            {targetPlatform.name}
          </span>
        </div>
      </PageHeader>

      {migration.status === "draft" && (
        <Section bordered={false} className="py-8!">
          <Pending
            item={`Confirm Vekto supports ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
            due="5 Sep"
            note="This page is scaffolded but excluded from the sitemap and set to noindex until confirmed. It will not appear in production builds."
          />
        </Section>
      )}

      <Section
        eyebrow="Source estate"
        heading={`What we read on the ${sourcePlatform.shortName} side`}
        lede="Discovery inventories these artefacts and the dependencies between them before anything is changed."
      >
        <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {migration.sourceArtifacts.map((artifact) => (
            <li
              key={artifact}
              className="border-rule bg-surface flex items-start gap-3 border p-5 text-sm"
            >
              <span className="text-legacy mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
              <span className="text-ink-muted leading-relaxed">{artifact}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="surface"
        eyebrow="Process"
        heading="How the migration runs"
        lede="The same five stages run on every path. What changes between paths is the mapping strategy Analysis selects and the conventions Transformation writes to."
      >
        <Pending
          item={`Platform-specific mapping detail for ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
          due="15 Sep"
          note="Needs an engineer to describe how each source artefact class maps onto the target. This is the section that makes the page rank and makes it credible."
        />
      </Section>

      <PipelineStrip />

      <Section eyebrow="Evidence" heading="Migrations we have run on this path">
        <Pending
          item={`A customer story for ${sourcePlatform.shortName} to ${targetPlatform.shortName}`}
          due="10 Sep"
          note="Anonymised is fine. Without it this page argues capability without proof."
        />
      </Section>

      <CtaBand />
    </>
  );
}
