import { cn } from "@/lib/utils";

/**
 * Mono eyebrow used above section headings and on structural chrome.
 *
 * No `tone` prop: `--ink-faint` is reassigned inside a dark band, so this is
 * correct on either surface without being told which one it is on.
 */
export function Label({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  return (
    <Tag
      className={cn("text-label text-ink-faint font-mono uppercase", className)}
    >
      {children}
    </Tag>
  );
}

/**
 * A real value with the thing it measures.
 *
 * The distinction from `Label` is the point of this component: a Label is a
 * caption, a Readout *is* data. So the value takes `--ink` and the caption
 * recedes — the opposite of how a decorative stat block is usually set, where
 * the number is large and colored and means nothing. Every Readout on this
 * site resolves from `src/content/*` via `src/lib/derived.ts`; if a figure
 * cannot be sourced it is a `<Pending>`, not a Readout.
 *
 * `scale` is the one concession to that rule, and it is narrow. The default
 * stays a footnote. `display` sets the same sourced value at the size of a
 * subject, and is only correct when the band exists to state that value — the
 * pipeline's stage count, an agent's position. It does not make a number into a
 * headline figure, because the number still has to resolve from the registry.
 */
export function Readout({
  value,
  label,
  orientation = "inline",
  scale = "default",
  className,
}: {
  value: React.ReactNode;
  label: string;
  orientation?: "inline" | "stacked";
  scale?: "default" | "display";
  className?: string;
}) {
  const display = scale === "display";

  return (
    <span
      className={cn(
        "font-mono",
        orientation === "inline"
          ? "inline-flex items-baseline gap-1.5"
          : "flex flex-col",
        orientation === "stacked" && (display ? "gap-2.5" : "gap-1.5"),
        className,
      )}
    >
      <span
        className={cn(
          display ? "text-numeral text-accent" : "text-readout text-ink",
        )}
      >
        {value}
      </span>
      <span className="text-label text-ink-faint uppercase">{label}</span>
    </span>
  );
}
