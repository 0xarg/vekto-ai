import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCollection } from "@/lib/content/loader";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { Label } from "@/components/ui/label";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Solutions",
  description:
    "Modernisation programmes by shape of problem: legacy middleware modernisation, API modernisation, and like-for-like integration migration.",
  path: "/solutions",
});

export default function SolutionsPage() {
  const solutions = getCollection("solutions").sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );

  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Programmes by shape of problem."
        lede="Migration paths describe platforms. Solutions describe the programme you are actually running, which usually spans more than one path."
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
      />

      <Section bordered={false}>
        {solutions.length === 0 ? (
          <Pending
            item="Confirm the solution set, and whether each needs its own page"
            due="5 Sep"
            note="Content files live in content/solutions/. Three are drafted and awaiting confirmation."
          />
        ) : (
          <>
            <div className="grid gap-px lg:grid-cols-3">
              {solutions.map(({ slug, frontmatter: fm }) => (
                <Link
                  key={slug}
                  href={`/solutions/${slug}`}
                  className="border-rule bg-surface hover:border-rule-strong group flex flex-col border p-6 transition-colors"
                >
                  <h2 className="group-hover:text-accent font-serif text-xl transition-colors">
                    {fm.title}
                  </h2>
                  <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                    {fm.description}
                  </p>
                  <div className="border-rule mt-5 border-t pt-4">
                    <Label className="mb-2">Best fit</Label>
                    <p className="text-ink-muted text-sm leading-relaxed">
                      {fm.bestFit}
                    </p>
                  </div>
                  <span className="text-accent mt-5 inline-flex items-center gap-2 text-sm font-medium">
                    Read more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>

            {solutions.some((s) => s.frontmatter.status === "draft") && (
              <Pending
                className="mt-10"
                item="Confirm the solution set — three pages are drafted but unconfirmed"
                due="5 Sep"
                note="Drafts render here but are excluded from production builds and the sitemap until status is set to published in content/solutions/*.mdx."
              />
            )}
          </>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
