import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, softwareApplicationSchema } from "@/lib/jsonld";
import { migrations } from "@/content/migrations";
import { agents } from "@/content/agents";
import { faq } from "@/content/faq";
import { stageIndex } from "@/lib/derived";
import { JsonLd } from "@/components/ui/json-ld";
import { Section } from "@/components/ui/section";
import { PendingSection } from "@/components/ui/pending-section";
import { ButtonLink } from "@/components/ui/button";
import { Card, type Tint } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Boxes,
  GitCompareArrows,
  Layers,
  Microscope,
  Route,
  ScrollText,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { CodeTransform } from "@/components/sections/code-transform";
import { PlatformStrip } from "@/components/sections/platform-strip";
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
  icon: React.ReactNode;
}[] = [
  {
    title: "Manual rewrites do not finish",
    body: "Hand-migrating an estate of any size is measured in years, and the estate keeps changing underneath the effort.",
    tint: "clay",
    icon: <Layers className="h-4.5 w-4.5" />,
  },
  {
    title: "Estimates are guesses",
    body: "Without a complete dependency graph, scoping a migration is guesswork — which is why so many are re-scoped mid-flight.",
    tint: "amber",
    icon: <Route className="h-4.5 w-4.5" />,
  },
  {
    title: "Risk sits in the gaps",
    body: "The failures are rarely in the obvious flows. They are in the edge cases nobody remembered were there.",
    tint: "violet",
    icon: <ShieldAlert className="h-4.5 w-4.5" />,
  },
];

/** One hue and one icon per pipeline stage. Decorative — see `Card`. */
const stageStyle: { tint: Tint; icon: React.ReactNode }[] = [
  { tint: "blue", icon: <Boxes className="h-4.5 w-4.5" /> },
  { tint: "violet", icon: <Microscope className="h-4.5 w-4.5" /> },
  { tint: "clay", icon: <GitCompareArrows className="h-4.5 w-4.5" /> },
  { tint: "sage", icon: <Workflow className="h-4.5 w-4.5" /> },
  { tint: "amber", icon: <ScrollText className="h-4.5 w-4.5" /> },
];

/**
 * A cell's graphic zone: one mark per input and one per output, drawn at a size
 * you can actually see.
 *
 * The counts resolve from the agent registry, so the marks state something real
 * — the same device the pipeline strip uses. The wash behind them is the cell's
 * decorative tint and means nothing.
 */
function StageGraphic({
  agent,
  wide,
}: {
  agent: (typeof agents)[number];
  wide: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`border-rule relative flex items-end gap-2 overflow-hidden border-b px-6 pb-0 ${
        wide ? "h-24" : "h-28"
      }`}
      style={{
        backgroundColor: "var(--chip-wash)",
        backgroundImage:
          "radial-gradient(ellipse 60% 120% at 85% 110%, var(--chip-ink) 0%, transparent 62%)",
      }}
    >
      {Array.from({ length: agent.inputs.length }).map((_, i) => (
        <span
          key={`in-${i}`}
          className="animate-tick-rise w-2.5 flex-none rounded-t-sm opacity-40"
          style={{
            height: `${42 + i * 15}%`,
            backgroundColor: "var(--chip-ink)",
            animationDelay: `${agent.step * 90 + i * 70}ms`,
          }}
        />
      ))}
      <span className="bg-rule-strong mx-2 mb-2 h-8 w-px flex-none" />
      {Array.from({ length: agent.outputs.length }).map((_, i) => (
        <span
          key={`out-${i}`}
          className="animate-tick-rise w-2.5 flex-none rounded-t-sm"
          style={{
            height: `${58 + i * 14}%`,
            backgroundColor: "var(--chip-ink)",
            animationDelay: `${agent.step * 90 + 150 + i * 70}ms`,
          }}
        />
      ))}
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
        eyebrow="The problem"
        heading="Legacy integration estates are large, undocumented and load-bearing."
        lede="The people who built them have moved on. The documentation describes an earlier version. Nothing can be switched off, because nobody is certain what depends on what."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item) => (
            <Card key={item.title} tint={item.tint} icon={item.icon} washed>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* The five agents as a bento. Each cell carries a graphic zone built from
          that stage's real input and output counts — the marks are derived, the
          hue and the icon are decoration. */}
      <Section
        density="loose"
        eyebrow="How it works"
        heading="Five agents, in sequence, over your real estate."
        lede="Each stage reads what the one before it produced. Nothing is changed until Transformation, and nothing is declared finished until Validation has compared it against the original."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => {
            const style = stageStyle[i];
            const wide = i < 2;
            return (
              <Card
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                tint={style.tint}
                icon={style.icon}
                className={wide ? "md:col-span-2 lg:col-span-3" : ""}
                graphic={<StageGraphic agent={agent} wide={wide} />}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-sm"
                    style={{ color: "var(--chip-ink)" }}
                  >
                    {stageIndex(agent.step)}
                  </span>
                  <h3 className="group-hover:text-accent text-xl font-semibold tracking-tight transition-colors">
                    {agent.name}
                  </h3>
                </div>
                <p className="text-ink-muted mt-3 max-w-2xl text-sm leading-relaxed">
                  {wide ? agent.description : agent.role}
                </p>

                <dl className="border-rule mt-5 grid gap-x-8 gap-y-4 border-t pt-5 sm:grid-cols-2">
                  <div>
                    <dt>
                      <Label className="mb-2.5">
                        Reads &middot; {agent.inputs.length}
                      </Label>
                    </dt>
                    {agent.inputs.map((input) => (
                      <dd
                        key={input}
                        className="text-ink-muted mt-1.5 text-xs leading-snug"
                      >
                        {input}
                      </dd>
                    ))}
                  </div>
                  <div>
                    <dt>
                      <Label className="mb-2.5">
                        Produces &middot; {agent.outputs.length}
                      </Label>
                    </dt>
                    {agent.outputs.map((output) => (
                      <dd
                        key={output}
                        className="text-ink-muted mt-1.5 text-xs leading-snug"
                      >
                        {output}
                      </dd>
                    ))}
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* The full two-pane figure, at the size it wants to be. It carried the
          hero until it was measured at ~400px tall and 1.05fr wide, which left
          the headline arguing with it. */}
      <Section
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

      <Section
        density="loose"
        eyebrow="Migration paths"
        heading="Pick your source and target platform."
        lede="Each path documents the artifacts we read on the source side, how they map onto the target, and what remains a human decision."
      >
        <MigrationLedger migrations={migrations.slice(0, 4)} />
        <div className="mt-8">
          <ButtonLink href="/migrations" variant="link">
            All migration paths <span aria-hidden>&rarr;</span>
          </ButtonLink>
        </div>
      </Section>

      <Section
        tone="surface"
        density="loose"
        eyebrow="Engagement"
        heading="Three ways to work with us."
        lede="The commercial shape differs more than the technology does. Which one fits depends on how much of the migration your team wants to own."
      >
        <EngagementModels />
      </Section>

      <Section
        tone="surface"
        density="loose"
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
