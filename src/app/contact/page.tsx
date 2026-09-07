import { buildMetadata } from "@/lib/seo";
import { cta } from "@/lib/site";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/ui/section";
import { Pending } from "@/components/ui/pending";
import { Label } from "@/components/ui/label";
import { agents } from "@/content/agents";

export const metadata = buildMetadata({
  title: "Get a migration assessment",
  description:
    "Request a migration assessment. Discovery and Analysis run against your real estate and return the inventory, the classification and the decisions your team needs to make.",
  path: "/contact",
});

export default function ContactPage() {
  const assessmentStages = agents.slice(0, 2);

  return (
    <>
      <PageHeader
        eyebrow="Get started"
        title={cta.primary.label}
        lede="An assessment runs the first two stages of the pipeline against your actual estate and returns what we find. It is the fastest way to replace an estimate with an inventory."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Label className="mb-5">What an assessment covers</Label>
            <ol className="border-rule divide-rule divide-y border-y">
              {assessmentStages.map((stage) => (
                <li key={stage.slug} className="py-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-ink-faint font-mono text-sm">
                      {String(stage.step).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-serif text-lg">{stage.name}</h2>
                      <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <Pending
              className="mt-8"
              item="Assessment scope: duration, what we need from the customer, and cost"
              due="15 Sep"
              note="The page currently describes the stages but not the commitment. Buyers need to know what they are agreeing to before they fill in a form."
            />
          </div>

          <div>
            <Pending
              item="Contact form — wire to the existing Supabase send-inquiry-email function"
              owner="Anurag"
              due="18 Sep"
              note="The current site's form backend works. Needs Supabase access to confirm deliverability and set the recipient address."
            />
            <div id="demo" className="mt-6">
              <Pending
                item="Calendly embed — rebranded event"
                due="20 Sep"
                note="The current embed is titled 'Customer Support' and reads 'Welcome to my scheduling page'. Needs renaming before it goes on a buyer-facing page."
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
