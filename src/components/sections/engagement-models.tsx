import { cta } from "@/lib/site";
import { Card, type Tint } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ButtonLink } from "@/components/ui/button";

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
 */
export const engagementModels: {
  name: string;
  body: string;
  fit: string;
  tint: Tint;
}[] = [
  {
    tint: "clay",
    name: "Managed migration",
    body: "Our team runs the migration end to end, with your architects reviewing at each stage gate.",
    fit: "Large estates, hard deadlines, limited internal capacity.",
  },
  {
    tint: "blue",
    name: "Self-serve platform",
    body: "Your team drives VektoForge directly, with our support available on the parts that need judgement.",
    fit: "Teams with platform expertise who want to own the migration.",
  },
  {
    tint: "sage",
    name: "Partner licensing",
    body: "Systems integrators run VektoForge inside their own delivery practice.",
    fit: "SIs and consultancies delivering migrations for their clients.",
  },
];

export function EngagementModels({ withCta = false }: { withCta?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {engagementModels.map((model, i) => (
        <Card
          key={model.name}
          tint={model.tint}
          washed={i === 1}
          className={i === 1 ? "lg:shadow-panel lg:-my-3" : ""}
        >
          <h3 className="text-xl font-semibold tracking-tight">{model.name}</h3>
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
