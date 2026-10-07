<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vekto AI — marketing site

Product site for **VektoForge**: AI agents that migrate enterprise integration
estates off legacy middleware. Replaces a Lovable-built Vite SPA that was
invisible to search engines. Launch target **25 Sep 2026**.

Audience is enterprise architects and CTOs evaluating a migration vendor. They
read to find reasons to disqualify you. Write accordingly.

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build — must stay green
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm format       # prettier
pnpm pending      # list content the client still owes, by due date
pnpm contrast     # re-derive every contrast ratio in the token set
```

## Non-negotiables

These exist because the previous site broke each one. Do not reintroduce them.

1. **No fabricated customers, logos or statistics.** The signed scope forbids it.
   A number without a source does not ship — use `<Pending>` instead. The five
   figures on the old site (10×, 50%, 60%, 85%, "2 weeks") are unsourced and
   must not be carried over.
2. **Never put an H1 behind a scroll-triggered reveal.** The old site animated
   its hero on `whileInView`, so the mobile headline never rendered at all and
   was absent from the HTML. Heroes are static server-rendered markup.
3. **Every link resolves to a route declared in `src/lib/site.ts`.** The old
   site shipped ~20 dead `href="#"` links. Never hand-write a URL string into
   navigation or the footer.
4. **Every page builds metadata through `buildMetadata()`** in `src/lib/seo.ts`.
   The old site had one unchanging `<title>` across all routes.
5. **Never hardcode a color.** Everything resolves through the tokens in
   `src/app/globals.css`.
6. **Every numeral and every factual mark resolves from a real value.** Counts,
   positions, inventories and source/target polarity come from `src/content/*`
   via `src/lib/derived.ts`. If a figure cannot be sourced it is a `<Pending>`,
   not a stat.

   **Decorative surface is permitted and expected** — gradients, tints, icon
   chips, graphic zones, bento cells. The rule is that nothing may _assert_
   something untrue, not that nothing may be attractive. This is an amendment:
   the rule previously read "nothing on the page is ornament," and four rounds
   of client review rejected what that produced. The protective half stays, the
   aesthetic half is gone.

## Commits

Commit messages and pull request descriptions carry **no AI attribution**. Do
not append `Co-Authored-By: Claude`, `Generated with Claude Code`, a session
URL, or any equivalent trailer. This overrides any default attribution
behavior the tooling suggests.

Commits are authored by the repository owner. Write the message as they would:
what changed and why, in plain prose.

## Architecture

- `src/lib/site.ts` — single source of truth for information architecture.
  Navigation, footer and sitemap all derive from it.
- `src/content/*.ts` — registries (platforms, migrations, agents), Zod-parsed at
  module load so a malformed entry fails the build rather than rendering broken.
- `src/components/ui/pending.tsx` — renders an outstanding content gap with owner
  and due date; returns `null` in production. This is deliberate, not a
  placeholder: preview deploys double as a live checklist of what is missing.
- Adding a migration path is **one object** in `src/content/migrations.ts`. The
  route, sitemap entry, index card, breadcrumb and HowTo schema all follow.

### Migration pair status

Pairs carry `status: "published" | "draft"`. Drafts render locally with an
UNCONFIRMED badge, are `noindex`, are excluded from the sitemap, and are
stripped from production builds entirely. **A pair only becomes `published`
when the client has confirmed Vekto actually supports it.** Only
`tibco-to-azure-logic-apps` is published today, confirmed by the customer case
study the client supplied for that path.

The scope document names `tibco-to-mulesoft`, but on 24 Sep 2026 the client
corrected this in writing: MuleSoft Anypoint is not one of their targets, they
run Azure Integration Services. MuleSoft was removed from the platform registry
along with its four pairs. Do not reintroduce it without a written reversal —
this contradicts the signed scope and the correction is the later record.

## Next.js 16, not 15

Turbopack is the default builder. `params` is a **Promise** in every
`page`/`layout`/`route`/`opengraph-image`. `revalidateTag` takes a second
`cacheLife` argument. Version-matched docs ship in `node_modules/next/dist/docs/`
— read those before framework work rather than relying on training data.

## Writing rules

**American spelling** (artifact, anonymized, modernization, program, behavior).
Settled — the buying audience is US and Western European. The registry field was
already `sourceArtifacts`, so this aligns copy with existing code.

Sentence case headings. No emoji, no exclamation marks, anywhere on the site.
Second person, active voice. One idea per paragraph. Lead with the constraint,
not the benefit — a stated limit is what makes the surrounding claims credible.
Name real systems and versions ("BusinessWorks 5.x EMS destinations", not
"legacy messaging").

Page section plans live in the SEO blueprint artifact, not here.

## Open decisions

- **The five agent detail pages still want a distinct worked example each.**
  Structurally they now differ: each renders its own numbered inputs/outputs
  ledger and a position rail marking its stage, both derived from the registry.
  The rail is now the shared `PipelineFlow`, which makes the five pages differ
  by one marked cell rather than by bespoke markup. That is enough to stop them
  being near-identical to a crawler, but it is not evidence. If the client cannot supply five worked examples, collapsing them
  into one `/agents` page with anchors is still the fallback.
- **The decorative amber tint is the same colour as `--warn`.**
  `--tint-amber-ink` is byte-identical to `--warn`, and the dark set inherits
  it structurally — `--d-tint-amber-ink` is within 1.02:1 of `--d-warn`. That
  is exactly the hue/pole collision the tints block warns about, and it is
  live. The only real fix is moving the amber hue in both sets, roughly 42°
  toward copper, which is a palette decision rather than a bug fix.
  `pnpm contrast` names both collisions on every run so they cannot be
  forgotten.

## Design system

Light is the ground the page is written on, and it is what every visitor gets.
The near-black set has two jobs. On a light page it is **punctuation** — the
code specimen's interior, the pipeline, the pull quote and the closing CTA
panel. It is also the whole page when the reader has asked for dark. Over both
sits a third set, the glass surfaces, which are translucent and therefore belong
to neither.

The second job is an amendment. This note used to say the near-black set
appeared "in exactly three places" and `layout.tsx` declared `colorScheme:
"light"` with a comment calling it "honest rather than aspirational: the site
has one surface set, and the dark tokens are band scoping, not a theme." There
is a theme now — see Dark mode below — and it is built from the same `--d-*`
values rather than from a second palette.

### Brand

**Neutral white, deep indigo, two chromatic auras.** Ground `#FCFCFC`, white
`#FFFFFF`, a neutral alternating band `#F4F4F5`, hairlines `#E4E4E7` and
`#D4D4D8`, near-black `#0C0D11`, and indigo `#4338CA`.

The grounds are an amendment within an amendment. They were `#FBFBFD` and
`#F3F4F8` — a deliberate cool cast, argued for on the grounds that "cool white
is what makes the glass above it look like glass rather than like fogged
paper". The client rejected it on sight as bluish, which is the second time a
ground has been rejected for its temperature.

Both halves of that argument survive the change. The chroma that makes glass
read as glass lives in the auras underneath it — they are unchanged, and they
are the thing actually being frosted — so the ground itself does not need a
cast to do that job. The hairlines moved with the grounds and for the same
reason: at 12 and 17 steps of blue they would have been the only thing left
carrying the cast, which is the complaint restated rather than answered.

This is an amendment, and a large one. The palette was Anthropic's clay — clay
`#CC785C` on ivory `#FAF9F5` with a cream `#F0EEE6` band — which landed after
four rejected rounds and was then rejected itself: it read as warm and generic,
the cream band was visibly yellow, and warm off-white is the most common ground
on the web. The direction now is Auraform's, taken from its real values rather
than its reputation.

- **The accent carries white.** `#FFFFFF` on `#4338CA` measures 7.90:1, which
  clears AA and AAA-large outright. The previous rule said the opposite — "clay
  carries dark text, never white" — because clay measured 3.28:1 under white and
  failed. That constraint went with the color that caused it; do not reinstate
  dark-on-accent.
- **Two accent tokens, two jobs.** `--accent` is text and marks, `--accent-fill`
  is fills. They hold the same value today. They stay two tokens because they
  are two jobs, and the clay palette is the proof that they can need to diverge.
- **The primary control carries a gradient, and only the primary control.** This
  is an amendment. The rule read "there is no gradient on a control — the
  gradients on this site are the two auras, and they are backdrops, never fills
  on a button or a chip." It was written against clay, which failed under white
  at 3.28:1 and had no headroom to ramp anywhere, and it contradicted the
  template section below, which already listed gradient CTA fills as permitted.
  The client asked for gloss directly. Both halves are resolved here.

  What makes it legal rather than merely pretty is that it is **measured**.
  `.control-gloss` ramps from `--accent-fill` to `--accent-fill-peak`, and the
  peak is pinned where white still clears AA — 4.88:1, with the hover peak at
  5.77:1. A gradient cannot be contrast-checked as one colour, so it is checked
  at the stop that is worst for the text on it, exactly as the two auras are.
  The dark set runs the other way, because its ink is near-black: its worst stop
  is the darkest, which is `--d-accent-fill` and is already measured.

  Push the peak lighter for more shine and `pnpm contrast` fails before the
  button looks better. `secondary` and `ghost` stay flat — a gradient on every
  control states nothing; a gradient on one states which action the band is for.
  The auras remain backdrops, and a chip still never takes a gradient fill.

### The two semantic poles

`--accent` is the target pole, `--legacy` the source pole, and the site encodes
direction of travel by color everywhere a migration is depicted.

- **The source pole is a warm stone, and the warmth is load-bearing.** The poles
  have swapped temperature: the target used to be warm clay against a cool stone
  source, on warm paper. Now the target is cool and chromatic and the source is
  warm and near-neutral.

  The argument that put them on opposite sides of the wheel is unchanged, because
  it was never about which side. The body and caption inks are cool slate on this
  palette, so a cool source pole would read as muted text rather than as a pole.
  `--legacy` and `--ink-faint` are within **1.01:1** of each other and always
  have been — the separation is by hue entirely, which is why `pnpm contrast`
  prints that number and says plainly that the rest is a visual check.

- The poles are **no longer symmetric in presence**, and that is deliberate: the
  target pole is chromatic and leads because it is the brand; the source pole is
  near-neutral and recedes. `pnpm contrast` still checks the luminance gap, but
  the tolerance is wider and a comment there explains why the check means less
  than it used to.
- The ten places the two poles sit adjacent and must stay legible side by side —
  the code panel's two headers, the platform strip, `PlatformPole`, the pipeline
  ticks, the coverage matrix, the case-study and use-case chips, the
  `StageList` columns, and the MDX `<Summary>`/`<Limits>` blocks — are a visual
  check, not a measurable one.

### Tokens

- **Theme scoping is CSS, not props.** `@theme inline` resolves each `var()` at
  the use site rather than baking a value into the utility, so reassigning the
  raw tokens on a subtree re-themes every utility underneath it. There is no
  `tone` prop on `Button`, `Label` or `Readout`, and nothing should reintroduce
  one.

  Two selectors share that one declaration list — `:root[data-theme="dark"]`
  for the page and `[data-tone="inverse"]` for a band — and they must not be
  allowed to diverge. An inverse band inside a dark page has to be an exact
  no-op, and a single declaration present in one and absent from the other
  would make that band behave differently depending on the page it sits on,
  which is not something review would catch.

- **A token may reference another rather than repeat its hex.** `--focus` is
  `var(--accent)`; the syntax classes point at the two poles. This is not
  cosmetic: those three were duplicated hexes once and silently survived a
  re-theme, keeping the old color while everything around them changed.
  `scripts/contrast.mjs` resolves the indirection so the report measures real
  values.
- **Every real value is declared in `:root`**, the dark ones under a `--d-*`
  prefix, and the theme block only aliases. That is not a style preference: it
  is what keeps the palette measurable, because `pnpm contrast` reads only the
  `:root` block and is structurally blind to everything after it. A value
  declared inside the theme block would be a value nothing ever checks.
- **`pnpm contrast`** re-derives every pair and reads **only the `:root` block** —
  a flat scan measures light foregrounds against dark backgrounds, because the
  scoping block reassigns light token names further down. The parse is
  positional — find `:root {`, stop at the first `\n}` — so **never nest a block
  inside `:root`**: a nested `@media` puts a `}` inside the window and silently
  truncates the scan. The script asserts the window it found is the right one
  and exits loudly if it is not. It also lints for `var()` references to tokens
  that are declared nowhere, which is how `--aura-cta-floor` survived in the
  scoping block for several commits. For an ad-hoc pair use
  `node scripts/contrast.mjs '#aaa' '#bbb'`; `pnpm` does not forward the args and
  will silently print the full report instead.
- The script now also **parses `rgb(r g b / a)` and composites**. A translucent
  token cannot be contrast-checked on its own — a ratio needs two opaque colors —
  so each glass step ships a `-solid` companion and the script flattens the alpha
  over the aura's worst pixel and fails if the declared companion has drifted.
  Move an aura stop and that check fails before any ratio does, which is the
  right order.
- **`--header-h` and `--header-gap`** are the single source for the nav island's
  geometry. `scroll-padding-top` and the mobile sheet's offset both derive from
  them. These were three independent values that had already drifted to 4rem
  against 6rem.
- **Radius** is four steps: 4px for controls and marks, 10px, then 16 and 24 for
  cards and panels. **Elevation** is `--shadow-card` and `--shadow-panel` on
  light, `--shadow-glass` under a frosted panel, `--shadow-menu` for the
  dropdown, and `--shadow-control` under the primary button.
- **Every shadow is mixed from `--accent-glow`, not from neutral grey.** The
  note that used to sit in the token block said a coloured shadow is the tell,
  and that is true of a shadow coloured for decoration — a lilac drop under a
  white card. This is the other thing: a near-black indigo at low alpha, which
  is what a shadow looks like on a page lit by a chromatic ground. The alphas
  did not move; only the hue did. Keep it that way.

  On the dark set the hue goes to black and the alphas still do not move, which
  is the same argument rather than an exception to it: the note above holds
  _because the light ground is chromatic_, and on near-black there is no
  coloured light for an occlusion to be tinted by. A lighter indigo under a card
  there would be the decorative lilac drop this rule rejects. A black shadow on
  a ground at luminance 0.0045 separates nothing, so four of the six shadow
  tokens lead with `--shadow-ring` — nothing on light, an inset hairline on
  dark. Not `--shadow-glass`, which has a border and two inset highlights
  already, and not `--shadow-control`, where an inset ring eats the gloss
  edge.

- **`.sheen`** is a single diagonal stop that leaves a surface's top-left clean
  and lets the accent settle into the bottom-right, so a flat card reads as lit
  from one direction. `Card raised` and `Section panel` take it; `Card ruled`
  does not, because a lattice cell has the grid's hairlines for structure and a
  sheen on twelve of them is noise. It is a `background-image`, so it composites
  over whatever fill the caller already set and costs no extra box. It states
  nothing — it is a light model, not a mark — which is what keeps it inside
  non-negotiable #6.
- `src/lib/derived.ts` — counts, positions and the platform lists. The only
  sanctioned source for a numeral rendered as design.
- `Readout` — a value with the thing it measures. `scale="display"` is only
  correct when the band exists to state that value.
- `Card` — `raised` for a free-standing card, `ruled` for a flat cell inside a
  `.lattice` where the grid draws the hairlines, `glass` for a panel floating on
  an aura. `glass` is illegal anywhere else — see the Glass section.
- `Section` takes `align`, `decoration`, `panel` and `bleed` alongside the
  older props. `align="center"` sets the eyebrow as a glass pill and is for
  bands that make an argument; data bands stay `left`, because a centred header
  above a ledger reads as marketing attached to a document. `decoration` makes
  the band a positioning context and clips it, and is decorative only.
- `.lattice` — a grid whose background shows through a 1px gap, instead of
  `gap-px` on bordered children which doubles every interior hairline. Lattice
  cells stay **opaque**: there is nothing behind them for glass to be glass
  against, and the hairlines are the structure.
- `PendingSection` — collapses in production including its heading, because an
  empty `<h2>` reads as thin content to a crawler.

### Typography

**Inter, one webfont, everywhere.** Loaded by `next/font/google` in
`layout.tsx`, which downloads it at build time and serves it from our own
origin. `--font-display` and `--font-sans` are the same face; `--font-mono`
stays on the system stack.

This is an amendment, and it reverses the rule it replaces outright. That rule
read **"No webfonts"** — the stack was Apple's own, New York for headings and
SF Pro Text for body, because those faces are not licensed for webfont use —
and it ended with a line saying Inter in particular reads as a default rather
than a decision and should not come back.

**The client has now asked for Inter directly**, on 6 Oct 2026, by naming
omnificx.com, which is Inter top to bottom. That judgement was ours and his
instruction is the later record. Do not reinstate the system stack, and do not
treat the "reads as a default" line as still standing — it is quoted here so
nobody reintroduces it from memory, not as live guidance.

- This is the **fifth** type decision and the first the client specified
  himself. He rejected three before it — Newsreader+Inter, then
  Fraunces+Instrument Sans — and New York was the fourth, our own choice,
  unrejected but superseded.
- Headings are **Inter at weight 600**, tracked at `-0.02em`. This reverses the
  New York setting and the reasoning reverses with it, because the argument was
  always about the axis rather than about the number: New York has an
  optical-size axis and could let size do the work, Inter has none, so weight is
  the range available again. 600-and-tight is also how the reference sets its
  own headings.
- **The serif is gone.** It was declared and deliberately unused once, then
  became the voice, and is now neither. If a serif comes back it is a new
  decision, taken deliberately — not a revival of New York.
- The site now downloads **one font file**: Inter is variable, so a single
  woff2 covers every weight. The old arrangement bought zero files at the price
  of a different typeface per platform — Georgia on Windows, a generic serif on
  Android. What the no-webfont rule was really protecting was privacy and
  layout stability, and `next/font` keeps both: no runtime request to Google,
  no third-party origin, and a metric-matched fallback so nothing shifts.
- **Mono is unchanged.** The code specimen needs a monospace face and a second
  download for it would be weight bought with nothing.

### The decorative tints

Five hues — rose, teal, sage, amber, violet — in `:root` as `--tint-*`. Each has
three steps because a base tint cannot carry text.

Two were renamed when the brand moved. `clay` was byte-identical to the old
`--accent-fill` and `blue` sits where the indigo accent now does: a decorative
hue that exactly matches a pole is the failure the next bullet warns about, so
they are `rose` and `teal`, chosen to clear both poles on the wheel.

- `--tint-<hue>` is a fill or gradient stop, `--tint-<hue>-ink` is the step that
  can carry text or an icon, `--tint-<hue>-wash` is a cell background.
- **They are decorative and carry no meaning.** Only `--accent` (target) and
  `--legacy` (source) state anything. If a tint starts standing for a concept,
  the migration diagrams stop being readable.
- `Card` takes `tint`, `icon`, `graphic` and `washed`. The tint sets `--chip-wash`
  and `--chip-ink` on the element, so `.chip` and any child can read them
  without a class map.
- **The dark set has two of the three steps**, `--d-tint-*-wash` and
  `--d-tint-*-ink`. The base hue is a fill or gradient stop and reads the same
  on either surface; the other two break outright on near-black, where a pastel
  wash becomes the brightest thing on the page. The washes hold their saturation
  at a low lightness on purpose — desaturating them there collapses all five
  into the same brown-grey, and the hue is the only job a decorative tint has.
- `pnpm contrast` checks each hue **five** ways. **Ink on its own wash** is the
  pair that breaks first if a wash is pushed for more colour on the light set;
  on the dark set it is **`--ink-faint` on the wash**, because `evidence.tsx`
  puts a `text-ink-faint` figure label directly on one. The light set had that
  row missing entirely — all five pass, and within 0.02 of each other, which is
  the tell that the washes were luminance-matched for exactly that pair and the
  check was simply never written.

### Auras

`.aura-hero`, `.aura-cta` and `.aura-quote` in `globals.css` are multi-stop
radial meshes used as a panel's whole background. **Three rules, four
geometries** — the hero, the closing CTA, the quote band, and the hero again on
a dark page, where it takes the dark ramp instead of its own.

All three dark geometries consume one shared set of stops, `--aura-dark-*`, so
"every dark aura shares one worst pixel" is structural rather than something
three copies of the same gradient have to keep true by hand. `CtaBand` renders
on every page, so that one is site-wide; the hero aura is the landing one. They
replace `.mesh-warm`, `.mesh-cool` and `.mesh-cta`; `.mesh-cool` had no
consumers and was deleted rather than ported.

Sharing stops is **not** why they share a worst pixel, and the distinction
matters because it is what licenses the dark hero. Overlap is geometry, so
identical stops under different ellipses could land anywhere. They agree because
`--aura-cta-peak` is the cyan stop's own centre composited alone, at a point
where the other two layers are past the end of their ramps — green being 71.5%
of luminance is what wins it the contest. The hero's stop ends are wider
(70/70/72% against 60/62/64%) and it still holds. That is measured, not
reasoned: `pnpm contrast` renders each stack and samples it.

They are not decoration added behind the glass. **They are the half of it that
makes the other half legible** — a frosted panel over flat white is a grey box.

- An aura **never sits behind copy that has to be read**, with one declared
  exception: the CTA band's heading and lede sit on `.aura-cta` directly. That
  is enforced rather than asserted — `pnpm contrast` measures both inks against
  the aura's worst pixel.
- `--aura-floor` and `--aura-cta-peak` are those worst pixels, **derived** by
  `pnpm contrast`: it renders each gradient stack at several aspect ratios and
  samples every pixel, then fails if the declared token has drifted. They were
  hand-measured constants with a comment saying so and nothing that re-derived
  them, which meant moving a stop silently invalidated every glass composite.
  Assuming total stop overlap instead of measuring cost the hero two full steps
  of saturation before it was measured at all.
- **The dark auras paint their own base, and have to be told to.** `.aura-cta`
  and `.aura-quote` are applied to the same element that carries
  `data-tone="inverse"`, and that block paints `background-color` and is
  unlayered, so for a long time it beat them and the gradients composited over
  `--d-ground` instead of `--aura-dark-base`. Close enough to look right, and
  wrong by exactly the amount the peak is measured over. They are restated at
  the winning specificity next to the `.glass` restatement, for the same
  reason.
- The two are **opposite ends on purpose**. Dark text on the light aura is worst
  at the aura's darkest pixel; light text on the CTA aura is worst at its
  brightest. One shared "floor" token would have been wrong in one of the two
  places, and silently.

### Glass

`.glass` (58% white) and `.glass-strong` (82%) in `globals.css`, both with
`backdrop-filter`. They re-theme on a dark band through the scoping block, so a
frosted panel on the CTA needs no variant of its own.

Two rules, both load-bearing rather than stylistic:

1. **Glass only sits on an aura.** Over flat `--ground` a translucent panel is
   indistinguishable from a solid one and costs a compositing layer for nothing.
   The nav island looks like an exception and is really the purest case: its
   backdrop is the page scrolling under it.
2. **`--ink-faint` may never sit on `--glass`.** Over the aura floor it measures
   3.82:1 and fails; on `--glass-strong` it is 4.62:1 and passes. Eyebrows,
   breadcrumbs and `Readout` labels go on the strong step or on a flat surface.
   `--ink` and `--ink-muted` are fine on either.

- Each step ships a `-solid` companion holding what it composites to over its
  aura's worst pixel. That is what every text pair is measured against, and
  `pnpm contrast` **derives** it rather than trusting the hex.
- The `@supports not (backdrop-filter)` and `prefers-reduced-transparency`
  fallbacks are **not progressive enhancement**. 58% white over a saturated aura
  with no blur is unreadable, not merely plainer, so both fall back to the
  opaque composite.
- **Two inset highlights, not one.** The top edge was always there — it is what
  stops a frosted panel reading as a flat fill. The bottom one is the glossy
  half: a real pane catches light at its far edge too, and without it the panel
  reads as frosted film. The far edge is its own token, `--glass-edge-soft`,
  rather than a colour mixed inline: an unsupported colour function inside a
  `box-shadow` list invalidates the whole declaration, which would drop the
  outer shadow along with the highlight. `saturate()` went from 140% to 165% in the same pass; neither
  change touches a measured value, because the `-solid` companions are derived
  from the alpha and the aura floor, and neither moved.

### Navbar

A floating pill island, detached from the top edge so the page scrolls visibly
underneath it. One passive scroll listener drives one boolean, which tightens the
island past 16px — deliberately not a scroll-linked animation, which would run
work every frame to save a 300ms transition.

It is `.glass-strong`, not `.glass`: its backdrop is arbitrary page content and a
dark band can scroll under it, so the nav labels have to stay readable over
whatever arrives. Past the threshold it also takes `.glass-raised` rather than a
bare `shadow-panel` utility, which would replace `box-shadow` outright and take
the inset hairline of light with it.

The theme toggle is its own always-visible button, placed before the CTA
cluster and the hamburger. It cannot join the cluster, which starts at `lg`:
the theme is not a desktop feature. It is `h-9`, not the hamburger's 44px box,
because the island is the one fixed-height surface on the site and at 320px it
already carries a wordmark and a hamburger.

Note when testing: **programmatic `window.scrollTo` does not dispatch a scroll
event** in the browser-automation context, so the island will appear not to
react. Scroll with a real wheel event to verify it. The same context pins the
page viewport, so resizing the window does not test the mobile layout — check
that on a real narrow viewport.

### Dark mode

**Light is the default for every visitor.** Dark is opt-in, through the header
toggle, remembered in `localStorage`. `prefers-color-scheme` is deliberately not
consulted on arrival: the sourced bands, the two semantic poles and the code
specimen were all designed and contrast-checked on light first, and handing an
unasked-for theme to a reader on OS-dark is a worse default than one click.

- **It is the same `--d-*` values, not a second palette.** The theme block and
  the band block share one declaration list — see Tokens for why they must not
  diverge.
- **`data-theme` on `<html>` is the single source of truth.** A parser-blocking
  inline script as the first child of `<body>` sets it before the first paint;
  the toggle reads and writes it there rather than keeping a copy, via
  `useSyncExternalStore`. It always writes the attribute, never only for dark,
  so the toggle's read path has one invariant to rely on, and anything other
  than the literal `"dark"` resolves to light — a corrupted storage value
  cannot produce a dark first paint. With JavaScript off nothing is written and
  `:root`'s light values apply, which is the opt-in rule restated.
- **`suppressHydrationWarning` goes on `<html>` and nowhere else.** It covers
  the one attribute that script mutates and hides nothing else.
- **`colorScheme` lives in CSS, not in `viewport`.** As a viewport key it
  resolves against the OS preference, so it would hand a reader on OS-dark the
  dark scrollbars and form controls over a light page.
- **`themeColor` cannot fully escape that**, and this is the one known wart.
  Its `media` keys also resolve against the OS, so a reader on OS-light who
  opts into dark gets a light address bar over a dark page. The array form is
  the best a static value can do; the toggle closes the gap by rewriting the
  live meta tags on change.
- **`@custom-variant dark` is keyed to the attribute**, not to
  `prefers-color-scheme`. Without it Tailwind v4's default would quietly
  contradict the rule above the first time anyone writes a `dark:` utility.

### The code specimen

`src/components/sections/code-transform.tsx` is the homepage's principal graphic:
a real BusinessWorks process and the Logic Apps workflow generated from it.

- It resolves from `migration.specimen` in `src/content/migrations.ts`, like
  every other graphic on the site. A pair without a specimen renders nothing.
- **Both fragments must be accurate to the platform** — trimmed from real
  output, never invented. This is the one element an integration architect will
  read line by line looking for a reason to disbelieve the rest of the page.
- Highlighting is `src/lib/syntax.ts`, hand-rolled for XML and JSON. A
  third-party highlighter ships its own theme, and a theme is a list of
  hardcoded hex values, which non-negotiable #5 forbids. Owning it means every
  token class resolves to a `--d-syntax-*` token and `pnpm contrast` can measure
  it.
- The four syntax colors are the only colors on the site outside the two
  semantic poles, and each states what a token _is_. `tag` and `punct` reference
  the two poles; `attr` moved from dusty blue to cyan when the target pole became
  indigo, because a blue attribute name beside a periwinkle element name was two
  blues rather than two classes.
- `CodeCard` — the small pane in the hero — is the one place the dark set is
  translucent, because the hero aura behind it is the thing being frosted. The
  full two-pane `CodeTransform` sits on a flat band and stays opaque.

### Motion

CSS only; there is no animation library and none should be added.

- **Nothing gates content on scroll.** No `whileInView`, no reveal on
  intersection. This is non-negotiable #2 and it is why the previous site
  shipped an invisible mobile headline. Every reference site the client has
  offered — zenflow, auraform, aiwork, agentik — has the same defect, and
  Auraform's hero still renders blank until its appear effects fire.
- **An observer may decorate; it may not gate.** This line used to read "no
  IntersectionObserver reveals", which is the right rule stated in a way that
  also banned things that are fine. `AgentRail` uses one observer to mark which
  stage is current. Every stage's heading, copy, diagram and ledger is in the
  server-rendered HTML and visible on arrival; with JavaScript off the rail
  simply stops highlighting. The test is not which API is used, it is whether
  anything is invisible until you scroll.
- `position: sticky` is likewise fine, and is where most of the section rhythm
  now comes from. It moves an element that is already painted.
- Entrance animation is for **marks only** — hairlines, ticks, a diagram drawing
  itself — never text, and runs on load rather than on intersection.
- Marks animate on `transform`, on `stroke-dashoffset`, or on the opacity of a
  _tint behind_ text that is already painted. Nothing that carries meaning
  starts at `opacity: 0`.
- **No count-up numerals, ever.** Auraform's figures band serialises `0M+` and
  `0+` into its HTML and counts up on scroll. Our figures band is the sourced
  one, so a crawler reading `0` is the single worst bug this site could ship.
- Three looping animations exist: the bus pulse, the specimen's scan line and
  the platform marquee. All are switched off outright under
  `prefers-reduced-motion` rather than left to the global guard, because an
  infinite animation forced to a single 0.01ms iteration parks at whatever frame
  it lands on.

  This line was aspirational for a long time and is now true. The bus pulse had
  no keyframe, no utility and no usage anywhere in the tree or its history —
  the documentation was describing an intention. `PipelineFlow` is where it
  lives. It has to be a **separate overlay stroke** rather than a second
  animation on the drawn line: `animate-draw` owns `stroke-dasharray`, and one
  stroke cannot carry two dash patterns, which is the same reason a stroke
  cannot be both dashed and animated.

### Diagrams

`src/components/diagrams/` — inline SVG, no library. Before these the repo
contained no SVG at all, so this is the shared contract rather than a style. It
lives in `svg.tsx`; `agent-diagram.tsx` and `concept-diagram.tsx` each held a
byte-identical copy of it until a third consumer arrived.

- Colour resolves from `currentColor` or a token the caller sets. Never a hex
  (non-negotiable #5), which is also what lets one diagram sit on a tinted card,
  a dark band or a glass panel with no variant.
- They draw themselves **on load**, via `stroke-dashoffset` on a stroke carrying
  `pathLength="1"` so the dash length is normalised and nothing has to measure a
  path. The resting state is the finished drawing.
- **Do not add `vector-effect: non-scaling-stroke`.** It stops `pathLength` from
  normalising `stroke-dasharray`, which is exactly what the draw-on animation
  depends on. For the same reason a stroke cannot be both dashed and animated —
  `animate-draw` owns the dasharray — so distinguish those by weight and colour.
- **`agent-diagram.tsx` is registry-fed and may look like data.** Five
  hand-authored forms, one per stage. They are hand-authored because
  `inputs.length` is 2 and `outputs.length` is 3 for every agent in the
  registry: anything keyed on those counts draws the same shape five times,
  which is precisely what the bar-tick graphic these replaced did.
- **`concept-diagram.tsx` is conceptual and must not look like data.** No axis,
  no scale, no numeral. A bar chart asserts a measurement, and there is no
  source for "how far a manual rewrite gets". An earlier version of the
  engagement diagram drew a filled bar at 85/50/20 percent — a fabricated
  statistic in a diagram's clothes. It marks one of three positions now, because
  the ordering is something the copy supports and the distances are not.
- **`pipeline-flow.tsx` is the one canonical picture of the product.** Three
  variants off one component — `overview` horizontal, `rail` vertical for the
  pinned panel in `AgentRail`, `position` for an agent detail page. It replaced
  three separate renderings of the same five registry agents: a ruled dark
  strip on `/platform` and the pair pages, a bespoke five-cell nav on each agent
  page, and the rail inside `AgentRail`. A change to the pipeline was a change
  in three places and was never made in three places.

  Two things to know before editing it. The bus is positioned as a hairline
  strip pinned to the centre of the stage marks, not as a layer stretched over
  the list — stretched, its position depended on how tall the copy underneath
  happened to be. And an SVG carrying a `viewBox` is a replaced element with an
  intrinsic size, so `inset-x-0` alone will not stretch it; `w-full` has to be
  stated or it silently renders at 100px.

- `FigureChart` draws a sourced figure only when its frontmatter declares a
  `chart` block, and returns `null` otherwise — the same discipline as
  `Pending`. It never parses `value` or `source`: the comparators live in prose
  ("against a 14-month manual-migration estimate") and inferring a number out of
  a sentence to size a bar is what #6 forbids. "Zero" and "Same quarter" are
  real figures with no shape, and they correctly get no bar.

### What keeps this from reading as a generated template

The client asked for "vibrant, futuristic" and named five reference sites, three
of which are Framer templates. **The distinction that matters: what makes a
template look generated is fabricated content, not the layout vocabulary.**
Adopting Aiwork's section inventory and filling it from the registries is not the
same move as shipping a template full of lorem and stock logos.

So the layout vocabulary is now permitted — bento grids, 12–16px radii, soft
shadows, gradient CTA fills, a figures band, an FAQ accordion, a pricing-shaped
table. This is a deliberate reversal of an earlier version of this section, taken
after the client reviewed and rejected the restrained direction twice.

Still forbidden, and not negotiable:

- Fabricated customers, logos or statistics (non-negotiable #1). The figures band
  on the homepage is permitted _only_ because every value carries a `source`
  string the schema requires.
- Any H1 behind a scroll reveal (#2).
- Invented product screenshots. The code specimen exists precisely so the hero
  does not need one — a mocked dashboard asserts a UI that may not exist, which
  is an unsourced claim in a different costume.
- A logo wall of customers we do not have. `PlatformStrip` fills that slot with
  platform names and states how much of the matrix is actually documented.
- A decorative backdrop grid. Non-negotiable #6 names this exact element; the
  hero uses `.aura-hero` instead, which lights the panel and claims nothing.
- Glow orbs, sequential scroll fade-ups, star ratings, stock avatars, sparkle
  motifs.

**Glassmorphism came off this list**, along with the ban on chromatic hero
gradients — they are the direction now, and they are governed by the Glass and
Auras sections rather than forbidden.

Scroll fade-ups did **not** come off, and the reason is worth recording. Auraform
is where the surfaces came from, and its own hero renders blank on arrival: the
headline only appears once its Framer appear effects fire. That is precisely the
defect this rebuild exists to fix (#2). Borrowing a site's surfaces is not
borrowing its behavior.

Content is much thinner in production than in preview: `<Pending>`, draft
migration pairs and draft MDX entries are all stripped, so preview shows two
pairs and three solutions where production shows one and none. Check both —
`pnpm build && pnpm start` exercises the production path.

## Not yet built

Nothing structural. The MDX content layer and all four detail templates
(`/resources/[slug]`, `/case-studies/[slug]`, `/use-cases/[slug]`,
`/solutions/[slug]`) landed in 144e7f5. What is missing is content: see
`pnpm pending`.

`pnpm pending` separates **debts from satisfied guards**. Some markers only
render when a collection is empty, or when it holds a draft, and a flat scan of
the source counted those as owed — reporting two items on /case-studies that
the client had already delivered. The guards are resolved against `content/`
now, by reading the JSX condition rather than the marker's prose: /use-cases
carries the same shape of guard and it genuinely does render, because that
collection really is empty. Anything guarded that cannot be resolved stays in
the owed list. Reporting a debt that turns out to be satisfied costs a
question; hiding one costs a launch.
