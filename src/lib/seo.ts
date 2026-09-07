import type { Metadata } from "next";
import { site } from "./site";
import { absoluteUrl } from "./utils";

type BuildMetadataArgs = {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/migrations/tibco-to-mulesoft". */
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
