import { notFound } from "next/navigation";
import Link from "next/link";

import { getCollection, getEntry } from "@/lib/content/loader";
import { Mdx } from "@/lib/content/mdx";
import { getPlatform } from "@/content/platforms";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Container } from "@/components/ui/container";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCollection("case-studies").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("case-studies", slug);
  if (!entry) return {};
  const { frontmatter: fm } = entry;

  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/case-studies/${slug}`,
    type: "article",
    publishedTime: fm.publishedAt,
    modifiedTime: fm.updatedAt,
    indexable: fm.status === "published",
  });
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("case-studies", slug);
  if (!entry) notFound();

  const { frontmatter: fm, body } = entry;
  const source = getPlatform(fm.sourcePlatform);
  const target = getPlatform(fm.targetPlatform);

  return (
    <>
      <JsonLd
        schema={articleSchema({
          headline: fm.title,
          description: fm.description,
          path: `/case-studies/${slug}`,
          datePublished: fm.publishedAt,
          dateModified: fm.updatedAt,
        })}
      />

      <PageHeader
        eyebrow="Case study"
        title={fm.title}
        lede={fm.description}
        crumbs={[
          { name: "Case studies", path: "/case-studies" },
          { name: fm.customer, path: `/case-studies/${slug}` },
        ]}
      />

      {/* At a glance — readers scan this to decide whether the story
          resembles their own situation before reading anything else. */}
      <Section bordered={false} className="py-10!">
        <dl className="border-rule divide-rule grid divide-y border-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { k: "Industry", v: fm.industry },
            { k: "Estate size", v: fm.estateSize },
            { k: "Duration", v: fm.duration },
          ].map((item) => (
            <div key={item.k} className="p-5">
              <dt className="text-label text-ink-faint font-mono uppercase">
                {item.k}
              </dt>
              <dd className="text-ink mt-2">{item.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-legacy bg-legacy-soft border-legacy-line rounded-sm border px-3 py-1.5 font-mono text-sm">
            {source.name}
          </span>
          <span className="text-ink-faint font-mono text-sm">&rarr;</span>
          <span className="text-accent bg-accent-soft border-accent-line rounded-sm border px-3 py-1.5 font-mono text-sm">
            {target.name}
          </span>
        </div>
      </Section>

      <Section
        bordered
        tone="surface"
        eyebrow="Results"
        heading="What was measured"
      >
        <dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {fm.results.map((r) => (
            <div key={r.label} className="border-rule bg-surface border p-6">
              <dt className="text-label text-ink-faint font-mono uppercase">
                {r.label}
              </dt>
              <dd className="text-ink mt-3 font-serif text-3xl tabular-nums">
                {r.value}
              </dd>
              {/* Every figure carries its source. The scope forbids
                  unsourced statistics, and the schema enforces it. */}
              <dd className="text-ink-faint mt-3 text-xs leading-relaxed">
                {r.source}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section bordered={false}>
        <Container width="prose" className="px-0! sm:px-0!">
          <Mdx source={body} />
        </Container>
      </Section>

      {fm.quote && (
        <Section bordered tone="surface">
          <blockquote className="max-w-3xl">
            <p className="text-lead text-ink font-serif">
              &ldquo;{fm.quote.text}&rdquo;
            </p>
            <footer className="text-ink-muted mt-5 text-sm">
              {fm.quote.attribution}
            </footer>
          </blockquote>
        </Section>
      )}

      {fm.relatedMigrations.length > 0 && (
        <Section bordered heading="The migration path used here">
          <ul className="flex flex-wrap gap-3">
            {fm.relatedMigrations.map((m) => (
              <li key={m}>
                <Link
                  href={`/migrations/${m}`}
                  className="border-rule hover:border-accent text-accent inline-block rounded-sm border px-4 py-2 text-sm transition-colors"
                >
                  {m.replace(/-to-/, " → ")}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
