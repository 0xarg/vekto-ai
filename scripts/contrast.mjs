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
 *   pnpm contrast '#4338ca' '#fbfbfd'   — one ad hoc pair
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
      /^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|rgb\([^;]*?\)|var\(--[a-z0-9-]+\))\s*;/gm,
    )) {
    raw[name] = value;
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
      v = raw[v.slice(6, -1)];
    }
    if (v?.startsWith("#")) tokens[name] = v;
    else {
      const rgba = parseRgba(v);
      if (rgba) alpha[name] = rgba;
    }
  }
  return { tokens, alpha };
}

const { tokens: t, alpha } = readTokens();

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

console.log("\nGradient headline — sampled along the ramp, not just its ends");
for (const bg of ["ground", "surface-2"]) {
  if (!t["accent"] || !t["grad-end"] || !t[bg]) {
    missing++;
    console.log(`  ??   accent -> grad-end / ${bg.padEnd(30)} missing token`);
    continue;
  }
  const { min, at } = rampMin(t["accent"], t["grad-end"], t[bg]);
  const ok = min >= 4.5;
  if (!ok) failures++;
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${`accent -> grad-end / ${bg}`.padEnd(42)} ${min
      .toFixed(2)
      .padStart(6)}:1   floor 4.5  (worst at t=${at.toFixed(2)})`,
  );
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

/**
 * The theme-color meta tag is the one place a token has to exist as a literal
 * hex in TypeScript: the browser reads it before any stylesheet, so it cannot
 * resolve `var(--ground)`. Duplicated values that silently survive a re-theme
 * are exactly what the indirection note above is about, so rather than trust
 * the comment next to it, check it.
 */
const groundHex = readFileSync(join(root, "src/lib/seo.ts"), "utf8").match(
  /GROUND_HEX\s*=\s*"(#[0-9a-fA-F]{3,8})"/,
);
if (!groundHex) {
  console.log(`\nGROUND_HEX not found in src/lib/seo.ts`);
  failures++;
} else {
  const matches = groundHex[1].toLowerCase() === t["ground"].toLowerCase();
  console.log(
    `GROUND_HEX vs --ground:                ${groundHex[1]} ${
      matches ? "ok" : `FAIL - --ground is ${t["ground"]}`
    }`,
  );
  if (!matches) failures++;
}

console.log(
  `\n${failures} below floor${missing ? `, ${missing} token(s) not found` : ""}\n`,
);
process.exit(failures || missing ? 1 : 0);
