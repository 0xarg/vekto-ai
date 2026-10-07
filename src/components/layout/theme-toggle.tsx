"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { GROUND_HEX, GROUND_HEX_DARK, THEME_STORAGE_KEY } from "@/lib/seo";

type Theme = "light" | "dark";

/**
 * `data-theme` on <html> is the single source of truth, and it lives outside
 * React: the pre-paint script in layout.tsx writes it before the first paint,
 * and this component both reads and sets it there rather than keeping a copy.
 *
 * Hence `useSyncExternalStore` rather than state plus an effect. It is the
 * primitive for exactly this shape — a value React does not own, with a server
 * snapshot that cannot know the answer — and it gives three things for free:
 * the server and the client's first render agree (both null), nothing is read
 * during render that only exists in the browser, and the toggle stays correct
 * if the attribute is ever changed by something else.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const read = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/**
 * Light / dark, as an explicit choice rather than an inherited one.
 *
 * Light is what every visitor gets. The OS preference is deliberately not
 * consulted: the sourced bands, the two semantic poles and the code specimen
 * were all designed and contrast-checked on light first, and handing an
 * unasked-for theme to a reader on OS-dark is a worse default than asking them
 * to click once.
 *
 * Both icons are always rendered and CSS decides which is visible, keyed on
 * `[data-theme]`. So the correct icon is showing at first paint — before React
 * has hydrated and before this component knows anything — with no state
 * involved and nothing able to mismatch. The subscription below exists only to
 * fill in `aria-pressed` and the label, which are the two things CSS cannot
 * say.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // null on the server and on the first client render, so the two agree.
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);

  function toggle() {
    const next: Theme = read() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode, or site data blocked. The theme still applies to this
      // page view, it just will not survive a reload. Not worth saying so.
    }

    /* `viewport.themeColor` in layout.tsx keys its two values off
       `prefers-color-scheme`, which is the OS preference and not ours — so a
       reader on OS-light who picks dark would otherwise keep a light address
       bar above a dark page. Rewriting the emitted tags is what closes that
       gap, and it has to be all of them: whichever one the OS currently
       matches is the one in use. */
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute(
        "content",
        next === "dark" ? GROUND_HEX_DARK : GROUND_HEX,
      );
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Until the store has a value there is no honest answer, and a guess
      // would be announced to a screen reader as fact.
      aria-pressed={theme === null ? undefined : theme === "dark"}
      aria-label={
        theme === "dark"
          ? "Switch to the light theme"
          : "Switch to the dark theme"
      }
      className={cn(
        "text-ink-muted hover:text-ink hover:border-rule-strong flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors",
        className,
      )}
    >
      {/* The icon names the action rather than the current state, so it agrees
          with the label: a moon on a light page means "go dark". */}
      <Moon className="h-[1.1rem] w-[1.1rem] dark:hidden" />
      <Sun className="hidden h-[1.1rem] w-[1.1rem] dark:block" />
    </button>
  );
}
