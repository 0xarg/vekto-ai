import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

import { schemas, type Collection, type FrontmatterOf } from "./schemas";

/**
 * The only module that touches the filesystem.
 *
 * Everything else consumes typed entries, so moving the content layer to a
 * headless CMS later means rewriting this file and nothing else.
 *
 * Frontmatter is validated on read. A malformed file throws with the filename
 * and the failing field, which fails the build rather than shipping a broken
 * page.
 */

const CONTENT_ROOT = join(process.cwd(), "content");

export type Entry<C extends Collection> = {
  slug: string;
  frontmatter: FrontmatterOf<C>;
  /** Raw MDX body, ready to hand to <MDXRemote />. */
  body: string;
};

/** Drafts are visible locally so work in progress can be reviewed, and are
 *  stripped from production the same way draft migration pairs are. */
const includeDrafts = process.env.NODE_ENV !== "production";

const cache = new Map<Collection, Entry<Collection>[]>();

function readCollection<C extends Collection>(collection: C): Entry<C>[] {
  const dir = join(CONTENT_ROOT, collection);

  let filenames: string[];
  try {
    filenames = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    // A collection with no directory yet is empty, not an error — the index
    // page renders its Pending marker instead.
    return [];
  }

  const entries = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = readFileSync(join(dir, filename), "utf8");
    const { data, content } = matter(raw);

    const parsed = schemas[collection].safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid frontmatter in content/${collection}/${filename}:\n${issues}`,
      );
    }

    return {
      slug,
      frontmatter: parsed.data as FrontmatterOf<C>,
      body: content,
    };
  });

  return entries
    .filter((e) => includeDrafts || e.frontmatter.status === "published")
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    );
}

export function getCollection<C extends Collection>(collection: C): Entry<C>[] {
  if (!cache.has(collection)) {
    cache.set(collection, readCollection(collection) as Entry<Collection>[]);
  }
  return cache.get(collection) as Entry<C>[];
}

export function getEntry<C extends Collection>(
  collection: C,
  slug: string,
): Entry<C> | undefined {
  return getCollection(collection).find((e) => e.slug === slug);
}

/** Only published entries are advertised to crawlers. */
export function getPublished<C extends Collection>(collection: C): Entry<C>[] {
  return getCollection(collection).filter(
    (e) => e.frontmatter.status === "published",
  );
}
