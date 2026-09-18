import { Section } from "./section";
import { Pending, pendingVisible } from "./pending";

/**
 * A section whose entire body is outstanding content.
 *
 * `<Pending>` returns null in production, which left several sections rendering
 * as a heading and a lede with nothing beneath them — the homepage "Evidence"
 * section, two of four on /platform, two of five on a migration pair page. An
 * empty `<h2>` promising results is worse than silence: it reads as thin
 * content to a crawler and as an unfinished page to the enterprise architect
 * this site is written for. So the whole band collapses in production, heading
 * included, and reappears in preview as the checklist it is meant to be.
 */
export function PendingSection({
  eyebrow,
  heading,
  lede,
  item,
  owner,
  due,
  note,
  tone,
  density,
  width,
  bordered,
  id,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  lede?: React.ReactNode;
  item: string;
  owner?: "Vekto" | "Anurag";
  due?: string;
  note?: string;
  tone?: "ground" | "surface" | "accent" | "legacy";
  density?: "tight" | "default" | "loose";
  width?: "default" | "wide" | "prose";
  bordered?: boolean;
  id?: string;
}) {
  if (!pendingVisible()) return null;

  return (
    <Section
      id={id}
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      tone={tone}
      density={density}
      width={width}
      bordered={bordered}
    >
      <Pending item={item} owner={owner} due={due} note={note} />
    </Section>
  );
}
