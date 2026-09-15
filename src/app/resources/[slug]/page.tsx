import { notFound } from "next/navigation";
import Link from "next/link";

import { getCollection, getEntry } from "@/lib/content/loader";
import { Mdx } from "@/lib/content/mdx";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/sections/cta-band";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCollection("resources").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("resources", slug);
  if (!entry) return {};
  const { frontmatter: fm } = entry;

  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/resources/${slug}`,
    type: "article",
    publishedTime: fm.publishedAt,
    modifiedTime: fm.updatedAt,
    indexable: fm.status === "published",
  });
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("resources", slug);
  if (!entry) notFound();

  const { frontmatter: fm, body } = entry;

  return (
    <>
      <JsonLd
        schema={articleSchema({
          headline: fm.title,
          description: fm.description,
          path: `/resources/${slug}`,
          datePublished: fm.publishedAt,
          dateModified: fm.updatedAt,
        })}
      />

      <PageHeader
        eyebrow={fm.category.replace("-", " ")}
        title={fm.title}
        lede={fm.description}
        crumbs={[
          { name: "Resources", path: "/resources" },
          { name: fm.title, path: `/resources/${slug}` },
        ]}
      >
        {/* Named author. Anonymous technical writing reads as untrustworthy
            to this audience, and author identity is a genuine ranking input. */}
        <div className="text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-ink font-medium">{fm.author.name}</span>
          <span className="text-ink-faint">{fm.author.role}</span>
          <span className="text-ink-faint">·</span>
          <time dateTime={fm.publishedAt} className="text-ink-faint">
            {formatDate(fm.publishedAt)}
          </time>
        </div>
      </PageHeader>

      <Section bordered={false}>
        <Container width="prose" className="px-0! sm:px-0!">
          <Mdx source={body} />
        </Container>
      </Section>

      {fm.relatedMigrations.length > 0 && (
        <Section
          bordered
          tone="surface"
          eyebrow="Related"
          heading="Migration paths this applies to"
          lede="Articles link through to the pages that describe the full migration. Without this, technical writing never reaches the pages it should support."
        >
          <ul className="flex flex-wrap gap-3">
            {fm.relatedMigrations.map((m) => (
              <li key={m}>
                <Link
                  href={`/migrations/${m}`}
                  className="border-rule bg-surface hover:border-accent text-accent inline-block rounded-sm border px-4 py-2 text-sm transition-colors"
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
