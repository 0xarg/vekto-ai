import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = buildMetadata({
  title: "Solutions",
  description:
    "Modernisation programmes by shape of problem: legacy middleware modernisation, API modernisation, and platform consolidation.",
  path: "/solutions",
});

/** Programme shapes named in the signed scope document. */
const solutions = [
  {
    name: "Legacy middleware modernisation",
    body: "Moving an entire ESB or integration estate off a platform that is end-of-life, unsupported, or priced out of viability.",
  },
  {
    name: "API modernisation",
    body: "Turning point-to-point integrations and SOAP services into a governed API estate on a modern platform.",
  },
  {
    name: "Integration migration",
    body: "Like-for-like movement of an existing estate onto a new platform, preserving behaviour before changing it.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Programmes by shape of problem."
        lede="Migration paths describe platforms. Solutions describe the programme you are actually running, which usually spans more than one path."
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
      />

      <Section bordered={false}>
        <div className="grid gap-px sm:grid-cols-3">
          {solutions.map((s) => (
            <div key={s.name} className="border-rule bg-surface border p-6">
              <h2 className="font-serif text-lg">{s.name}</h2>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <Pending
          className="mt-10"
          item="Confirm the solution set, and whether each needs its own page"
          due="5 Sep"
          note="Currently seeded from the scope document. Each of these can become /solutions/[slug] with its own template once confirmed."
        />
      </Section>

      <CtaBand />
    </>
  );
}
