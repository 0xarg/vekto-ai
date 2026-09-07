import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/jsonld";
import { migrations } from "@/content/migrations";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { Hero } from "@/components/sections/hero";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { MigrationGrid } from "@/components/sections/migration-grid";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd schema={softwareApplicationSchema()} />

      <Hero
        eyebrow="VektoForge"
        title={
          <>
            Move off legacy middleware
            <br className="hidden sm:block" /> without rewriting it by hand.
          </>
        }
        lede="VektoForge runs five AI agents across your existing integration estate — inventorying what you have, generating implementations on your target platform, and showing you exactly what changed and what still needs a human."
      />

      <PipelineStrip />

      <Section
        eyebrow="The problem"
        heading="Legacy integration estates are large, undocumented and load-bearing."
        lede="The people who built them have moved on. The documentation describes an earlier version. Nothing can be switched off, because nobody is certain what depends on what."
      >
        <div className="grid gap-px sm:grid-cols-3">
          {[
            {
              title: "Manual rewrites do not finish",
              body: "Hand-migrating an estate of any size is measured in years, and the estate keeps changing underneath the effort.",
            },
            {
              title: "Estimates are guesses",
              body: "Without a complete dependency graph, scoping a migration is guesswork — which is why so many are re-scoped mid-flight.",
            },
            {
              title: "Risk sits in the gaps",
              body: "The failures are rarely in the obvious flows. They are in the edge cases nobody remembered were there.",
            },
          ].map((item) => (
            <div key={item.title} className="border-rule bg-surface border p-6">
              <h3 className="font-serif text-lg">{item.title}</h3>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Migration paths"
        heading="Pick your source and target platform."
        lede="Each path documents the artefacts we read on the source side, how they map onto the target, and what remains a human decision."
        tone="surface"
      >
        <MigrationGrid migrations={migrations.slice(0, 6)} />
        <div className="mt-8">
          <Link
            href="/migrations"
            className="text-accent inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            All migration paths
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Evidence"
        heading="Results from real migrations."
        lede="This section carries the proof: named or anonymised customer migrations with the numbers attached."
      >
        <Pending
          item="At least one customer migration story with real figures"
          due="10 Sep"
          note="Anonymised is fine — 'a global life-sciences manufacturer' works. Without one, this section and /case-studies both launch empty, and this is the first thing enterprise buyers look for."
        />
      </Section>

      <CtaBand />
    </>
  );
}
