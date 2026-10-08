#!/usr/bin/env node
/**
 * Measures every foreground/background pair in the design system and checks it
 * against the floor that pair has to clear.
 *
 * globals.css annotates its colors with measured contrast ratios rather than
 * estimates, and the site runs two surface sets — the light reading surfaces
 * and the `--d-*` set, which is both the dark bands on a light page and the
 * whole page in dark mode — so a token moved on one side can quietly break the
 * other. This reads the values straight out of globals.css, so the comments in
 * that file and this report cannot drift apart.
 *
 * Three things here are structural rather than contrast checks, and they run
 * first because each one is a way for the report itself to be wrong: the
 * `:root` slice assertion, the dangling-`var()` lint, and the aura worst-pixel
 * derivation, which every glass composite depends on.
 *
 *   pnpm contrast
 *   node scripts/contrast.mjs '#4338ca' '#fcfcfc'   — one ad hoc pair
 *
 * The ad hoc form has to be run through node directly: `pnpm` does not forward
 * the arguments and will silently print the whole report instead.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function channel(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const h = hex.replace("#", "").trim();
  const n =
    h.length === 3
      ? h
          .split("")
          .map((x) => x + x)
          .join("")
      : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const hex = (r, g, b) =>
  "#" +
  [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/**
 * `rgb(255 255 255 / 0.58)` — the form the glass tokens are declared in.
 * Returns null for anything else, including the legacy comma syntax, which
 * this file does not use.
 */
function parseRgba(value) {
  const m = value
    ?.trim()
    .match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\s*\)$/);
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: +m[4] } : null;
}

/**
 * Source-over. This is the only honest way to measure a translucent surface:
 * a contrast ratio needs two opaque colors, so the glass has to be flattened
 * against something before it means anything.
 */
function composite(fg, bgHex) {
  const h = bgHex.replace("#", "");
  const [br, bg, bb] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return hex(
    fg.r * fg.a + br * (1 - fg.a),
    fg.g * fg.a + bg * (1 - fg.a),
    fg.b * fg.a + bb * (1 - fg.a),
  );
}

const [argA, argB] = process.argv.slice(2);
if (argA && argB) {
  console.log(`${ratio(argA, argB).toFixed(2)}:1`);
  process.exit(0);
}

// Hoisted: the structural checks below run before the ratio report and share
// these counters, so a dangling token and a failing pair both reach the exit
// code by the same route.
let failures = 0;
let missing = 0;

/**
 * Only the plain hex tokens declared in `:root`; the rgb()/alpha steps are
 * composites, and every declaration in the theme/band block further down is an
 * alias onto one of these.
 *
 * Reading the whole file would be wrong, not merely noisy: that block reassigns
 * light token names to dark values, so a flat scan ends up measuring a light
 * foreground against a dark background and reporting a failure that does not
 * exist. Both surface sets are declared in `:root` — the dark one as `--d-*` —
 * so one block holds everything worth measuring.
 *
 * The parse is positional: find `:root {`, stop at the first `\n}`. That is
 * fragile in one specific way, so it is asserted below rather than trusted —
 * and it is the reason a block must never be nested inside `:root`. A nested
 * `@media` or `@supports` would put a `\n}` inside the window and silently
 * truncate the scan, and a silent truncation here means every row after it
 * reports on a token the script never read.
 */
function readTokens() {
  const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
  const start = css.indexOf(":root {");
  if (start < 0) {
    console.log("FAIL  no `:root {` block found in globals.css");
    process.exit(1);
  }
  const rootBlock = css.slice(start);
  const scoped = rootBlock.indexOf("\n}");
  const window = rootBlock.slice(0, scoped);
  const raw = {};
  // Whitespace inside `var(...)` is tolerated because prettier will wrap a
  // declaration that runs long, and the scan must not depend on formatting:
  // one reflowed line used to take eight tokens out of the report.
  for (const [, name, value] of window.matchAll(
    /^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|rgb\([^;]*?\)|var\(\s*--[a-z0-9-]+\s*\))\s*;/gm,
  )) {
    raw[name] = value.replace(/\s+/g, " ");
  }

  // The window is the whole report's foundation, so prove it is the right one.
  // Without this a shifted slice reads as a clean run on a palette it never
  // looked at.
  const sane =
    raw["ground"] && raw["d-ground"] && Object.keys(raw).length >= 80;
  if (!sane) {
    console.log(
      `FAIL  the :root slice looks wrong — ${Object.keys(raw).length} tokens, ` +
        `--ground ${raw["ground"] ? "found" : "MISSING"}, ` +
        `--d-ground ${raw["d-ground"] ? "found" : "MISSING"}.\n` +
        `      Did a block get nested inside :root? See readTokens().`,
    );
    process.exit(1);
  }

  // A token may reference another rather than repeat its hex — `--focus` is
  // `var(--accent)`, and the syntax classes point at the two poles. That
  // indirection is the point: duplicated hexes silently survived a re-theme
  // once already. Resolve it here so the report measures real values.
  const tokens = {};
  const alpha = {};
  for (const name of Object.keys(raw)) {
    let v = raw[name];
    for (let hops = 0; v?.startsWith("var(") && hops < 8; hops++) {
      v = raw[v.match(/var\(\s*--([a-z0-9-]+)\s*\)/)?.[1]];
    }
    if (v?.startsWith("#")) tokens[name] = v;
    else {
      const rgba = parseRgba(v);
      if (rgba) alpha[name] = rgba;
    }
  }
  return { tokens, alpha, css };
}

