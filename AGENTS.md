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
  That is enough to stop them being near-identical markup, but it is not
  evidence. If the client cannot supply five worked examples, collapsing them
  into one `/agents` page with anchors is still the fallback.
- **No OG image exists.** `src/lib/seo.ts` documents one but emits no `images`
  key, and there is no `opengraph-image` file, so every social share is bare.
  Needs `opengraph-image.tsx` — remember `params` is a Promise in Next 16.

## Design system

Light is the ground the page is written on. The near-black set is **punctuation**
— it appears in exactly three places: the code specimen's interior, the pull
quote, and the closing CTA panel.

### Brand

**Anthropic's clay.** The palette is theirs: clay `#CC785C`, ivory `#FAF9F5`,
cream `#F0EEE6`, slate `#141413`, with dusty blue and sage as secondaries.

- **Clay carries dark text, never white.** Clay measures 3.28:1 under white and
  fails AA; under `--accent-ink` it is 5.08:1. White-on-color is what every
  other site in this category ships and would have been wrong here on the
  numbers alone. This is the rare case where the accessible answer is also the
  more distinctive one — do not "fix" the button to white text.
- **Two accent tokens, two jobs.** `--accent` is the deep step for text and
  marks; `--accent-fill` is the clay itself, for fills only. Clay as text on
  ivory is 3.11:1 and fails.
- There is **no gradient**. An earlier pass used a teal-to-blue sweep on the
  primary; clay is used flat, the way Anthropic uses it. The only survivor is a
  hairline of warm light on the CTA panel's top edge.

### The two semantic poles

`--accent` is the target pole, `--legacy` the source pole, and the site encodes
direction of travel by color everywhere a migration is depicted.

- **The source pole is a cool stone grey, and the coolness is load-bearing.**
  Clay took the warm end of the palette and the body and caption inks are warm
  greys, so an achromatic or warm source pole reads as muted text rather than as
  a pole. It is luminance-matched to `--accent` (5.25 against 5.47) and
  separated by hue instead.
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

- **Theme scoping is CSS, not props.** `[data-tone="inverse"]` reassigns the raw
  tokens for a whole subtree and `@theme inline` resolves each `var()` at the use
  site, so every utility underneath re-themes itself. There is no `tone` prop on
  `Button`, `Label` or `Readout`, and nothing should reintroduce one.
- **A token may reference another rather than repeat its hex.** `--focus` is
  `var(--accent)`; the syntax classes point at the two poles. This is not
  cosmetic: those three were duplicated hexes once and silently survived a
  re-theme, keeping the old color while everything around them changed.
  `scripts/contrast.mjs` resolves the indirection so the report measures real
  values.
- **`pnpm contrast`** re-derives every pair and reads **only the `:root` block** —
  a flat scan measures light foregrounds against dark backgrounds, because the
  scoping block reassigns light token names further down. For an ad-hoc pair use
  `node scripts/contrast.mjs '#aaa' '#bbb'`; `pnpm` does not forward the args and
  will silently print the full report instead.
- **`--header-h` and `--header-gap`** are the single source for the nav island's
  geometry. `scroll-padding-top` and the mobile sheet's offset both derive from
  them. These were three independent values that had already drifted to 4rem
  against 6rem.
- **Radius** is four steps: 2px for controls and marks, 4px, then 12 and 16 for
  cards and panels. **Elevation** is `--shadow-card` and `--shadow-panel` on
  light, `--shadow-key` on dark, `--shadow-menu` for the dropdown.
- `src/lib/derived.ts` — counts, positions and the platform lists. The only
  sanctioned source for a numeral rendered as design.
- `Readout` — a value with the thing it measures. `scale="display"` is only
  correct when the band exists to state that value.
- `Card` — `raised` for a free-standing card, `ruled` for a flat cell inside a
  `.lattice` where the grid draws the hairlines.
- `.lattice` — a grid whose background shows through a 1px gap, instead of
  `gap-px` on bordered children which doubles every interior hairline.
- `PendingSection` — collapses in production including its heading, because an
  empty `<h2>` reads as thin content to a crawler.

### Typography

