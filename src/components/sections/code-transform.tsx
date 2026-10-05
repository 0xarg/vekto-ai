import { migrations, publishedMigrations } from "@/content/migrations";
import { tokenize, tokenClass, type Token } from "@/lib/syntax";
import { Label } from "@/components/ui/label";

/**
 * The homepage's principal graphic: a real BusinessWorks process on the left and
 * the Logic Apps workflow generated from it on the right.
 *
 * Why this rather than a product screenshot. The reference sites all lead with a
 * picture of a dashboard, and a mocked one would assert a UI that may not exist
 * — the same class of claim as an unsourced statistic, in a different costume.
 * This asserts only what the registry already says: that this pair is supported
 * and these are the artifacts it reads. It is also the one graphic on the page a
 * competitor cannot copy without doing the work.
 *
 * It is the only place on the site carrying color beyond the two semantic poles,
 * and the color is load-bearing: each class states what a token *is*. See the
 * syntax block in globals.css.
 *
 * Every character of both samples is in the server-rendered HTML. The animation
 * adds a travelling highlight over text that is already painted — nothing here
 * waits for a scroll, and nothing starts at `opacity: 0`.
 */
function CodePane({
  code,
  language,
  caption,
  pole,
  limit,
}: {
  code: string;
  language: "xml" | "json";
  caption: string;
  pole: "source" | "target";
  /** Truncate to this many lines, for the compact card. */
  limit?: number;
}) {
  const lines = tokenize(code, language).slice(0, limit);
  const gutter = String(lines.length).length;

  return (
    <div className="bg-surface flex min-w-0 flex-col">
      <div className="border-rule flex items-baseline justify-between gap-3 border-b px-4 py-2.5">
        <Label>{caption}</Label>
        <span
          className={`text-label font-mono uppercase ${
            pole === "source" ? "text-legacy" : "text-accent"
          }`}
        >
          {language}
        </span>
      </div>

      {/* The pane scrolls, the page does not. 12px is the floor: this is the
          one element on the site an integration architect reads line by line,
          and the previous 11px was below what that survives on a phone. */}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-[1.7]">
        <code>
          {lines.map((tokens: Token[], i: number) => (
            /* `w-max min-w-full` so a line is as wide as its own content.
               Without it the line box stops at the visible width and the scan
               stripe below — absolutely positioned against it — covered only
               the part of the line you could already see. */
            <span
              key={i}
              className="group/line relative block w-max min-w-full"
            >
              <span
                aria-hidden
                className="text-ink-faint/60 hidden shrink-0 pr-4 text-right select-none sm:inline-block"
                style={{ width: `${gutter + 1}ch` }}
              >
                {i + 1}
              </span>
              {tokens.map((t, j) => (
                <span key={j} className={tokenClass[t.kind]}>
                  {t.text}
                </span>
              ))}
              {/* The travelling read/write head. One per line, staggered, so the
                  pane reads top to bottom the way the agent processes it. */}
              <span
                aria-hidden
                className={`animate-line-scan pointer-events-none absolute inset-y-0 left-0 w-full ${
                  pole === "source" ? "bg-legacy-soft" : "bg-accent-soft"
                }`}
                style={{
                  animationDelay: `${(pole === "target" ? 900 : 0) + i * 140}ms`,
                }}
              />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * A single pane at a size that fits in a hero, frosted over the hero aura.
 *
 * This is the one place the dark set is translucent. It works because the aura
 * behind it is the thing being frosted; the full two-pane figure below sits on
 * a flat band and stays opaque, because there would be nothing for glass to be
 * glass against.
 *
 * The full two-pane figure is ~400px of code with no height cap, which made it
 * the tallest and widest object on the page and left the headline arguing for
 * attention with it. This shows the source side only, clipped to eight lines,
 * and the full version keeps its own band further down where that size is the
 * point.
 */
export function CodeCard({ className }: { className?: string }) {
  const migration = publishedMigrations[0] ?? migrations[0];
  if (!migration?.specimen) return null;

  const { specimen, sourcePlatform, targetPlatform } = migration;

  return (
    <figure
      data-tone="inverse"
      className={`glass w-full max-w-sm overflow-hidden rounded-lg ${className ?? ""}`}
    >
      <figcaption className="border-rule flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <span className="text-ink text-[0.8125rem]">
          {sourcePlatform.shortName}{" "}
          <span className="text-ink-faint font-mono">&rarr;</span>{" "}
          {targetPlatform.shortName}
        </span>
        <span className="text-label text-accent font-mono uppercase">
          {specimen.demonstrates.split(" ")[0]}
        </span>
      </figcaption>

      <CodePane
        code={specimen.source}
        language={specimen.sourceLanguage}
        caption="Source"
        pole="source"
        limit={8}
      />
    </figure>
  );
}

export function CodeTransform({ className }: { className?: string }) {
  // Production strips drafts, so the published pair is normally the only one.
  const migration = publishedMigrations[0] ?? migrations[0];
  if (!migration?.specimen) return null;

  const { specimen, sourcePlatform, targetPlatform, sourceArtifacts } =
    migration;

  return (
    <figure
      data-tone="inverse"
      className={`shadow-panel rounded-xl border ${className ?? ""}`}
    >
      <figcaption className="border-rule flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-3">
        <span className="text-ink text-sm">
          {sourcePlatform.name}{" "}
          <span className="text-ink-faint font-mono">&rarr;</span>{" "}
          {targetPlatform.name}
        </span>
        <Label>{specimen.demonstrates}</Label>
      </figcaption>

      <div className="lattice md:grid-cols-2">
        <CodePane
          code={specimen.source}
          language={specimen.sourceLanguage}
          caption="Source"
          pole="source"
        />
        <CodePane
          code={specimen.target}
          language={specimen.targetLanguage}
          caption="Generated"
          pole="target"
        />
      </div>

      <div className="border-rule text-ink-faint border-t px-4 py-3 font-mono text-xs">
        {sourceArtifacts.length} artifact classes read on the{" "}
        {sourcePlatform.shortName} side
      </div>
    </figure>
  );
}
