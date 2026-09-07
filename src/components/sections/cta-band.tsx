import { ArrowRight } from "lucide-react";
import { cta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand({
  heading = "Find out what your migration actually involves.",
  lede = "A migration assessment runs Discovery and Analysis against your real estate and returns the inventory, the classification and the list of decisions only your team can make.",
}: {
  heading?: string;
  lede?: string;
}) {
  return (
    <section className="bg-inverse text-ink-inverse">
      <Container width="wide">
        <div className="grid gap-8 py-20 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-h2 text-ink-inverse">{heading}</h2>
            <p className="text-lead text-ground/70 mt-5">{lede}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <ButtonLink
              href={cta.primary.href}
              size="lg"
              className="w-full lg:w-auto"
            >
              {cta.primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href={cta.secondary.href}
              size="lg"
              variant="ghost"
              className="text-ground/80 hover:text-ink-inverse w-full hover:bg-white/5 lg:w-auto"
            >
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
