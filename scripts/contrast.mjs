#!/usr/bin/env node
/**
 * Measures every foreground/background pair in the design system and checks it
 * against the floor that pair has to clear.
 *
 * globals.css annotates its colors with measured contrast ratios rather than
 * estimates, and the site runs two surface sets — the light reading surfaces
 * and the `--d-*` dark structural ones — so a token moved on one side can
 * quietly break the other. This reads the values straight out of globals.css,
 * so the comments in that file and this report cannot drift apart.
 *
 *   pnpm contrast
 *   pnpm contrast '#00c9b2' '#0a0d0f'   — one ad hoc pair
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

const [argA, argB] = process.argv.slice(2);
if (argA && argB) {
  console.log(`${ratio(argA, argB).toFixed(2)}:1`);
  process.exit(0);
}

/**
 * Only the plain hex tokens declared in `:root`; the rgb()/alpha steps are
 * composites, and anything set inside `[data-tone="inverse"]` is an alias.
 *
 * Reading the whole file would be wrong, not merely noisy: the scoping block
 * reassigns light token names to dark values further down, so a flat scan ends
 * up measuring a light foreground against a dark background and reporting a
 * failure that does not exist. Both surface sets are declared in `:root` — the
 * dark one as `--d-*` — so one block holds everything worth measuring.
 */
function readTokens() {
  const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
  const rootBlock = css.slice(css.indexOf(":root {"));
  const scoped = rootBlock.indexOf("\n}");
  const raw = {};
  for (const [, name, value] of rootBlock
    .slice(0, scoped)
    .matchAll(
      /^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|var\(--[a-z0-9-]+\))\s*;/gm,
    )) {
    raw[name] = value;
  }

  // A token may reference another rather than repeat its hex — `--focus` is
  // `var(--accent)`, and the syntax classes point at the two poles. That
  // indirection is the point: duplicated hexes silently survived a re-theme
  // once already. Resolve it here so the report measures real values.
  const tokens = {};
  for (const name of Object.keys(raw)) {
    let v = raw[name];
    for (let hops = 0; v?.startsWith("var(") && hops < 8; hops++) {
      v = raw[v.slice(6, -1)];
    }
    if (v?.startsWith("#")) tokens[name] = v;
  }
  return tokens;
}

const t = readTokens();

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
  [
    "Light surfaces — accent and controls",
    [
      ["accent / ground", "accent", "ground", 4.5],
      ["accent / surface", "accent", "surface", 4.5],
      ["accent / surface-2", "accent", "surface-2", 4.5],
      ["accent-ink / accent-fill (button)", "accent-ink", "accent-fill", 4.5],
      ["accent-fill / ground (button edge)", "accent-fill", "ground", 3.0],
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
      ["clay-ink / ground", "tint-clay-ink", "ground", 4.5],
      ["blue-ink / ground", "tint-blue-ink", "ground", 4.5],
      ["sage-ink / ground", "tint-sage-ink", "ground", 4.5],
      ["amber-ink / ground", "tint-amber-ink", "ground", 4.5],
      ["violet-ink / ground", "tint-violet-ink", "ground", 4.5],
    ],
  ],
  [
    "Tints — ink on its own wash",
    [
      ["clay-ink / clay-wash", "tint-clay-ink", "tint-clay-wash", 4.5],
      ["blue-ink / blue-wash", "tint-blue-ink", "tint-blue-wash", 4.5],
      ["sage-ink / sage-wash", "tint-sage-ink", "tint-sage-wash", 4.5],
      ["amber-ink / amber-wash", "tint-amber-ink", "tint-amber-wash", 4.5],
      ["violet-ink / violet-wash", "tint-violet-ink", "tint-violet-wash", 4.5],
    ],
  ],
  [
    "Tints — ink on white, for a tinted cell on a card",
    [
      ["clay-ink / surface", "tint-clay-ink", "surface", 4.5],
      ["blue-ink / surface", "tint-blue-ink", "surface", 4.5],
      ["sage-ink / surface", "tint-sage-ink", "surface", 4.5],
      ["amber-ink / surface", "tint-amber-ink", "surface", 4.5],
      ["violet-ink / surface", "tint-violet-ink", "surface", 4.5],
    ],
  ],
  [
    "Tints — body copy still readable on every wash",
    [
      ["ink-muted / clay-wash", "ink-muted", "tint-clay-wash", 4.5],
      ["ink-muted / blue-wash", "ink-muted", "tint-blue-wash", 4.5],
      ["ink-muted / sage-wash", "ink-muted", "tint-sage-wash", 4.5],
      ["ink-muted / amber-wash", "ink-muted", "tint-amber-wash", 4.5],
      ["ink-muted / violet-wash", "ink-muted", "tint-violet-wash", 4.5],
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
];

let failures = 0;
let missing = 0;

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
 * What the clay brand changed: the target pole is chromatic now and the source
 * pole is a near-neutral stone, so matched luminance no longer means matched
 * presence. Clay reads louder whatever the numbers say, which is correct — it
 * is the brand. The gap check stays because it still catches a pole drifting
 * far enough to vanish, but the real guard on this palette is the second check.
 *
 * That one matters because the body and caption inks are warm greys: a source
 * pole sitting too close to --ink-faint stops reading as a pole and starts
 * reading as muted text. The separation there is by hue as much as luminance,
 * and a contrast ratio cannot see hue — so this reports the number and says
 * plainly that the rest is a visual check.
 */
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

console.log(
  `\n${failures} below floor${missing ? `, ${missing} token(s) not found` : ""}\n`,
);
process.exit(failures || missing ? 1 : 0);
