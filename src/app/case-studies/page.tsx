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
  title: "Case studies",
  description:
    "Migrations Vekto AI has run, with the estate size, the platforms involved, the timeline and the measured outcome.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  const studies = getCollection("case-studies");

  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title="Migrations we have run."
        lede="Each study states the estate we started with, the platforms involved, how long it took and what was measured afterwards."
        crumbs={[{ name: "Case studies", path: "/case-studies" }]}
      />

      <Section bordered={false}>
        {studies.length === 0 ? (
          <Pending
            item="At least one customer migration story, with real numbers"
            due="10 Sep"
            note="Anonymized is fine — 'a global life-sciences manufacturer' works well. This page cannot launch empty; it is the page enterprise buyers open first. Also need written sign-off for any customer logo or quote."
          />
        ) : (
          <>
            <div className="lattice lg:grid-cols-2">
              {studies.map(({ slug, frontmatter: fm }) => {
                const source = getPlatform(fm.sourcePlatform);
                const target = getPlatform(fm.targetPlatform);

                return (
                  <Link
                    key={slug}
                    href={`/case-studies/${slug}`}
                    className="group hover:bg-surface-2 flex flex-col p-6 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-legacy bg-legacy-soft border-legacy-line rounded-sm border px-2.5 py-1 font-mono text-xs">
                        {source.shortName}
                      </span>
                      <span className="text-ink-faint font-mono text-xs">
                        &rarr;
                      </span>
                      <span className="text-accent bg-accent-soft border-accent-line rounded-sm border px-2.5 py-1 font-mono text-xs">
                        {target.shortName}
                      </span>
                    </div>

                    <h2 className="group-hover:text-accent mt-5 font-serif text-xl transition-colors">
                      {fm.title}
                    </h2>
                    <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                      {fm.description}
                    </p>

                    {/* Estate size and duration are what a buyer scans for to
                        decide whether this resembles their own situation. */}
                    <dl className="border-rule mt-5 grid grid-cols-2 gap-5 border-t pt-4">
                      <div>
                        <Label className="mb-2">Estate size</Label>
                        <dd className="text-ink text-sm">{fm.estateSize}</dd>
                      </div>
                      <div>
                        <Label className="mb-2">Duration</Label>
                        <dd className="text-ink text-sm">{fm.duration}</dd>
                      </div>
                    </dl>

                    <span className="text-accent mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      Read the study
                      <span aria-hidden>&rarr;</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {studies.some((s) => s.frontmatter.status === "draft") && (
              <Pending
                className="mt-10"
                item="Confirm the unpublished case studies in content/case-studies/"
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
