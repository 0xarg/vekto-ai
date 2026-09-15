import { z } from "zod";
import { platforms } from "@/content/platforms";

/**
 * Frontmatter schemas for the four MDX collections.
 *
 * These are validated at module load by the loader, so a malformed or
 * incomplete content file fails the build rather than rendering broken — the
 * same contract the registries in src/content/*.ts use.
 */

const platformIds = platforms.map((p) => p.id) as [string, ...string[]];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

/** Shared across every collection. */
const base = z.object({
  title: z.string().min(8),
  /** Meta description and index-card copy. Keep inside search-result length. */
  description: z.string().min(40).max(300),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  /** Drafts render locally, are noindex, and never reach a production build. */
  status: z.enum(["published", "draft"]).default("draft"),
  /** Pair and solution pages to link to from the body. Enforces the
   *  "articles link up" rule structurally — see the SEO blueprint. */
  relatedMigrations: z.array(z.string()).default([]),
});

/**
 * A figure that appears on the site. `source` is required and non-empty
 * because the signed scope forbids unsourced statistics — this makes that
 * rule a type error rather than a review comment.
 */
const sourcedFigure = z.object({
  label: z.string().min(3),
  value: z.string().min(1),
  source: z
    .string()
    .min(
      10,
      "Every figure needs a source. Scope forbids unsourced statistics.",
    ),
});

export const caseStudySchema = base.extend({
  /** Anonymised is fine — "a global life-sciences manufacturer". */
  customer: z.string().min(3),
  industry: z.string().min(3),
  sourcePlatform: z.enum(platformIds),
  targetPlatform: z.enum(platformIds),
  estateSize: z.string().min(3),
  duration: z.string().min(3),
  results: z.array(sourcedFigure).min(1),
  quote: z
    .object({
      text: z.string().min(20),
      attribution: z.string().min(3),
      /** Written permission must be on file before a quote is published. */
      permissionOnFile: z.literal(true),
    })
    .optional(),
});

export const resourceSchema = base.extend({
  category: z.enum(["guide", "comparison", "field-notes", "reference"]),
  /** Named author. Author identity is a real ranking input for technical
   *  content, and anonymous technical writing reads as untrustworthy. */
  author: z.object({
    name: z.string().min(3),
    role: z.string().min(3),
  }),
});

export const useCaseSchema = base.extend({
  /** The trigger, in the buyer's own words. */
  trigger: z.string().min(15),
  sourcePlatform: z.enum(platformIds).optional(),
});

export const solutionSchema = base.extend({
  /** Controls order on the /solutions index. */
  order: z.number().int().positive(),
  bestFit: z.string().min(20),
});

export const schemas = {
  "case-studies": caseStudySchema,
  resources: resourceSchema,
  "use-cases": useCaseSchema,
  solutions: solutionSchema,
} as const;

export type Collection = keyof typeof schemas;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type UseCase = z.infer<typeof useCaseSchema>;
export type Solution = z.infer<typeof solutionSchema>;

export type FrontmatterOf<C extends Collection> = z.infer<(typeof schemas)[C]>;
