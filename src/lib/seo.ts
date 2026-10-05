import type { Metadata } from "next";
import { site } from "./site";
import { absoluteUrl } from "./utils";

/**
 * `--ground` from globals.css, duplicated here because it has to be.
 *
 * This is the one place on the site that breaks non-negotiable #5, and it
 * breaks it because a `<meta name="theme-color">` is read by the browser
 * before any stylesheet and cannot resolve a custom property. Without it the
 * address bar on a phone paints its own grey above an ivory page.
 *
 * So the value is duplicated exactly once, in the open, and `pnpm contrast`
 * asserts it still equals the parsed `--ground`. A silent drift here is the
 * failure mode that block in globals.css already warns about; this makes it a
 * loud one.
 */
export const GROUND_HEX = "#fbfbfd";

type BuildMetadataArgs = {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/migrations/tibco-to-azure-logic-apps". */
  path: string;
  /** Omit for evergreen pages; set for articles and case studies. */
  publishedTime?: string;
  modifiedTime?: string;
  type?: "website" | "article";
  /** Set false for draft/unconfirmed pages so they never get indexed. */
  indexable?: boolean;
};

/**
 * Every page builds its metadata through here. That guarantees a canonical,
 * an OG image and a correctly suffixed title on all of them — the previous
 * site shipped a single unchanging <title> across every route.
 */
export function buildMetadata({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
  type = "website",
  indexable = true,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} — ${site.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
