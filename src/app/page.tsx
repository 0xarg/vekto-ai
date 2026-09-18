import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/jsonld";
import { migrations } from "@/content/migrations";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { PendingSection } from "@/components/ui/pending-section";
import { ButtonLink } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { PipelineStrip } from "@/components/sections/pipeline-strip";
import { MigrationLedger } from "@/components/sections/migration-ledger";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

const problems = [
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
];

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
        bordered={false}
        density="loose"
        eyebrow="The problem"
        heading="Legacy integration estates are large, undocumented and load-bearing."
        lede="The people who built them have moved on. The documentation describes an earlier version. Nothing can be switched off, because nobody is certain what depends on what."
      >
        <div className="lattice sm:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="p-6">
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
        lede="Each path documents the artifacts we read on the source side, how they map onto the target, and what remains a human decision."
        tone="accent"
      >
        <MigrationLedger migrations={migrations.slice(0, 4)} />
        <div className="mt-8">
          <ButtonLink href="/migrations" variant="link">
            All migration paths <span aria-hidden>&rarr;</span>
          </ButtonLink>
        </div>
      </Section>

      <PendingSection
        density="loose"
        eyebrow="Evidence"
        heading="Results from real migrations."
        lede="This section carries the proof: named or anonymized customer migrations with the numbers attached."
        item="At least one customer migration story with real figures"
        due="10 Sep"
        note="Anonymized is fine — 'a global life-sciences manufacturer' works. Without one, this section and /case-studies both launch empty, and this is the first thing enterprise buyers look for."
      />

      <CtaBand />
    </>
  );
}
