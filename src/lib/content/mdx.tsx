import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { cn } from "@/lib/utils";
import { FigureChart } from "@/components/diagrams/figure-chart";
import type { SourcedFigure } from "@/lib/content/schemas";

/**
 * MDX body renderer.
 *
 * Headings get ids and anchors so long pages are linkable — which matters for
 * answer engines quoting a single passage. Tables scroll inside their own
 * container so the page body never scrolls sideways.
 *
 * `scroll-mt-anchor` resolves from `--header-h` and `--header-gap`, the same
 * two tokens the nav island and `scroll-padding-top` use. This was a literal
 * `scroll-mt-24` that happened to equal the real offset; the comment on those
 * tokens in globals.css records what happens when copies of that arithmetic
 * drift.
 */

type AnchorProps = React.ComponentPropsWithoutRef<"a">;

const components = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-h3 scroll-mt-anchor mt-14 mb-4" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="scroll-mt-anchor font-display mt-10 mb-3 text-xl font-semibold"
      {...props}
    />
  ),
  a: ({ href = "", ...props }: AnchorProps) => {
    const internal = href.startsWith("/");
    if (internal) return <Link href={href} {...props} />;
    return (
      <a href={href} rel="noreferrer noopener" target="_blank" {...props} />
    );
  },
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="border-rule my-8 overflow-x-auto rounded-sm border">
      {/* The min-width is what makes the wrapper's `overflow-x-auto` do
          anything. Without it a four-column table does not scroll on a phone,
          it compresses — every header stacks one word per line and the rows
          grow to several hundred pixels tall before anything overflows. */}
      <table
        className="w-full min-w-[32rem] border-collapse text-sm"
        {...props}
      />
    </div>
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-rule bg-surface-2 text-ink-faint border-b px-4 py-3 text-left font-mono text-xs tracking-wide uppercase"
      {...props}
    />
  ),
  td: (props: React.ComponentPropsWithoutRef<"td">) => (
    <td className="border-rule border-b px-4 py-3 align-top" {...props} />
  ),
  /** A short, self-contained factual block — the passage answer engines lift. */
  Summary: ({ children }: { children: React.ReactNode }) => (
    <div className="border-accent-line bg-accent-soft my-8 rounded-sm border p-5 sm:p-6">
      <div className="text-label text-accent mb-3 font-mono uppercase">
        At a glance
      </div>
      <div className="[&>ul]:m-0 [&>ul]:list-none [&>ul]:p-0">{children}</div>
    </div>
  ),
  /**
   * Reserved for stating limits — what does not convert automatically.
   *
   * Its label is an `h2`, not a styled div. Every body that uses this block
   * previously carried a `## What this does not solve` heading immediately
   * above it, which would have meant the same label twice; dropping the
   * heading in favour of the block would have taken a real `h2` out of the
   * document outline to gain a decorative one. The label carries the heading
   * instead, and looks exactly as it did.
   */
  Limits: ({ children }: { children: React.ReactNode }) => (
    <div className="border-legacy-line bg-legacy-soft my-8 rounded-sm border p-5 sm:p-6">
      <h2 className="text-label text-legacy scroll-mt-anchor mt-0 mb-3 font-mono uppercase">
        What this does not do
      </h2>
      {children}
    </div>
  ),
  /**
   * A sourced figure with its bar, for a body that wants to show one.
   *
   * It was React-only and reachable from `evidence.tsx` alone, so the homepage
   * band was the only place on the site a sourced figure could carry its
   * shape. The component itself is unchanged and enforces the same rule: it
   * returns null unless the frontmatter declares a `chart`, because inferring a
   * number out of a sentence to size a bar is what non-negotiable #6 forbids.
   */
  FigureChart: ({ figure }: { figure: SourcedFigure }) => (
    <FigureChart figure={figure} />
  ),
};

export function Mdx({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // `break-words` on inline code: a long identifier or URL in body copy
        // is the last way a single unbroken string can push the page sideways.
        "prose prose-vekto prose-headings:font-display prose-headings:font-medium prose-code:break-words max-w-none",
        className,
      )}
    >
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </div>
  );
}