**No webfonts.** The stack is Apple's own — SF Pro Display for headings, SF Pro
Text for body, SF Mono for code — reached through the system font stack in
`globals.css`, because those faces are not licensed for webfont use.

- Headings are **weight 600 with tight tracking**, Apple's marketing setting.
  The previous serif ran at one weight because its optical-size axis carried the
  range; SF has no such axis, so weight does that work.
- `font-serif` resolves to New York on Apple hardware but **is not used
  anywhere** — the whole site is one sans voice. Do not reintroduce it piecemeal.
- The site downloads **zero font files**. On Windows this falls back to Segoe UI
  and on Android to Roboto, both more generic than SF. That tradeoff is inherent
  to the brief and was accepted knowingly.
- Three previous stacks were tried and rejected by the client: Newsreader+Inter,
  then Fraunces+Instrument Sans. **Inter in particular reads as a default rather
  than a decision** and should not come back.

### The decorative tints

Five hues — clay, dusty blue, sage, amber, violet — all from Anthropic's palette,
in `:root` as `--tint-*`. Each has three steps because a base tint cannot carry
text; the lightest measures 2.07:1 on the ground.

- `--tint-<hue>` is a fill or gradient stop, `--tint-<hue>-ink` is the step that
  can carry text or an icon, `--tint-<hue>-wash` is a cell background.
- **They are decorative and carry no meaning.** Only `--accent` (target) and
  `--legacy` (source) state anything. If a tint starts standing for a concept,
  the migration diagrams stop being readable.
- `Card` takes `tint`, `icon`, `graphic` and `washed`. The tint sets `--chip-wash`
  and `--chip-ink` on the element, so `.chip` and any child can read them
  without a class map.
- `pnpm contrast` checks each hue four ways; **ink on its own wash** is the pair
  that breaks first if a wash is pushed for more colour.

### Gradients

`.mesh-warm`, `.mesh-cool` and `.mesh-cta` in `globals.css` are multi-stop radial
meshes used as a panel's whole background. They **never sit behind text that has
to be read** — a gradient cannot be contrast-checked against a moving target, so
copy goes on a flat surface and the gradient carries the area around it.

### Navbar

A floating pill island, detached from the top edge so the page scrolls visibly
underneath it. One passive scroll listener drives one boolean, which tightens the
island past 16px — deliberately not a scroll-linked animation, which would run
work every frame to save a 300ms transition.

Note when testing: **programmatic `window.scrollTo` does not dispatch a scroll
event** in the browser-automation context, so the island will appear not to
react. Scroll with a real wheel event to verify it.

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
  semantic poles, and each states what a token _is_.

### Motion

CSS only; there is no animation library and none should be added.

- **Nothing gates content on scroll.** No `whileInView`, no IntersectionObserver
  reveals. This is non-negotiable #2 and it is why the previous site shipped an
  invisible mobile headline. Every reference site the client has offered —
  zenflow, auraform, aiwork, agentik — has the same defect.
- Entrance animation is for **marks only** — hairlines, ticks, the scan line —
  never text, and runs on load rather than on intersection.
- Marks animate on `transform` or `opacity` of a _tint behind_ text that is
  already painted. Nothing that carries meaning starts at `opacity: 0`.
- Two looping animations exist: the bus pulse and the specimen's scan line. Both
  are switched off outright under `prefers-reduced-motion` rather than left to
  the global guard, because an infinite animation forced to a single 0.01ms
  iteration parks at whatever frame it lands on.

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
  hero uses `.hero-light`, a soft falloff that lights the panel, instead.
- Violet or pink hero gradients, glassmorphism, glow orbs, sequential scroll
  fade-ups, star ratings, stock avatars, sparkle motifs.

Content is much thinner in production than in preview: `<Pending>`, draft
migration pairs and draft MDX entries are all stripped, so preview shows two
pairs and three solutions where production shows one and none. Check both —
`pnpm build && pnpm start` exercises the production path.

## Not yet built

Nothing structural. The MDX content layer and all four detail templates
(`/resources/[slug]`, `/case-studies/[slug]`, `/use-cases/[slug]`,
`/solutions/[slug]`) landed in 144e7f5. What is missing is content: see
`pnpm pending`.
