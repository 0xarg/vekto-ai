import { cn } from "@/lib/utils";

/**
 * A disclosure list built on native `<details>`/`<summary>`.
 *
 * No `"use client"`, no state, no JavaScript at all. The browser handles the
 * open/close, which means it works before hydration and with scripting off —
 * and, more to the point here, the answer text is in the DOM whether the item is
 * open or not, so a crawler reads every answer. An FAQ whose content only exists
 * after a click is invisible to the thing this site was rebuilt for.
 *
 * The open/close is animated by `.disclosure` in globals.css, which uses
 * `interpolate-size` and `::details-content` to transition to an automatic
 * height without script. Browsers that do not support it snap open, exactly as
 * this behaved before — the animation is an enhancement, never a dependency.
 */
export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("border-rule divide-rule divide-y border-y", className)}>
      {items.map((item) => (
        <details key={item.question} className="disclosure group">
          <summary className="hover:text-accent flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-lg font-medium tracking-tight transition-colors duration-150 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden
              className="text-ink-faint group-open:text-accent mt-1 shrink-0 font-mono text-sm transition-[transform,color] duration-300 ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="text-ink-muted max-w-2xl pb-6 text-sm leading-relaxed">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
