import { cn } from "@/lib/utils";

/** Mono eyebrow used above section headings and on structural chrome. */
export function Label({
  children,
  className,
  tone = "default",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "inverse";
  as?: "div" | "span" | "p";
}) {
  return (
    <Tag
      className={cn(
        "text-label font-mono uppercase",
        tone === "inverse" ? "text-ink-inverse-faint" : "text-ink-faint",
        className,
      )}
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
 */
export function Readout({
  value,
  label,
  orientation = "inline",
  tone = "default",
  className,
}: {
  value: React.ReactNode;
  label: string;
  orientation?: "inline" | "stacked";
  tone?: "default" | "inverse";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono",
        orientation === "inline"
          ? "inline-flex items-baseline gap-1.5"
          : "flex flex-col gap-1.5",
        className,
      )}
    >
      <span
        className={cn(
          "text-readout",
          tone === "inverse" ? "text-ink-inverse" : "text-ink",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-label uppercase",
          tone === "inverse" ? "text-ink-inverse-faint" : "text-ink-faint",
        )}
      >
        {label}
      </span>
    </span>
  );
}
