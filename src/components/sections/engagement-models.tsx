import { cta } from "@/lib/site";
import { Card, type Tint } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ButtonLink } from "@/components/ui/button";
import {
  ConceptDiagram,
  type ConceptName,
} from "@/components/diagrams/concept-diagram";

/**
 * The three ways to buy, in the shape a pricing table occupies.
 *
 * Carried over from the existing site's engagement section and now shared by
 * /pricing and the homepage, so the two cannot drift.
 *
 * There are no prices, and the columns do not pretend otherwise with a "Custom"
 * tile or a feature checklist of ticks. Enterprise integration buyers do not
 * expect a public number, but they do expect to understand the commercial shape,
 * and that is what these three state. Whether a range appears here at all is
 * still the client's open decision — see the `<Pending>` on /pricing.
 *
 * The diagram marks one of three positions on a track between "run by us" and
 * "run by your team". It is ordinal and nothing more. An earlier version drew a
 * filled bar at 85/50/20 percent, which is a fabricated statistic wearing a
 * diagram's clothes: nobody has measured what share of a migration each model
 * involves. The ordering is something the copy already states; the distances
 * are not.
 */
export const engagementModels: {
  name: string;
  body: string;
  fit: string;
  tint: Tint;
  diagram: ConceptName;
}[] = [
  {
    tint: "rose",
    diagram: "drive-full",
    name: "Managed migration",
    body: "Our team runs the migration end to end, with your architects reviewing at each stage gate.",
    fit: "Large estates, hard deadlines, limited internal capacity.",
  },
  {
    tint: "teal",
    diagram: "drive-shared",
    name: "Self-serve platform",
    body: "Your team drives VektoForge directly, with our support available on the parts that need judgement.",
    fit: "Teams with platform expertise who want to own the migration.",
  },
  {
    tint: "sage",
    diagram: "drive-partner",
    name: "Partner licensing",
    body: "Systems integrators run VektoForge inside their own delivery practice.",
    fit: "SIs and consultancies delivering migrations for their clients.",
  },
];

export function EngagementModels({ withCta = false }: { withCta?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {engagementModels.map((model, i) => (
        <Card
          key={model.name}
          tint={model.tint}
          className={i === 1 ? "lg:shadow-panel lg:-my-3" : ""}
          graphic={
            <div
              aria-hidden
              className="border-rule text-ink-muted flex aspect-[5/2] items-center justify-center overflow-hidden border-b px-5"
              style={{ backgroundColor: "var(--chip-wash)" }}
            >
              <ConceptDiagram name={model.diagram} />
            </div>
          }
        >
          <h3 className="font-display text-xl font-semibold">{model.name}</h3>
          <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
            {model.body}
          </p>
          <div className="border-rule mt-6 border-t pt-5">
            <Label className="mb-2">Best fit</Label>
            <p className="text-ink text-sm leading-relaxed">{model.fit}</p>
          </div>
          {withCta && (
            <ButtonLink
              href={cta.primary.href}
              variant="secondary"
              className="mt-6 w-full"
            >
              {cta.primary.label}
            </ButtonLink>
          )}
        </Card>
      ))}
    </div>
  );
}
