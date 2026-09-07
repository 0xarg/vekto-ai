import { cn } from "@/lib/utils";

/** Mono eyebrow used above section headings and on structural chrome. */
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
