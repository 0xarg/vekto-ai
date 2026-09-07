import { cn } from "@/lib/utils";

/**
 * Typographic wordmark, standing in until the client supplies the logo as SVG.
 * Deliberately a real design rather than a placeholder box, so preview builds
 * read as finished. Swap the internals here when the asset lands — nothing
 * else references the logo.
 */
export function Wordmark({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-serif text-[1.375rem] leading-none tracking-tight",
          tone === "inverse" ? "text-ink-inverse" : "text-ink",
        )}
      >
        Vekto
        <span className="text-accent">.</span>
      </span>
      <span
        className={cn(
          "text-label font-mono uppercase",
          tone === "inverse" ? "text-ground/50" : "text-ink-faint",
        )}
      >
        AI
      </span>
    </span>
  );
}
