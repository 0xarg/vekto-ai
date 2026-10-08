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
 * The top step came back down, and `wide` went out. This is an amendment and
 * it is a measurement rather than a taste: the text gutter at 1600px was 144px
 * — `max-w-[90rem]` centred, plus `3xl:px-16` — against 72px on the reference
 * the client chose, and the first screen of the homepage was a headline in the
 * left half with 43% of the viewport empty beside it.
 *
 * It is not only about air. The hero sets its headline as two phrases side by
 * side, and the size that fits is a function of the column width: at the old
 * gutter the split breaks at 88px, where the long phrase wraps to three lines
 * and the short one stays at two. At `max-w-[96rem]` with `3xl:px-8` the
 * columns are ~716px and both phrases hold at two lines at 92px. The gutter is
 * what buys the display size.
 *
 * An intermediate `xl` step for `wide` was tried and rejected, and the reason is
 * worth keeping because it looks like an improvement. Between 1280 and 1600 the
 * `wide` cap sits at `max-w-7xl`, which on a 1440px laptop gives ~580px columns
 * and a three-line phrase each side. Widening it there to 88rem gives ~644px,
 * which is enough for the SHORT phrase to drop to two lines and not the long
 * one — a 2/3 split, which reads as a mistake in a way 3/3 does not. Measured
 * at 1280/1366/1440/1512/1600/1920: the current ladder is balanced at every one
 * of them. Line count is not the thing to optimise; balance is.
 *
 * `px-5` at the small end does NOT move, and three places depend on that: the
 * nav island duplicates this ladder by hand, `CoverageMatrix` cancels it with
 * `-mx-5` to reach the viewport edge and puts it back with `pl-5`, and the nav
 * dropdown sizes itself with `calc(100vw - 2.5rem)`. Only the `3xl` step
 * changed, and the island's copy of it changed in the same commit.
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
        bleed ? "px-0" : "3xl:px-8 px-5 sm:px-8 lg:px-10",
        width === "default" && "3xl:max-w-7xl max-w-6xl",
        width === "wide" && "3xl:max-w-[96rem] max-w-7xl",
        width === "prose" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
