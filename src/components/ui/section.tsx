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
  align = "left",
  decoration,
  panel = false,
  bleed = false,
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
  /**
   * `center` is for a band that makes an argument — the problem, the pipeline,
   * the evidence, the questions. It centres the header and sets the eyebrow as a
   * glass pill rather than a mono caption.
   *
   * `left` stays for the data bands. A centred header floating above a ledger or
   * a coverage matrix reads as marketing attached to a document; left-aligned,
   * the header and the table are the same object.
   */
  align?: "left" | "center";
  /**
   * An absolutely-positioned layer behind the content — an aura, a mark, a
   * bleeding graphic. Setting it makes the band a positioning context and clips
   * it, so the layer cannot escape into the band above.
   *
   * Decorative only. Nothing that has to be read goes here, because a layer
   * underneath copy cannot be contrast-checked against a moving target.
   */
  decoration?: React.ReactNode;
  /**
   * Render the band's interior as a rounded, soft-filled panel rather than
   * letting the tone run edge to edge. The tone then paints the panel instead
   * of the band, so a run of panelled sections reads as a stack of objects on
   * the ground rather than as alternating stripes.
   */
  panel?: boolean;
  /** Forwarded to `Container` — for a band that supplies its own padding. */
  bleed?: boolean;
  id?: string;
}) {
  const centered = align === "center";

  const header = (eyebrow || heading || lede) && (
    <div
      className={cn(
        centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        density === "tight" ? "mb-8" : "mb-10 sm:mb-14",
      )}
    >
      {eyebrow &&
        (centered ? (
          // The glass pill reads as an object sitting on the band, which is
          // what gives a centred header something to hang from. It takes the
          // strong step because `--ink-faint` fails on the plain one.
          <Label
            as="span"
            className="glass-strong glass-pill text-ink-muted mb-6 inline-flex items-center rounded-full px-3.5 py-1.5"
          >
            {eyebrow}
          </Label>
        ) : (
          <Label className="mb-4">{eyebrow}</Label>
        ))}
      {heading && <h2 className="text-h2">{heading}</h2>}
      {lede && (
        <p
          className={cn(
            "text-lead text-ink-muted mt-5",
            centered && "mx-auto max-w-2xl",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );

  // A panelled band pads the panel, not the section, or the two paddings stack
  // into a band half again as tall as a plain one.
  const interior = panel ? (
    <div
      className={cn(
        // `.sheen` makes the panel read as an object catching light rather than
        // as a rectangle of flat fill, which is the whole reason a panelled
        // band exists. It composites over whichever tone paints underneath.
        "sheen shadow-card rounded-xl px-5 py-12 sm:px-10 sm:py-16",
        bandTone[tone] || "bg-surface-2",
      )}
    >
      {header}
      {children}
    </div>
  ) : (
    <>
      {header}
      {children}
    </>
  );

  return (
    <section
      id={id}
      data-band
      data-tone={tone}
      className={cn(
        panel ? bandPadding.default : bandPadding[density],
        !panel && bandTone[tone],
        bordered && "border-rule border-t",
        decoration && "relative overflow-hidden",
        className,
      )}
    >
      {decoration}
      {decoration ? (
        <div className="relative">
          <Container width={width} bleed={bleed}>
            {interior}
          </Container>
        </div>
      ) : (
        <Container width={width} bleed={bleed}>
          {interior}
        </Container>
      )}
    </section>
  );
}
