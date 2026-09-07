import { ArrowRight } from "lucide-react";
import { cta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Server-rendered, no scroll-triggered reveal. The previous site animated its
 * hero in on `whileInView`, which left the H1 invisible on arrival and absent
 * from the HTML entirely. This renders as static markup.
 */
export function Hero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="rule-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)] opacity-[0.55]"
      />
      <Container width="wide" className="relative">
        <div className="max-w-4xl py-20 sm:py-28 lg:py-32">
          {eyebrow && <Label className="mb-6">{eyebrow}</Label>}
          <h1 className="text-display">{title}</h1>
          {lede && (
            <p className="text-lead text-ink-muted mt-7 max-w-2xl">{lede}</p>
          )}
          {children ?? (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={cta.primary.href} size="lg">
                {cta.primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href={cta.secondary.href}
                variant="secondary"
                size="lg"
              >
                {cta.secondary.label}
              </ButtonLink>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
