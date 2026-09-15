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
5. **Never hardcode a colour.** Everything resolves through the tokens in
   `src/app/globals.css`.

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

Sentence case headings. No emoji, no exclamation marks, anywhere on the site.
Second person, active voice. One idea per paragraph. Lead with the constraint,
not the benefit — a stated limit is what makes the surrounding claims credible.
Name real systems and versions ("BusinessWorks 5.x EMS destinations", not
"legacy messaging").

Page section plans live in the SEO blueprint artifact, not here.

## Open decisions

- **Spelling convention is unresolved.** The codebase currently uses British
  forms (artefact, anonymised, modernisation). The buying audience is US and
  Western European, so American is the safer default. Pick one before the
  content layer is written — changing it later means touching every page.
- **The five agent detail pages risk reading as near-duplicates** to search
  engines. Each needs a distinct worked example. If the client cannot supply
  five, collapse them into one `/agents` page with anchors.

## Not yet built

MDX content layer (dependencies installed, typed loader not written) and the
four detail templates: `/resources/[slug]`, `/case-studies/[slug]`,
`/use-cases/[slug]`, `/solutions/[slug]`. Index pages exist for all four.
