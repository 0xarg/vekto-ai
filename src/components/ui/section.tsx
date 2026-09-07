import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Label } from "./label";

export function Section({
  eyebrow,
  heading,
  lede,
  children,
  className,
  width = "default",
  bordered = true,
  tone = "ground",
  id,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  width?: "default" | "wide" | "prose";
  /** Hairline top border — the main structural separator in this design. */
  bordered?: boolean;
  tone?: "ground" | "surface" | "inverse";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        bordered && "border-rule border-t",
        tone === "surface" && "bg-surface-2",
        tone === "inverse" && "bg-inverse text-ink-inverse",
        className,
      )}
    >
      <Container width={width}>
        {(eyebrow || heading || lede) && (
          <div className="mb-10 max-w-3xl sm:mb-14">
            {eyebrow && <Label className="mb-4">{eyebrow}</Label>}
            {heading && (
              <h2
                className={cn(
                  "text-h2",
                  tone === "inverse" && "text-ink-inverse",
                )}
              >
                {heading}
              </h2>
            )}
            {lede && (
              <p
                className={cn(
                  "text-lead mt-5",
                  tone === "inverse" ? "text-ground/70" : "text-ink-muted",
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
