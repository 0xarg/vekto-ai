import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Label } from "./label";

const bandPadding = {
  tight: "py-band-tight",
  default: "py-band",
  loose: "py-band-loose",
} as const;

/**
 * `inverse` carries no classes of its own. The `[data-tone="inverse"]` block in
 * globals.css paints the band and reassigns every token underneath it, so the
 * heading, lede, buttons and any `.lattice` inside re-theme without being told.
 */
const bandTone = {
  ground: "",
  surface: "bg-surface-2",
  /** Tinted toward the target pole. */
  accent: "bg-accent-wash",
  /** Tinted toward the legacy/source pole. */
  legacy: "bg-legacy-wash",
  inverse: "",
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
   * Within a run of light bands the rule is still the separator: the ground and
   * surface steps measure 1.073:1 apart and cannot separate anything by
   * themselves. Across a light-to-dark change it is redundant — those bands sit
   * ~18.6:1 apart — so pass `bordered={false}` where a dark band meets a light
   * one, and where two dark bands are meant to read as a single field.
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
  return (
    <section
      id={id}
      data-band
      data-tone={tone}
      className={cn(
        bandPadding[density],
        bandTone[tone],
        bordered && "border-rule border-t",
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
            {eyebrow && <Label className="mb-4">{eyebrow}</Label>}
            {heading && <h2 className="text-h2">{heading}</h2>}
            {lede && <p className="text-lead text-ink-muted mt-5">{lede}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
