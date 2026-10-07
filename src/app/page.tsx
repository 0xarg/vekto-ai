import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, softwareApplicationSchema } from "@/lib/jsonld";
import { migrations } from "@/content/migrations";
import { faq } from "@/content/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { PendingSection } from "@/components/ui/pending-section";
import { ButtonLink } from "@/components/ui/button";
import { Card, type Tint } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import {
  ConceptDiagram,
  type ConceptName,
} from "@/components/diagrams/concept-diagram";
import { Hero } from "@/components/sections/hero";
import { CodeTransform } from "@/components/sections/code-transform";
import { PlatformStrip } from "@/components/sections/platform-strip";
import { AgentRail } from "@/components/sections/agent-rail";
import { PipelineFlow } from "@/components/diagrams/pipeline-flow";
import { CoverageMatrix } from "@/components/sections/coverage-matrix";
import { MigrationLedger } from "@/components/sections/migration-ledger";
import { Evidence } from "@/components/sections/evidence";
import { PullQuote } from "@/components/sections/pull-quote";
import { EngagementModels } from "@/components/sections/engagement-models";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

const problems: {
  title: string;
  body: string;
  tint: Tint;
  diagram: ConceptName;
}[] = [
  {
    title: "Manual rewrites do not finish",
    body: "Hand-migrating an estate of any size is measured in years, and the estate keeps changing underneath the effort.",
    tint: "rose",
    diagram: "unfinishable",
  },
  {
    title: "Estimates are guesses",
    body: "Without a complete dependency graph, scoping a migration is guesswork — which is why so many are re-scoped mid-flight.",
    tint: "amber",
    diagram: "divergent",
  },
  {
    title: "Risk sits in the gaps",
    body: "The failures are rarely in the obvious flows. They are in the edge cases nobody remembered were there.",
    tint: "violet",
    diagram: "gaps",
  },
];

/**
 * A card's graphic zone. The diagram sits on the card's own tint rather than on
 * white, so the hue still does the job of telling one cell from another once the
 * icon chip it used to carry is gone.
 */
function CardGraphic({ name }: { name: ConceptName }) {
  return (
    <div
      aria-hidden
      className="border-rule text-ink-muted flex aspect-[9/5] items-center justify-center overflow-hidden border-b px-5 py-4"
      style={{ backgroundColor: "var(--chip-wash)" }}
    >
      <ConceptDiagram name={name} />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd
        schema={[
          softwareApplicationSchema(),
          faqSchema(
            faq.map((f) => ({ question: f.question, answer: f.answer })),
          ),
        ]}
      />

      <Hero
        eyebrow="Documented"
        title={
          <>
            Move off legacy middleware
            <br className="hidden sm:block" /> without rewriting it by hand.
          </>
        }
        lede="VektoForge runs five AI agents across your existing integration estate — inventorying what you have, generating implementations on your target platform, and showing you exactly what changed and what still needs a human."
      />

      <PlatformStrip />

      <Section
        bordered={false}
        density="loose"
        tone="surface"
        align="center"
        eyebrow="The problem"
        heading="Legacy integration estates are large, undocumented and load-bearing."
        lede="The people who built them have moved on. The documentation describes an earlier version. Nothing can be switched off, because nobody is certain what depends on what."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item) => (
            <Card
              key={item.title}
              tint={item.tint}
              graphic={<CardGraphic name={item.diagram} />}
            >
              <h3 className="font-display text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* The five stages twice over, at two altitudes.

          The pipeline comes first and answers the whole question in one shape:
          five stages, in order, what each reads and produces. It draws itself
          on load and a pulse runs it. Then the rail below gives each stage the
          room for its own diagram and its own ledger.

          Neither gates anything on scroll. The overview is finished before you
          reach it and the rail's panels are all in the HTML — see the note in
          agent-rail.tsx for why the pinned panel holds the pipeline rather than
          the current stage's diagram. */}
      <Section
        density="loose"
        align="center"
        eyebrow="How it works"
        heading={
          <>
            Five agents, in sequence,{" "}
            <span className="text-gradient">over your real estate.</span>
          </>
        }
        lede="Each stage reads what the one before it produced. Nothing is changed until Transformation, and nothing is declared finished until Validation has compared it against the original."
      >
        <PipelineFlow variant="overview" className="mb-14 sm:mb-20" />
        <AgentRail />
      </Section>

      {/* The full two-pane figure, at the size it wants to be. It carried the
          hero until it was measured at ~400px tall and 1.05fr wide, which left
          the headline arguing with it. */}
      <Section
        panel
        bordered={false}
        tone="surface"
        density="loose"
        eyebrow="What it produces"
        heading="Source on the left, generated implementation on the right."
        lede="A real BusinessWorks process and the Logic Apps workflow VektoForge generates from it. Nothing here is a mockup — it is the output format your team reviews, versions and owns."
      >
        <CodeTransform />
      </Section>

      <Evidence />

      <PullQuote />

      {/* Left-aligned, deliberately: a centred header floating above a matrix
          reads as marketing attached to a document.

          The coverage matrix was built for /migrations and only ever rendered
          there, which left this band as a ledger of one row in production —
          drafts are stripped, and only one pair is published. The matrix states
          the same fact with twelve cells instead of one line, and it states the
          gap as loudly as the coverage. */}
      <Section
        density="loose"
        eyebrow="Migration paths"
        heading="Pick your source and target platform."
        lede="Each path documents the artifacts we read on the source side, how they map onto the target, and what remains a human decision."
      >
        <CoverageMatrix />
        <div className="mt-12">
          <MigrationLedger migrations={migrations.slice(0, 4)} />
        </div>
        <div className="mt-8">
          <ButtonLink href="/migrations" variant="link">
            All migration paths <span aria-hidden>&rarr;</span>
          </ButtonLink>
        </div>
      </Section>

      <Section
        tone="surface"
        density="loose"
        align="center"
        eyebrow="Engagement"
        heading="Three ways to work with us."
        lede="The commercial shape differs more than the technology does. Which one fits depends on how much of the migration your team wants to own."
      >
        <EngagementModels />
      </Section>

      <Section
        tone="surface"
        density="loose"
        align="center"
        eyebrow="Questions"
        heading="What architects ask first."
        width="default"
      >
        <div className="bg-surface border-rule shadow-card rounded-lg border px-6 sm:px-8">
          <Accordion items={faq} className="border-y-0" />
        </div>
      </Section>

      {/* The six questions every enterprise security review asks are on
          /security and only the client can answer them. This band stays a gap
          in preview rather than carrying a plausible-sounding guess. */}
      <PendingSection
        density="tight"
        bordered={false}
        eyebrow="Security review"
        heading="Where your code runs, and who can see it."
        item="Answers to the six security questions on /security, plus certification status"
        due="15 Sep"
        note="Deployment model, data egress, retention, training-data policy, certifications, and access control. The training-data answer is usually the deciding one. Until these exist the homepage cannot carry a security section at all."
      />

      <CtaBand />
    </>
  );
}
