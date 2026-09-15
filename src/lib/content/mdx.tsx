import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { cn } from "@/lib/utils";

/**
 * MDX body renderer.
 *
 * Headings get ids and anchors so long pages are linkable — which matters for
 * answer engines quoting a single passage. Tables scroll inside their own
 * container so the page body never scrolls sideways.
 */

type AnchorProps = React.ComponentPropsWithoutRef<"a">;

const components = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-h3 mt-14 mb-4 scroll-mt-24" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-10 mb-3 scroll-mt-24 font-serif text-xl" {...props} />
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
      <table className="w-full border-collapse text-sm" {...props} />
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
    <div className="border-accent-line bg-accent-soft my-8 rounded-sm border p-6">
      <div className="text-label text-accent mb-3 font-mono uppercase">
        At a glance
      </div>
      <div className="[&>ul]:m-0 [&>ul]:list-none [&>ul]:p-0">{children}</div>
    </div>
  ),
  /** Reserved for stating limits — what does not convert automatically. */
  Limits: ({ children }: { children: React.ReactNode }) => (
    <div className="border-legacy-line bg-legacy-soft my-8 rounded-sm border p-6">
      <div className="text-label text-legacy mb-3 font-mono uppercase">
        What this does not do
      </div>
      {children}
    </div>
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
        "prose prose-vekto prose-headings:font-serif prose-headings:font-normal max-w-none",
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
