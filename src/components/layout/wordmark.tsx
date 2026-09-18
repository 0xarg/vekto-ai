import { cn } from "@/lib/utils";

/**
 * Typographic wordmark, standing in until the client supplies the logo as SVG.
 * Deliberately a real design rather than a placeholder box, so preview builds
 * read as finished. Swap the internals here when the asset lands — nothing
 * else references the logo.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span className="text-ink font-serif text-[1.375rem] leading-none tracking-tight">
        Vekto
        <span className="text-accent">.</span>
      </span>
      <span className="text-label text-ink-faint font-mono uppercase">AI</span>
    </span>
  );
}
