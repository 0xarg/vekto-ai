import Link from "next/link";

import { getCollection } from "@/lib/content/loader";
import { getPlatform } from "@/content/platforms";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { Label } from "@/components/ui/label";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Use cases",
  description:
    "What teams run on VektoForge: platform exits, cost-driven consolidation, post-acquisition integration estates and end-of-support deadlines.",
  path: "/use-cases",
});

export default function UseCasesPage() {
  const useCases = getCollection("use-cases");

  return (
    <>
      <PageHeader
        eyebrow="Use cases"
        title="Why teams start a migration."
        lede="The technical path is only half of it. These are the situations that put a migration on the roadmap in the first place."
        crumbs={[{ name: "Use cases", path: "/use-cases" }]}
      />

      <Section bordered={false}>
        {useCases.length === 0 ? (
          <Pending
            item="Use case list, with the trigger and the outcome for each"
            due="10 Sep"
            note="Best source is your own pipeline: what did the last ten prospects say when they explained why they were looking? Each becomes /use-cases/[slug]."
          />
        ) : (
          <>
            <div className="lattice 3xl:grid-cols-3 md:grid-cols-2">
              {useCases.map(({ slug, frontmatter: fm }) => (
                <Link
                  key={slug}
                  href={`/use-cases/${slug}`}
                  className="group hover:bg-surface-2 flex flex-col p-5 transition-colors sm:p-6"
                >
                  {fm.sourcePlatform && (
                    <span className="text-legacy bg-legacy-soft border-legacy-line mb-4 self-start rounded-sm border px-2.5 py-1 font-mono text-xs">
                      {getPlatform(fm.sourcePlatform).shortName}
                    </span>
                  )}

                  <h2 className="group-hover:text-accent text-xl font-semibold tracking-tight transition-colors">
                    {fm.title}
                  </h2>
                  <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                    {fm.description}
                  </p>

                  {/* The trigger is the buyer's own words for why they started
                      looking. It is what they recognize themselves in. */}
                  <div className="border-rule mt-5 border-t pt-4">
                    <Label className="mb-2">The trigger</Label>
                    <p className="text-ink-muted text-sm leading-relaxed">
                      {fm.trigger}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {useCases.some((u) => u.frontmatter.status === "draft") && (
              <Pending
                className="mt-10"
                item="Confirm the unpublished use cases in content/use-cases/"
                due="10 Sep"
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
