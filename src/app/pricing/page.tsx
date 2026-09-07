import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { CtaBand } from "@/components/sections/cta-band";
import { Label } from "@/components/ui/label";

export const metadata = buildMetadata({
  title: "Engagement models",
  description:
    "Three ways to work with Vekto AI: managed migration delivered by our team, self-serve access to the VektoForge platform, and partner licensing.",
  path: "/pricing",
});

/** Carried over from the existing site's engagement model section. Route kept
 *  at /pricing because that URL already exists and would otherwise 404. */
const models = [
  {
    name: "Managed migration",
    body: "Our team runs the migration end to end, with your architects reviewing at each stage gate.",
    fit: "Large estates, hard deadlines, limited internal capacity.",
  },
  {
    name: "Self-serve platform",
    body: "Your team drives VektoForge directly, with our support available on the parts that need judgement.",
    fit: "Teams with platform expertise who want to own the migration.",
  },
  {
    name: "Partner licensing",
    body: "Systems integrators run VektoForge inside their own delivery practice.",
    fit: "SIs and consultancies delivering migrations for their clients.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Engagement"
        title="Three ways to work with us."
        lede="Migration programmes differ more in who does the work than in what the work is. Pick the shape that matches your team."
        crumbs={[{ name: "Engagement models", path: "/pricing" }]}
      />

      <Section bordered={false}>
        <div className="grid gap-px lg:grid-cols-3">
          {models.map((m) => (
            <div
              key={m.name}
              className="border-rule bg-surface flex flex-col border p-8"
            >
              <h2 className="font-serif text-xl">{m.name}</h2>
              <p className="text-ink-muted mt-4 flex-1 text-sm leading-relaxed">
                {m.body}
              </p>
              <div className="border-rule mt-6 border-t pt-5">
                <Label className="mb-2">Best fit</Label>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {m.fit}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Pending
          className="mt-10"
          item="Decide whether this page shows prices, ranges, or 'contact us' only"
          due="15 Sep"
          note="Enterprise integration buyers usually expect no public pricing, but they do expect to understand the commercial shape. Right now the page describes the models without any commercial signal at all."
        />
      </Section>

      <CtaBand />
    </>
  );
}
