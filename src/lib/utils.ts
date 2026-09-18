import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale in globals.css registers custom `text-*` sizes, and
 * tailwind-merge cannot tell one of those from a text color — it assumed
 * `text-label` conflicted with `text-ink-faint` and silently dropped the size,
 * so every eyebrow on the site rendered without its size or letter-spacing.
 * Declaring the scale here is what makes `cn("text-label", "text-ink-faint")`
 * keep both. Add any new `--text-*` token to this list.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "lead", "label", "readout"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Absolute URL for a site-relative path. Used for canonicals, OG tags, JSON-LD. */
export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vektoai.com";
  return new URL(path, base).toString();
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
