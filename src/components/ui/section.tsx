import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Label } from "./label";

const bandPadding = {
  tight: "py-band-tight",
  default: "py-band",
  loose: "py-band-loose",
} as const;

const bandTone = {
  ground: "",
  surface: "bg-surface-2",
  /** Tinted toward the target pole — 6% accent over the ground. */
  accent: "bg-accent-wash",
  /** Tinted toward the legacy/source pole. */
  legacy: "bg-legacy-wash",
  inverse: "bg-inverse text-ink-inverse",
} as const;

export function Section({
  eyebrow,
  heading,
  lede,
  children,
  className,
  width = "default",
  bordered = true,
  density = "default",
  tone = "ground",
  id,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "prose";
  /**
   * Hairline top border, on by default.
   *
   * An earlier version made this conditional on the adjacent band's tone, on
   * the theory that a tonal change already separated them. It does not: the
   * ground and surface steps measure 1.073:1 apart, and the tinted washes are
   * no better, so bands ran together with nothing between them. On this palette
   * the rule is the separator and the tones are variety.
   */
  bordered?: boolean;
  /**
   * How much vertical room the band takes, and therefore how much weight it
   * claims. A strip of links is not a primary argument.
   */
  density?: "tight" | "default" | "loose";
  tone?: "ground" | "surface" | "accent" | "legacy" | "inverse";
  id?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <section
      id={id}
      data-band
      data-tone={tone}
      className={cn(
        bandPadding[density],
        bandTone[tone],
        bordered && "border-t",
        bordered && (inverse ? "border-rule-inverse" : "border-rule"),
        className,
      )}
    >
      <Container width={width}>
        {(eyebrow || heading || lede) && (
          <div
            className={cn(
              "max-w-3xl",
              density === "tight" ? "mb-8" : "mb-10 sm:mb-14",
            )}
          >
            {eyebrow && (
              <Label className="mb-4" tone={inverse ? "inverse" : "default"}>
                {eyebrow}
              </Label>
            )}
            {heading && (
              <h2 className={cn("text-h2", inverse && "text-ink-inverse")}>
                {heading}
              </h2>
            )}
            {lede && (
              <p
                className={cn(
                  "text-lead mt-5",
                  inverse ? "text-ink-inverse-muted" : "text-ink-muted",
                )}
              >
                {lede}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
