import { z } from "zod";
import { getPlatform, type Platform } from "./platforms";

/**
 * The migration pair is the atomic unit of this site.
 *
 * Adding a supported path is one object in `raw` below — the route, the
 * sitemap entry, the /migrations index card, the breadcrumb and the JSON-LD
 * all follow from it. No other file needs editing.
 *
 * `status` gates publication:
 *   "published" — client has confirmed we support and can speak to this path
 *   "draft"     — scaffolded, awaiting confirmation; excluded from production
 *                 builds and from the sitemap entirely
 */
const migrationSchema = z.object({
  source: z.string(),
  target: z.string(),
  status: z.enum(["published", "draft"]),
  /** Page H1. Descriptive of the path, never a performance claim. */
  headline: z.string().min(10),
  /** Meta description and index-card copy. */
  summary: z.string().min(40).max(300),
  /** Concrete artifacts the migration has to deal with on the source side.
   *  Used to build the "what we handle" section. Factual inventory only. */
  sourceArtifacts: z.array(z.string()).min(1),
});

export type MigrationInput = z.infer<typeof migrationSchema>;

export type Migration = MigrationInput & {
  slug: string;
  sourcePlatform: Platform;
  targetPlatform: Platform;
};

const raw: MigrationInput[] = [
  {
    source: "tibco",
    target: "azure-logic-apps",
    // Confirmed by the customer case study the client supplied for this path.
    status: "published",
    headline: "Migrating TIBCO BusinessWorks to Azure Logic Apps",
    summary:
      "How VektoForge reads an existing TIBCO BusinessWorks estate, maps its processes onto Azure Logic Apps and Azure Integration Services, and what remains a human decision.",
    sourceArtifacts: [
      "BusinessWorks processes and sub-processes",
      "XPath and XSLT transformations",
      "JMS and HTTP activities",
      "EMS destinations and queues",
    ],
  },
  {
    source: "tibco",
    target: "boomi",
    status: "draft",
    headline: "Migrating TIBCO BusinessWorks to Boomi",
    summary:
      "How VektoForge reads an existing TIBCO BusinessWorks estate, maps its processes onto Boomi Integration, and what remains a human decision.",
    sourceArtifacts: [
      "BusinessWorks processes and sub-processes",
      "XPath and XSLT transformations",
      "JMS and HTTP activities",
    ],
  },
];

/** Draft pairs are scaffolding. They never reach production. */
const includeDrafts = process.env.NODE_ENV !== "production";

export const migrations: Migration[] = z
  .array(migrationSchema)
  .parse(raw)
  .map((m) => ({
    ...m,
    slug: `${m.source}-to-${m.target}`,
    sourcePlatform: getPlatform(m.source),
    targetPlatform: getPlatform(m.target),
  }))
  .filter((m) => includeDrafts || m.status === "published");

export function getMigration(slug: string): Migration | undefined {
  return migrations.find((m) => m.slug === slug);
}

export const publishedMigrations = migrations.filter(
  (m) => m.status === "published",
);
