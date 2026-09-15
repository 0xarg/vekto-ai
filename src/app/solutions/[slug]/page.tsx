import { notFound } from "next/navigation";
import Link from "next/link";

import { getCollection, getEntry } from "@/lib/content/loader";
import { Mdx } from "@/lib/content/mdx";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { CtaBand } from "@/components/sections/cta-band";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCollection("solutions").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("solutions", slug);
  if (!entry) return {};
  const { frontmatter: fm } = entry;

  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/solutions/${slug}`,
    indexable: fm.status === "published",
  });
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const entry = getEntry("solutions", slug);
  if (!entry) notFound();

  const { frontmatter: fm, body } = entry;

  return (
    <>
      <PageHeader
        eyebrow="Solution"
        title={fm.title}
        lede={fm.description}
        crumbs={[
          { name: "Solutions", path: "/solutions" },
          { name: fm.title, path: `/solutions/${slug}` },
        ]}
      />

      <Section bordered={false} className="py-10!">
        <div className="border-rule bg-surface max-w-2xl border p-6">
          <Label className="mb-3">Best fit</Label>
          <p className="text-ink-muted leading-relaxed">{fm.bestFit}</p>
        </div>
      </Section>

      <Section bordered={false} className="pt-0!">
        <Container width="prose" className="px-0! sm:px-0!">
          <Mdx source={body} />
        </Container>
      </Section>

      {fm.relatedMigrations.length > 0 && (
        <Section
          bordered
          tone="surface"
          heading="Migration paths this programme covers"
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
