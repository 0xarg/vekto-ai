import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { counts } from "@/lib/derived";

/**
 * The site-wide social card.
 *
 * `src/lib/seo.ts` has claimed in its own docstring that `buildMetadata()`
 * "guarantees a canonical, an OG image and a correctly suffixed title" since it
 * was written, and two of those three were true: there was no `images` key
 * anywhere, no image asset in `public/`, and `twitter.card` was
 * `summary_large_image` with nothing to fill it. Every share of this site was a
 * bare link.
 *
 * Drawn rather than designed in a file, for the same reason the diagrams are
 * inline SVG: an exported PNG is a hardcoded palette that cannot follow a
 * re-theme, and this palette has now moved twice. The three numerals are the
 * registry counts from `derived.ts` — the only sanctioned source for a numeral
 * rendered as design (non-negotiable #6).
 *
 * Tokens cannot be read here: this renders in a separate image runtime with no
 * stylesheet, so the five values below are the one place outside globals.css
 * and `GROUND_HEX` that the palette is repeated. They are the dark set, which
 * is what the card is drawn on.
 *
 * Known and accepted: the type is set in the runtime's fallback sans rather
 * than in Inter, so the word spacing is looser than the site's. Fixing it means
 * handing the runtime a font buffer, and the only copies of Inter here are
 * next/font's build output under `.next/static/media` with content-hashed
 * names that change every build. Fetching the face from Google at build time
 * would work and is what the no-webfont rule was written against — a card is
 * not worth reopening that.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.shortDescription}`;

const INK = "#eff0f3";
const INK_MUTED = "#a9adb9";
const INK_FAINT = "#818798";
const ACCENT = "#9088f2";
const GROUND = "#0c0d11";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        // The CTA aura's own stops, flattened to two radials — the image
        // runtime supports a subset of CSS and this is the closest honest
        // approximation of the band this card is standing in for.
        backgroundImage:
          "radial-gradient(1000px 600px at 8% 0%, rgba(67,56,202,0.46), transparent 60%), radial-gradient(800px 500px at 95% 100%, rgba(8,145,178,0.26), transparent 62%)",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Every div here carries `display: flex`, including the ones that
              hold a single string. That is a hard requirement of the image
              runtime rather than a layout choice: it throws on any div with
              more than one child node instead of guessing, and a string it
              decides to split counts as more than one. */}
        <div
          style={{
            display: "flex",
            color: INK,
            fontSize: 38,
            fontWeight: 700,
          }}
        >
          {site.name.replace(" AI", "")}
          <span style={{ color: ACCENT }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            color: INK_FAINT,
            fontSize: 19,
            letterSpacing: 2,
            paddingTop: 10,
          }}
        >
          AI
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            color: INK,
            fontSize: 68,
            fontWeight: 600,
            letterSpacing: -1.6,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Move off legacy middleware without rewriting it by hand.
        </div>
        <div
          style={{
            display: "flex",
            color: INK_MUTED,
            fontSize: 27,
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          {site.shortDescription}
        </div>
      </div>

      <div style={{ display: "flex", gap: 56 }}>
        {[
          [counts.pipelineStages, "pipeline stages"],
          [counts.sourcePlatforms, "source platforms"],
          [counts.targetPlatforms, "target platforms"],
        ].map(([value, label]) => (
          <div
            key={label}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <div
              style={{
                display: "flex",
                color: ACCENT,
                fontSize: 44,
                fontWeight: 600,
              }}
            >
              {value}
            </div>
            <div style={{ display: "flex", color: INK_FAINT, fontSize: 19 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
