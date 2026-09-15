import { notFound } from "next/navigation";
import Link from "next/link";

import { getCollection, getEntry } from "@/lib/content/loader";
import { Mdx } from "@/lib/content/mdx";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/sections/cta-band";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCollection("use-cases").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("use-cases", slug);
  if (!entry) return {};
  const { frontmatter: fm } = entry;

  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/use-cases/${slug}`,
    indexable: fm.status === "published",
  });
}

export default async function UseCasePage({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("use-cases", slug);
  if (!entry) notFound();

  const { frontmatter: fm, body } = entry;

  return (
    <>
      <PageHeader
        eyebrow="Use case"
        title={fm.title}
        lede={fm.description}
        crumbs={[
          { name: "Use cases", path: "/use-cases" },
          { name: fm.title, path: `/use-cases/${slug}` },
        ]}
      >
        {/* The trigger in the buyer's own words — this is what the page
            is really about, and what they searched for. */}
        <blockquote className="border-accent text-ink max-w-2xl border-l-2 pl-5 font-serif text-lg">
          &ldquo;{fm.trigger}&rdquo;
        </blockquote>
      </PageHeader>

      <Section bordered={false}>
        <Container width="prose" className="px-0! sm:px-0!">
          <Mdx source={body} />
        </Container>
      </Section>

      {fm.relatedMigrations.length > 0 && (
        <Section bordered tone="surface" heading="Relevant migration paths">
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
