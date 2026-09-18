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
6. **Every visual element resolves from a real value.** A numeral or graphic
   mark may only appear if it comes from `src/content/*` via `src/lib/derived.ts`
   — counts, positions, inventories, source/target polarity. Nothing on the page
   is ornament. The previous hero drew a 4rem hairline grid that encoded nothing;
   it is gone. If a figure cannot be sourced it is a `<Pending>`, not a stat.

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
`tibco-to-mulesoft` is published today — it is the one pair named in the scope.

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

- `src/lib/derived.ts` — counts and positions computed from the registries. The
  only sanctioned source for a numeral rendered as design.
- `Readout` in `src/components/ui/label.tsx` — a value with the thing it
  measures. `Label` is a caption; a `Readout` _is_ data, so the value takes
  `--ink` and the caption recedes.
- `.lattice` in `globals.css` — a grid whose background shows through a 1px gap.
  Use it instead of `gap-px` on bordered children, which doubles every interior
  hairline to 2px and thickens the perimeter.
- `Section density` — `tight | default | loose`, mapped to the `--spacing-band*`
  tokens. A band's height states its editorial weight. Section separators are
  decided by adjacency in CSS: a rule is drawn only between two consecutive
  bands sharing a tone, since a tonal change already separates them.
- `PendingSection` — for a band whose entire body is outstanding content. It
  collapses in production including its heading, because an empty `<h2>` reads
  as thin content to a crawler and as an unfinished page to a buyer.
- `tone="inverse"` on `Button` is required on `--inverse` surfaces. The accent
  measures 2.15:1 there, below the 3:1 floor for a control's own boundary.

Content is much thinner in production than in preview: `<Pending>` and draft
migration pairs are both stripped, so preview shows six pairs and production
one. Check both — `pnpm build && pnpm start` exercises the production path.

## Not yet built

Nothing structural. The MDX content layer and all four detail templates
(`/resources/[slug]`, `/case-studies/[slug]`, `/use-cases/[slug]`,
`/solutions/[slug]`) landed in 144e7f5. What is missing is content: see
`pnpm pending`.
