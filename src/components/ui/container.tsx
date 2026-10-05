import { cn } from "@/lib/utils";

/**
 * The single horizontal-padding and max-width primitive. Every gutter on the
 * site derives from this one class string, which is why the ladder lives here
 * rather than being written out per section.
 *
 * Four steps, not two. The previous `px-5 sm:px-8` stopped at 640px, so a
 * 2560px display got the same 32px gutter as a tablet and the content sat in a
 * narrow column with nothing framing it. The upper two steps use the
 * `--breakpoint-3xl` token that was already declared in globals.css and never
 * used.
 *
 * `prose` deliberately does not grow. A measure is a reading constraint, not a
 * screen constraint — a 90rem line of body copy is worse on a large monitor,
 * not better.
 */
export function Container({
  className,
  children,
  width = "default",
  bleed = false,
}: {
  className?: string;
  children: React.ReactNode;
  width?: "default" | "wide" | "prose";
  /**
   * Drop the gutter entirely, for a band that runs to the viewport edge and
   * supplies its own padding — the pipeline strip.
   *
   * This exists so that band does not have to cancel the gutter with
   * `px-0! sm:px-0!`. With four padding steps that override would need four
   * `!important`s and would quietly stop matching the day a fifth is added.
   */
  bleed?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        bleed ? "px-0" : "3xl:px-16 px-5 sm:px-8 lg:px-10",
        width === "default" && "3xl:max-w-7xl max-w-6xl",
        width === "wide" && "3xl:max-w-[90rem] max-w-7xl",
        width === "prose" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
