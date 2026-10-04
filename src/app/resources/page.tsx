import Link from "next/link";

import { getCollection } from "@/lib/content/loader";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { Label } from "@/components/ui/label";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Technical writing on integration migration: platform comparisons, migration guides and field notes from real estates.",
  path: "/resources",
});

/** The enum values are slugs; these are how they read on the page. */
const categoryLabels: Record<string, string> = {
  guide: "Guide",
  comparison: "Comparison",
  "field-notes": "Field notes",
  reference: "Reference",
};

export default function ResourcesPage() {
  const resources = getCollection("resources");

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Field notes on integration migration."
        lede="Guides, platform comparisons and write-ups from real migrations. This is the surface that compounds — it is the difference between a brochure and a site that earns traffic."
        crumbs={[{ name: "Resources", path: "/resources" }]}
      />

      <Section bordered={false}>
        {resources.length === 0 ? (
          <Pending
            item="First three articles, or approval to draft them from your engineers' notes"
            owner="Anurag"
            due="20 Sep"
            note="The publishing machine ships with the site; the corpus does not. Launching with three solid pieces and a working template beats launching with none."
          />
        ) : (
          <>
            <div className="lattice lg:grid-cols-2">
              {resources.map(({ slug, frontmatter: fm }) => (
                <Link
                  key={slug}
                  href={`/resources/${slug}`}
                  className="group hover:bg-surface-2 flex flex-col p-6 transition-colors"
                >
                  <Label>{categoryLabels[fm.category] ?? fm.category}</Label>

                  <h2 className="group-hover:text-accent mt-4 text-xl font-semibold tracking-tight transition-colors">
                    {fm.title}
                  </h2>
                  <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                    {fm.description}
                  </p>

                  {/* Named authorship is a ranking input for technical content,
                      and anonymous technical writing reads as untrustworthy. */}
                  <div className="border-rule mt-5 border-t pt-4">
                    <p className="text-ink text-sm">{fm.author.name}</p>
                    <p className="text-ink-faint mt-1 text-xs">
                      {fm.author.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {resources.some((r) => r.frontmatter.status === "draft") && (
              <Pending
                className="mt-10"
                item="Confirm the unpublished articles in content/resources/"
                owner="Anurag"
                due="20 Sep"
                note="Drafts render here but are excluded from production builds and the sitemap until status is set to published."
              />
            )}
          </>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