const { tokens: t, alpha, css } = readTokens();

/*
 * Dangling `var()` references.
 *
 * Not a contrast check — a structural one, and it runs first because a
 * reference to a token that does not exist is invalid at computed-value time
 * and inherits instead, which looks like a working page.
 *
 * This exists because of a real bug: the band block carried
 * `--aura-floor: var(--aura-cta-floor)` for several commits, and
 * `--aura-cta-floor` was declared nowhere in the repo. It survived because the
 * scan above reads only `:root` and structurally could not see it.
 *
 * The allowlist is for tokens that are genuinely declared elsewhere: by
 * next/font on the <html> element, by the typography plugin, by an inline
 * style a component sets, or by `@theme` itself.
 */
const EXTERNAL_TOKENS = [
  /^font-inter$/, // next/font, set on <html>
  /^tw-/, // @tailwindcss/typography
  /^chip-(wash|ink)$/, // set inline by the `tints` map in card.tsx
  // Scroll-driven motion rates, set inline by artifact-canvas.tsx,
  // code-transform.tsx and agent-rail.tsx. The lint does not respect a
  // `var()` fallback, so a defaulted reference still has to be named here.
  /^(drift|mark-w|rail-progress)$/,
  /^color-/, // generated by @theme inline
  /^(tab-size|spacing|container|text|font|leading|tracking|radius|shadow|inset-shadow|drop-shadow|blur|perspective|aspect|ease|animate|breakpoint|default)-/,
];
{
  // Comments are stripped first. The note next to the deleted
  // `--aura-cta-floor` line quotes it on purpose, so that nobody reintroduces
  // it from memory, and a quotation is not a reference.
  const live = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const declared = new Set(
    [...live.matchAll(/^\s*--([a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
  );
  const dangling = new Set();
  for (const [, name] of live.matchAll(/var\(\s*--([a-z0-9-]+)/g)) {
    if (declared.has(name)) continue;
    if (EXTERNAL_TOKENS.some((re) => re.test(name))) continue;
    dangling.add(name);
  }
  if (dangling.size) {
    console.log("Dangling var() references — declared nowhere in globals.css");
    for (const name of [...dangling].sort()) {
      console.log(`  FAIL --${name}`);
    }
    failures += dangling.size;
  }
}

/**
 * floor 4.5 — body text and any value a reader has to read (WCAG AA).
 * floor 3.0 — a control's own boundary against the surface behind it (1.4.11).
 * floor 1.2 — a hairline, which only has to be seen, not read. The system aims
 *             these at ~1.25 so a rule reads equally quietly on either set.
 */
const checks = [
  [
    "Light surfaces — text",
    [
      ["ink / ground", "ink", "ground", 4.5],
      ["ink-muted / ground", "ink-muted", "ground", 4.5],
      ["ink-faint / ground", "ink-faint", "ground", 4.5],
      ["ink-faint / surface", "ink-faint", "surface", 4.5],
      ["ink-faint / surface-2", "ink-faint", "surface-2", 4.5],
    ],
  ],
  /*
   * The primary control carries a gradient, which cannot be checked as one
   * colour. It is checked at the stop that is worst for the text on it, the
   * same way the two auras are: white ink, so the worst pixel is the lightest,
   * and that is `--accent-fill-peak`. The `-hover` pair is measured too, because
   * a hover state nobody checked is how a gradient quietly drifts out of AA.
   *
   * The dark set runs the opposite way — near-black ink, so its worst stop is
   * the darkest, which is `--d-accent-fill` and is already measured in the dark
   * group below. Its peak is lighter and can only improve the ratio, so it
   * needs no row of its own.
   */
  [
    "Light surfaces — accent and controls",
    [
      ["accent / ground", "accent", "ground", 4.5],
      ["accent / surface", "accent", "surface", 4.5],
      ["accent / surface-2", "accent", "surface-2", 4.5],
      ["accent-ink / accent-fill (button)", "accent-ink", "accent-fill", 4.5],
      [
        "accent-ink / accent-fill-peak  (gradient worst pixel)",
        "accent-ink",
        "accent-fill-peak",
        4.5,
      ],
      [
        "accent-ink / peak-hover  (gradient, hover)",
        "accent-ink",
        "accent-fill-peak-hover",
        4.5,
      ],
      ["accent-fill / ground (button edge)", "accent-fill", "ground", 3.0],
      [
        "accent-fill-peak / ground  (button edge)",
        "accent-fill-peak",
        "ground",
        3.0,
      ],
      ["legacy / ground", "legacy", "ground", 4.5],
      ["legacy / surface", "legacy", "surface", 4.5],
      ["legacy / surface-2", "legacy", "surface-2", 4.5],
    ],
  ],
  [
    "Light surfaces — hairlines",
    [
      ["focus / ground (focus ring)", "focus", "ground", 3.0],
      ["rule / ground", "rule", "ground", 1.2],
      ["rule-strong / ground", "rule-strong", "ground", 1.2],
    ],
  ],
  [
    "Dark surfaces — text",
    [
      ["d-ink / d-ground", "d-ink", "d-ground", 4.5],
      ["d-ink-muted / d-ground", "d-ink-muted", "d-ground", 4.5],
      ["d-ink-faint / d-ground", "d-ink-faint", "d-ground", 4.5],
      ["d-ink-faint / d-surface", "d-ink-faint", "d-surface", 4.5],
      ["d-ink-faint / d-surface-2", "d-ink-faint", "d-surface-2", 4.5],
    ],
  ],
  [
    "Dark surfaces — accent and controls",
    [
      ["d-accent / d-ground", "d-accent", "d-ground", 4.5],
      ["d-accent / d-surface", "d-accent", "d-surface", 4.5],
      [
        "d-accent-ink / d-accent  (primary button)",
        "d-accent-ink",
        "d-accent",
        4.5,
      ],
      ["d-accent / d-ground  (button boundary)", "d-accent", "d-ground", 3.0],
      ["d-accent / d-ground  (focus ring)", "d-accent", "d-ground", 3.0],
    ],
  ],
  [
    "Dark surfaces — the two semantic poles",
    [
      ["d-accent / d-ground  (target)", "d-accent", "d-ground", 4.5],
      ["d-legacy / d-ground  (source)", "d-legacy", "d-ground", 4.5],
      ["d-positive / d-ground", "d-positive", "d-ground", 4.5],
      ["d-warn / d-ground", "d-warn", "d-ground", 4.5],
    ],
  ],
  [
    "Dark surfaces — hairlines",
    [
      ["d-rule / d-ground", "d-rule", "d-ground", 1.2],
      ["d-rule / d-surface", "d-rule", "d-surface", 1.1],
      ["d-rule-strong / d-ground", "d-rule-strong", "d-ground", 1.2],
    ],
  ],
  /*
   * The decorative tints. A base tint is a fill and cannot carry text — the
   * lightest measures 2.07:1 on the ground — so each hue has an `-ink` step,
   * and the pair that actually breaks is ink on its own wash: make a wash more
   * saturated to get more colour and that is the ratio that goes first.
   */
  [
    "Tints — ink on the ground",
    [
      ["rose-ink / ground", "tint-rose-ink", "ground", 4.5],
      ["teal-ink / ground", "tint-teal-ink", "ground", 4.5],
      ["sage-ink / ground", "tint-sage-ink", "ground", 4.5],
      ["amber-ink / ground", "tint-amber-ink", "ground", 4.5],
      ["violet-ink / ground", "tint-violet-ink", "ground", 4.5],
    ],
  ],
  [
    "Tints — ink on its own wash",
    [
      ["rose-ink / rose-wash", "tint-rose-ink", "tint-rose-wash", 4.5],
      ["teal-ink / teal-wash", "tint-teal-ink", "tint-teal-wash", 4.5],
      ["sage-ink / sage-wash", "tint-sage-ink", "tint-sage-wash", 4.5],
      ["amber-ink / amber-wash", "tint-amber-ink", "tint-amber-wash", 4.5],
      ["violet-ink / violet-wash", "tint-violet-ink", "tint-violet-wash", 4.5],
    ],
  ],
  [
    "Tints — ink on white, for a tinted cell on a card",
    [
      ["rose-ink / surface", "tint-rose-ink", "surface", 4.5],
      ["teal-ink / surface", "tint-teal-ink", "surface", 4.5],
      ["sage-ink / surface", "tint-sage-ink", "surface", 4.5],
      ["amber-ink / surface", "tint-amber-ink", "surface", 4.5],
      ["violet-ink / surface", "tint-violet-ink", "surface", 4.5],
    ],
  ],
  [
    "Tints — body copy still readable on every wash",
    [
      ["ink-muted / rose-wash", "ink-muted", "tint-rose-wash", 4.5],
      ["ink-muted / teal-wash", "ink-muted", "tint-teal-wash", 4.5],
      ["ink-muted / sage-wash", "ink-muted", "tint-sage-wash", 4.5],
      ["ink-muted / amber-wash", "ink-muted", "tint-amber-wash", 4.5],
      ["ink-muted / violet-wash", "ink-muted", "tint-violet-wash", 4.5],
      // `ink-faint`, not just `ink-muted`: evidence.tsx puts a
      // `text-ink-faint` figure label directly on a wash. This row was absent
      // and the five land within 0.02 of each other, which is the tell that
      // the washes were luminance-matched for exactly this pair.
      ["ink-faint / rose-wash", "ink-faint", "tint-rose-wash", 4.5],
      ["ink-faint / teal-wash", "ink-faint", "tint-teal-wash", 4.5],
      ["ink-faint / sage-wash", "ink-faint", "tint-sage-wash", 4.5],
      ["ink-faint / amber-wash", "ink-faint", "tint-amber-wash", 4.5],
      ["ink-faint / violet-wash", "ink-faint", "tint-violet-wash", 4.5],
    ],
  ],
  [
    "Code panel — syntax on --d-surface",
    [
      ["d-syntax-tag / d-surface", "d-syntax-tag", "d-surface", 4.5],
      ["d-syntax-attr / d-surface", "d-syntax-attr", "d-surface", 4.5],
      ["d-syntax-value / d-surface", "d-syntax-value", "d-surface", 4.5],
      ["d-syntax-punct / d-surface", "d-syntax-punct", "d-surface", 4.5],
    ],
  ],
  /*
   * Glass.
   *
   * These measure the `-solid` companions, which hold what each translucent
   * surface composites to over the darkest point of its aura. The derivation
   * check below proves those companions are real; these then treat them as
   * ordinary opaque backgrounds.
   *
   * `ink-faint` on the plain 58% step is the one pair that fails. It is not
   * listed here, because a row in an ok/FAIL column reads as a verdict on the
   * palette rather than on a usage — it is reported on its own line below,
   * next to the rule it is the reason for.
   */
  [
    "Glass — light, over the hero aura floor",
    [
      ["ink / glass-solid", "ink", "glass-solid", 4.5],
      ["ink-muted / glass-solid", "ink-muted", "glass-solid", 4.5],
      ["ink / glass-strong-solid", "ink", "glass-strong-solid", 4.5],
      [
        "ink-muted / glass-strong-solid",
        "ink-muted",
        "glass-strong-solid",
        4.5,
      ],
      [
        "ink-faint / glass-strong-solid",
        "ink-faint",
        "glass-strong-solid",
        4.5,
      ],
      ["accent / glass-strong-solid", "accent", "glass-strong-solid", 4.5],
      ["grad-end / ground  (gradient fallback)", "grad-end", "ground", 4.5],
      ["grad-end / surface-2", "grad-end", "surface-2", 4.5],
    ],
  ],
  [
    "Glass — dark, over the CTA aura peak",
    [
      ["d-ink / glass-dark-solid", "d-ink", "glass-dark-solid", 4.5],
      [
        "d-ink-muted / glass-dark-solid",
        "d-ink-muted",
        "glass-dark-solid",
        4.5,
      ],
      [
        "d-ink-faint / glass-dark-solid",
        "d-ink-faint",
        "glass-dark-solid",
        4.5,
      ],
      ["d-accent / glass-dark-solid", "d-accent", "glass-dark-solid", 4.5],
      ["d-legacy / glass-dark-solid", "d-legacy", "glass-dark-solid", 4.5],
    ],
  ],
  /*
   * Copy that sits on an aura directly rather than on glass. The CTA band's
   * heading and lede do, so "a gradient never sits behind text" is enforced
   * here rather than left to the comment in globals.css that asserts it.
   *
   * Each aura is measured at its own worst end: the hero at its darkest pixel,
   * because the text on it is dark, and the CTA at its brightest, because the
   * text on it is light.
   *
   * Only `--ink` is checked on `aura-floor`, and that is the whole rule: it is
   * the only ink allowed on it. The two lighter ones are reported below rather
   * than checked, because the palette is not wrong — a usage would be.
   */
  [
    "Auras — copy sitting on the gradient itself",
    [
      ["ink / aura-floor", "ink", "aura-floor", 4.5],
      ["d-ink / aura-cta-peak", "d-ink", "aura-cta-peak", 4.5],
      ["d-ink-muted / aura-cta-peak", "d-ink-muted", "aura-cta-peak", 4.5],
      [
        "d-accent / aura-cta-peak  (button edge)",
        "d-accent",
        "aura-cta-peak",
        3.0,
      ],
    ],
  ],
  /*
   * The blueprint grid. Its lines are `--rule` on whatever it sits over, so
   * wherever a line passes under a glyph the local background is `--rule`
   * rather than `--ground`. The grid is only ever allowed behind panels and
   * compositions, never under running copy — but the rule it is drawn in is
   * cheap to measure and an unmeasured background is how the aura hole above
   * survived, so it is measured.
   */
  [
    "Blueprint grid — ink over a grid line",
    [
      ["ink / rule", "ink", "rule", 4.5],
      ["ink-muted / rule", "ink-muted", "rule", 4.5],
      /* `--ink-faint` is deliberately absent: it measures 3.81:1 on a grid
         line and fails. That is the constraint on where `.blueprint` may go —
         it is why the grid is not behind the hero's spec readouts, whose
         labels are faint ink, and the reason that band keeps its empty right
         column instead. Same shape as the faint-ink-on-glass rule. */
      ["d-ink / d-rule", "d-ink", "d-rule", 4.5],
      ["d-ink-muted / d-rule", "d-ink-muted", "d-rule", 4.5],
    ],
  ],
  [
    "Band separation",
    [
      ["d-ground / ground  (dark band to light)", "d-ground", "ground", 3.0],
      ["surface-2 / ground  (light band to light)", "surface-2", "ground", 1.0],
      [
        "d-surface-2 / d-ground  (dark band to dark)",
        "d-surface-2",
        "d-ground",
        1.0,
      ],
    ],
  ],
  [
    "Dark tints — ink on the dark ground",
    [
      ["rose-ink / d-ground", "d-tint-rose-ink", "d-ground", 4.5],
      ["teal-ink / d-ground", "d-tint-teal-ink", "d-ground", 4.5],
      ["sage-ink / d-ground", "d-tint-sage-ink", "d-ground", 4.5],
      ["amber-ink / d-ground", "d-tint-amber-ink", "d-ground", 4.5],
      ["violet-ink / d-ground", "d-tint-violet-ink", "d-ground", 4.5],
    ],
  ],
  [
    "Dark tints — ink on its own dark wash",
    [
      ["rose-ink / rose-wash", "d-tint-rose-ink", "d-tint-rose-wash", 4.5],
      ["teal-ink / teal-wash", "d-tint-teal-ink", "d-tint-teal-wash", 4.5],
      ["sage-ink / sage-wash", "d-tint-sage-ink", "d-tint-sage-wash", 4.5],
      ["amber-ink / amber-wash", "d-tint-amber-ink", "d-tint-amber-wash", 4.5],
      [
        "violet-ink / violet-wash",
        "d-tint-violet-ink",
        "d-tint-violet-wash",
        4.5,
      ],
    ],
  ],
  [
    "Dark tints — ink on --d-surface, for a tinted cell on a dark card",
    [
      ["rose-ink / d-surface", "d-tint-rose-ink", "d-surface", 4.5],
      ["teal-ink / d-surface", "d-tint-teal-ink", "d-surface", 4.5],
      ["sage-ink / d-surface", "d-tint-sage-ink", "d-surface", 4.5],
      ["amber-ink / d-surface", "d-tint-amber-ink", "d-surface", 4.5],
      ["violet-ink / d-surface", "d-tint-violet-ink", "d-surface", 4.5],
    ],
  ],
  [
    "Dark tints — body copy still readable on every dark wash",
    [
      ["d-ink-muted / rose-wash", "d-ink-muted", "d-tint-rose-wash", 4.5],
      ["d-ink-muted / teal-wash", "d-ink-muted", "d-tint-teal-wash", 4.5],
      ["d-ink-muted / sage-wash", "d-ink-muted", "d-tint-sage-wash", 4.5],
      ["d-ink-muted / amber-wash", "d-ink-muted", "d-tint-amber-wash", 4.5],
      ["d-ink-muted / violet-wash", "d-ink-muted", "d-tint-violet-wash", 4.5],
      ["d-ink-faint / rose-wash", "d-ink-faint", "d-tint-rose-wash", 4.5],
      ["d-ink-faint / teal-wash", "d-ink-faint", "d-tint-teal-wash", 4.5],
      ["d-ink-faint / sage-wash", "d-ink-faint", "d-tint-sage-wash", 4.5],
      ["d-ink-faint / amber-wash", "d-ink-faint", "d-tint-amber-wash", 4.5],
      ["d-ink-faint / violet-wash", "d-ink-faint", "d-tint-violet-wash", 4.5],
    ],
  ],
  [
    "Dark band tones — a tinted band as the whole surface",
    [
      ["d-ink / d-accent-wash", "d-ink", "d-accent-wash", 4.5],
      ["d-ink-muted / d-accent-wash", "d-ink-muted", "d-accent-wash", 4.5],
      ["d-ink-faint / d-accent-wash", "d-ink-faint", "d-accent-wash", 4.5],
      ["d-accent / d-accent-wash", "d-accent", "d-accent-wash", 4.5],
      ["d-ink / d-legacy-wash", "d-ink", "d-legacy-wash", 4.5],
      ["d-ink-muted / d-legacy-wash", "d-ink-muted", "d-legacy-wash", 4.5],
      ["d-ink-faint / d-legacy-wash", "d-ink-faint", "d-legacy-wash", 4.5],
    ],
  ],
];

for (const [group, rows] of checks) {
  console.log(`\n${group}`);
  for (const [name, fg, bg, floor] of rows) {
    if (!t[fg] || !t[bg]) {
      missing++;
      console.log(`  ??   ${name.padEnd(42)} missing token`);
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= floor;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${name.padEnd(42)} ${r.toFixed(2).padStart(6)}:1   floor ${floor}`,
    );
  }
}

/*
 * The two poles carry equal meaning — source and target — so neither may
 * outweigh the other, and they are luminance-matched for that reason.
 *
 * The target pole is chromatic and the source pole a near-neutral stone, so
 * matched luminance does not mean matched presence. The indigo reads louder
 * whatever the numbers say, which is correct — it is the brand. The gap check
 * stays because it still catches a pole drifting far enough to vanish, but the
 * real guard on this palette is the second check.
 *
 * That one matters because the body and caption inks are cool slate now and the
 * source pole is warm stone: a pole sitting too close to --ink-faint stops
 * reading as a pole and starts reading as muted text. The separation there is
 * by hue entirely — these two are within 1.01:1 — and a contrast ratio cannot
 * see hue, so this reports the number and says plainly that the rest is a
 * visual check.
 */
/*
 * The glass companions, derived rather than trusted.
 *
 * `--glass-solid` is a plain hex sitting in the token block, and a plain hex is
 * exactly the kind of value that survives a re-theme while everything around it
 * changes — the same failure the `var()` indirection note above exists to stop.
 * The difference here is that this one cannot be written as a `var()`, because
 * it is the result of compositing two other tokens.
 *
 * So it is checked instead: flatten the translucent token over the aura floor
 * it is legal on and confirm the answer is what the block claims. Move an aura
 * stop or a glass alpha and this fails before any contrast pair does, which is
 * the right order — every ratio above depends on these three being honest.
 */
/*
 * The auras' worst pixels, derived rather than remembered.
 *
 * `--aura-floor` and `--aura-cta-peak` were hand-measured constants with a
 * comment saying so, and nothing in the toolchain re-derived them — so moving a
 * gradient stop silently invalidated every glass composite and every row that
 * sits on an aura. They are now computed here from the same stop values the
 * stylesheet uses.
 *
 * The model is CSS's: for each layer, the normalized elliptical distance of a
 * pixel from the layer's centre, where 1.0 is the ellipse edge; the ramp runs
 * from the colour at 0% to transparent at the declared stop, interpolated in
 * premultiplied alpha, which is why the RGB stays constant and only the alpha
 * falls off; then source-over, bottom layer first, over the base colour. The
 * first listed background-image is on top, so the list is composited in
 * reverse.
 *
 * Why several aspect ratios: the worst pixel is a function of how much the
 * layers overlap, and overlap is geometry. One ratio is not a measurement.
 *
 * The geometries are duplicated from globals.css, which is a real duplication
 * and the reason each entry names the rule it mirrors. Parsing the gradients
 * out of the stylesheet would couple this to the exact formatting of a
 * `radial-gradient()` and buy very little: a stop change that is not mirrored
 * here fails loudly below, because the derived value stops matching the
 * declared token.
 */
const AURA_STOPS = {
  // :root --aura-dark-1..3 — shared by .aura-cta, .aura-quote and the dark hero
  dark: [
    { color: [67, 56, 202], a: 0.46 },
    { color: [124, 58, 237], a: 0.3 },
    { color: [8, 145, 178], a: 0.26 },
  ],
  // .aura-hero's own stops, on light
  light: [
    { color: [79, 70, 229], a: 0.46 },
    { color: [6, 182, 212], a: 0.44 },
    { color: [168, 85, 247], a: 0.39 },
  ],
};

const AURA_GEOM = {
  // .aura-hero
  hero: [
    { rx: 0.62, ry: 0.58, cx: 0.12, cy: 0.16, stop: 0.7 },
    { rx: 0.56, ry: 0.52, cx: 0.9, cy: 0.1, stop: 0.7 },
    { rx: 0.68, ry: 0.62, cx: 0.66, cy: 1.0, stop: 0.72 },
  ],
  // .aura-cta
  cta: [
    { rx: 0.75, ry: 1.2, cx: 0.1, cy: 0.0, stop: 0.6 },
    { rx: 0.6, ry: 1.0, cx: 0.96, cy: 1.08, stop: 0.62 },
    { rx: 0.7, ry: 0.9, cx: 0.7, cy: 0.2, stop: 0.64 },
  ],
  // .aura-quote — the same stops as .aura-cta, different ellipses
  quote: [
    { rx: 0.55, ry: 1.3, cx: 0.82, cy: 0.08, stop: 0.6 },
    { rx: 0.5, ry: 1.2, cx: 0.12, cy: 0.96, stop: 0.62 },
    { rx: 0.6, ry: 1.0, cx: 0.4, cy: 0.3, stop: 0.64 },
  ],
};

/** The darkest and brightest pixel of a gradient stack at one box size. */
function auraExtremes(baseHex, geom, stops, W, H, N = 240) {
  const b = baseHex.replace("#", "");
  const base = [0, 2, 4].map((i) => parseInt(b.slice(i, i + 2), 16));
  const layers = geom.map((g, i) => ({ ...g, ...stops[i] }));
  let lo = null;
  let hi = null;
  for (let iy = 0; iy < N; iy++) {
    const py = ((iy + 0.5) / N) * H;
    for (let ix = 0; ix < N; ix++) {
      const px = ((ix + 0.5) / N) * W;
      let [r, g, bl] = base;
      for (let k = layers.length - 1; k >= 0; k--) {
        const L = layers[k];
        const d = Math.hypot(
          (px - L.cx * W) / (L.rx * W),
          (py - L.cy * H) / (L.ry * H),
        );
        if (d >= L.stop) continue;
        const a = L.a * (1 - d / L.stop);
        r = L.color[0] * a + r * (1 - a);
        g = L.color[1] * a + g * (1 - a);
        bl = L.color[2] * a + bl * (1 - a);
      }
      const Y = luminance(hex(r, g, bl));
      if (lo === null || Y < lo.Y) lo = { Y, value: hex(r, g, bl) };
      if (hi === null || Y > hi.Y) hi = { Y, value: hex(r, g, bl) };
    }
  }
  return { darkest: lo.value, brightest: hi.value };
}

/** The worst pixel across several aspect ratios, in the direction that matters. */
function auraWorst(baseHex, geom, stops, sizes, which) {
  let worst = null;
  for (const [W, H] of sizes) {
    const v = auraExtremes(baseHex, geom, stops, W, H)[which];
    if (worst === null) worst = v;
    else {
      const better =
        which === "darkest"
          ? luminance(v) < luminance(worst)
          : luminance(v) > luminance(worst);
      if (better) worst = v;
    }
  }
  return worst;
}

const HERO_SIZES = [
  [560, 352],
  [480, 352],
  [640, 400],
  [360, 420],
];
const BAND_SIZES = [
  [1200, 420],
  [1100, 520],
  [700, 700],
  [380, 760],
];

/*
 * Each row: the token, the rule it comes from, and which end of the gradient is
 * the worst case for the text that sits on it.
 *
 * The two go in opposite directions on purpose. Dark text on the light hero
 * aura is worst at its DARKEST pixel; light text on the dark bands is worst at
 * their BRIGHTEST. One shared "floor" token would have been wrong in one of the
 * two places, and silently.
 *
 * `.aura-quote` and the dark hero are measured too, and are expected to land on
 * `--aura-cta-peak`. They are not given tokens of their own because they do not
 * need them — but they are checked, because that is the fact the shared peak
 * rests on, and it is a measured fact rather than a consequence of sharing
 * stops. (It holds because the peak is the third stop's own centre, at a point
 * the other two layers no longer reach. The hero's stop ends are wider —
 * 70/70/72% against 60/62/64% — and it still holds.)
 */
const auras = [
  [
    "aura-floor",
    "aura-hero (light)",
    "#eef0fd",
    "hero",
    "light",
    HERO_SIZES,
    "darkest",
  ],
  [
    "aura-cta-peak",
    "aura-cta",
    "aura-dark-base",
    "cta",
    "dark",
    BAND_SIZES,
    "brightest",
  ],
  [
    "aura-cta-peak",
    "aura-quote",
    "aura-dark-base",
    "quote",
    "dark",
    BAND_SIZES,
    "brightest",
  ],
  [
    "aura-cta-peak",
    "aura-hero (dark theme)",
    "aura-dark-base",
    "hero",
    "dark",
    HERO_SIZES,
    "brightest",
  ],
];

console.log("\nAuras — worst pixel, rendered and sampled rather than recalled");
for (const [token, rule, base, geom, stops, sizes, which] of auras) {
  const baseHex = base.startsWith("#") ? base : t[base];
  if (!baseHex || !t[token]) {
    missing++;
    console.log(`  ??   ${rule.padEnd(42)} missing token`);
    continue;
  }
  const got = auraWorst(
    baseHex,
    AURA_GEOM[geom],
    AURA_STOPS[stops],
    sizes,
    which,
  );
  // One step per channel of rounding slack, as with the glass composites.
  const off = [0, 2, 4].some(
    (i) =>
      Math.abs(
        parseInt(got.slice(i + 1, i + 3), 16) -
          parseInt(t[token].slice(i + 1, i + 3), 16),
      ) > 1,
  );
  if (off) failures++;
  console.log(
    `  ${off ? "FAIL" : "ok  "} ${`${rule} ${which}`.padEnd(42)} ${got}   declared --${token} ${t[token]}`,
  );
}

const derived = [
  ["glass-solid", "glass", "aura-floor"],
  ["glass-strong-solid", "glass-strong", "aura-floor"],
  ["glass-dark-solid", "glass-dark", "aura-cta-peak"],
];

console.log(
  "\nGlass composites — derived from the alpha and the aura's worst pixel",
);
for (const [solid, translucent, floor] of derived) {
  if (!alpha[translucent] || !t[floor] || !t[solid]) {
    missing++;
    console.log(`  ??   ${solid.padEnd(42)} missing token`);
    continue;
  }
  const want = composite(alpha[translucent], t[floor]);
  // One step per channel of rounding slack, nothing more.
  const off = [0, 2, 4].some(
    (i) =>
      Math.abs(
        parseInt(want.slice(i + 1, i + 3), 16) -
          parseInt(t[solid].slice(i + 1, i + 3), 16),
      ) > 1,
  );
  if (off) failures++;
  console.log(
    `  ${off ? "FAIL" : "ok  "} ${`${translucent} over ${floor}`.padEnd(42)} ${want}   declared ${t[solid]}`,
  );
}

/*
 * The gradient headline.
 *
 * `.text-gradient` paints type with a linear ramp, against the rule that a
 * gradient never sits behind text. The exception is allowed because it is
 * measured rather than asserted: both endpoints are tokens, and every point
 * between them is sampled here. Checking only the two ends would not be enough
 * — an interpolation between two passing colours can dip below either of them
 * in the middle, since luminance is not linear in sRGB.
 */
function rampMin(from, to, bg, steps = 20) {
  const read = (hex, i) => parseInt(hex.slice(i + 1, i + 3), 16);
  let min = Infinity;
  let at = 0;
  for (let n = 0; n <= steps; n++) {
    const t = n / steps;
    const mixed = hex(
      ...[0, 2, 4].map((i) => {
        const a = read(from, i);
        const b = read(to, i);
        return a + (b - a) * t;
      }),
    );
    const r = ratio(mixed, bg);
    if (r < min) {
      min = r;
      at = t;
    }
  }
  return { min, at };
}

// One ramp per surface set. The dark one exists because `.text-gradient` is
// `--accent` to `--grad-end`, and the theme block reassigns both.
const ramps = [
  ["accent", "grad-end", ["ground", "surface-2"]],
  ["d-accent", "d-grad-end", ["d-ground", "d-surface-2"]],
];

console.log("\nGradient headline — sampled along the ramp, not just its ends");
for (const [from, to, grounds] of ramps) {
  for (const bg of grounds) {
    if (!t[from] || !t[to] || !t[bg]) {
      missing++;
      console.log(`  ??   ${from} -> ${to} / ${bg.padEnd(24)} missing token`);
      continue;
    }
    const { min, at } = rampMin(t[from], t[to], t[bg]);
    const ok = min >= 4.5;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FAIL"} ${`${from} -> ${to} / ${bg}`.padEnd(42)} ${min
        .toFixed(2)
        .padStart(6)}:1   floor 4.5  (worst at t=${at.toFixed(2)})`,
    );
  }
}

/*
 * The constraint the glass block in globals.css is written around. Not a check:
 * the palette is not wrong, the usage would be. Reported so the number and the
 * rule stay in the same place.
 */
const faintOnGlass = ratio(t["ink-faint"], t["glass-solid"]);
console.log(
  `\nink-faint on plain glass:              ${faintOnGlass.toFixed(2)}:1 - below 4.5, so faint ink goes on --glass-strong only`,
);

/*
 * The same shape, for the light aura. `--ink` clears it comfortably and is the
 * only ink that does — which is the enforceable half of "an aura never sits
 * behind copy that has to be read", and the reason the band below is printed
 * rather than checked.
 *
 * This exists because of a real bug. `PageHeader` was given `.aura-hero` at
 * `inset-0` across the whole band on seventeen routes, with the breadcrumbs,
 * the eyebrow and the lede sitting on it, under a comment asserting that
 * nothing readable did. Nothing measured it, because the aura machinery checks
 * a hand-written list of four rules and this was a fifth usage of one of them.
 * The aura was moved off the copy; these two numbers are what it was doing
 * there, kept so the next person to reach for a full-bleed aura behind a header
 * finds them first.
 */
const mutedOnAura = ratio(t["ink-muted"], t["aura-floor"]);
const faintOnAura = ratio(t["ink-faint"], t["aura-floor"]);
console.log(
  `ink-muted / ink-faint on the light aura: ${mutedOnAura.toFixed(2)}:1 / ${faintOnAura.toFixed(2)}:1 - both below 4.5, so --ink is the only ink an aura carries`,
);
const faintOnRule = ratio(t["ink-faint"], t["rule"]);
console.log(
  `ink-faint over a blueprint grid line:   ${faintOnRule.toFixed(2)}:1 - below 4.5, so .blueprint stays clear of faint-ink labels`,
);

const poleGap = Math.abs(
  ratio(t["d-accent"], t["d-ground"]) - ratio(t["d-legacy"], t["d-ground"]),
);
console.log(
  `\nSemantic poles weight-matched on dark: ${poleGap.toFixed(2)} apart ${
    poleGap <= 0.6 ? "ok" : "FAIL - one pole shouts over the other"
  }`,
);
if (poleGap > 0.6) failures++;

const poleVsFaint = ratio(t["legacy"], t["ink-faint"]);
console.log(
  `Source pole vs --ink-faint:            ${poleVsFaint.toFixed(2)}:1 - hue-separated, confirm visually`,
);

/*
 * The same rule relaxes on the dark set: `--d-ink-faint` over the dark glass
 * composite clears 4.5, where the light pair does not. Reported rather than
 * acted on — the rule in globals.css stays as written, because a rule that
 * holds on one surface set and not the other is a rule nobody will remember
 * correctly.
 */
console.log(
  `d-ink-faint on dark glass:             ${ratio(
    t["d-ink-faint"],
    t["glass-dark-solid"],
  ).toFixed(2)}:1 - clears 4.5, but the single rule stands`,
);

/*
 * The nav island is `.glass-strong`, and on a dark page its backdrop is
 * whatever scrolls under it. The brightest thing that can is the primary
 * control's gradient peak, so that is the worst case for the nav labels.
 */
if (alpha["glass-dark"] && t["d-accent-fill-peak"]) {
  const underIsland = composite(alpha["glass-dark"], t["d-accent-fill-peak"]);
  console.log(
    `Nav labels over the brightest backdrop: ${ratio(
      t["d-ink"],
      underIsland,
    ).toFixed(2)}:1 - d-ink on ${underIsland}`,
  );
}

/*
 * A decorative tint that lands on a semantic pole.
 *
 * Reported, not failed, and deliberately so. `--tint-amber-ink` is
 * byte-identical to `--warn` today, and `--d-tint-amber-ink` is within 1.02:1
 * of `--d-warn` — the tints block warns about exactly this, so the collision
 * should be visible every run, but failing the build on a condition that is
 * already true would just mean the build is always red. Fixing it means moving
 * the amber hue in both sets, which is its own decision.
 *
 * Weight alone is not the test: two colours can sit at the same luminance and
 * read as completely different hues, which is the whole basis of the two poles
 * being separated by hue rather than by ratio. So hue has to agree too.
 */
function hue(value) {
  const h = value.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  const deg =
    max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return (((deg * 60) % 360) + 360) % 360;
}

const poles = ["accent", "legacy", "positive", "warn"];
const collisions = [];
for (const set of ["", "d-"]) {
  for (const h of ["rose", "teal", "sage", "amber", "violet"]) {
    const ink = t[`${set}tint-${h}-ink`];
    if (!ink) continue;
    for (const pole of poles) {
      const pv = t[`${set}${pole}`];
      if (!pv) continue;
      const dh = Math.abs(hue(ink) - hue(pv));
      if (ratio(ink, pv) <= 1.05 && Math.min(dh, 360 - dh) <= 10) {
        collisions.push(
          `--${set}tint-${h}-ink and --${set}${pole} are the same colour ` +
            `(${ratio(ink, pv).toFixed(2)}:1, ${Math.min(dh, 360 - dh).toFixed(0)}° apart)`,
        );
      }
    }
  }
}
console.log(
  `\nDecorative tints clear of the poles:   ${
    collisions.length
      ? `${collisions.length} collision(s), known and deferred`
      : "ok"
  }`,
);
for (const c of collisions) console.log(`  !    ${c}`);

/**
 * The theme-color meta tag is the one place a token has to exist as a literal
 * hex in TypeScript: the browser reads it before any stylesheet, so it cannot
 * resolve `var(--ground)`. Duplicated values that silently survive a re-theme
 * are exactly what the indirection note above is about, so rather than trust
 * the comment next to it, check it.
 */
const seo = readFileSync(join(root, "src/lib/seo.ts"), "utf8");
for (const [constant, token] of [
  ["GROUND_HEX", "ground"],
  ["GROUND_HEX_DARK", "d-ground"],
]) {
  const found = seo.match(
    new RegExp(`${constant}\\s*=\\s*"(#[0-9a-fA-F]{3,8})"`),
  );
  if (!found) {
    console.log(`\n${constant} not found in src/lib/seo.ts`);
    failures++;
    continue;
  }
  const matches = found[1].toLowerCase() === t[token].toLowerCase();
  console.log(
    `${`${constant} vs --${token}:`.padEnd(38)} ${found[1]} ${
      matches ? "ok" : `FAIL - --${token} is ${t[token]}`
    }`,
  );
  if (!matches) failures++;
}

console.log(
  `\n${failures} below floor${missing ? `, ${missing} token(s) not found` : ""}\n`,
);
process.exit(failures || missing ? 1 : 0);
