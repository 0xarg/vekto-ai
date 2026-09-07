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
  /** Concrete artefacts the migration has to deal with on the source side.
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
    target: "mulesoft",
    // Named explicitly in the signed scope document.
    status: "published",
    headline: "Migrating TIBCO BusinessWorks to MuleSoft Anypoint",
    summary:
      "How VektoForge reads an existing TIBCO BusinessWorks estate, maps its processes and transformations onto MuleSoft Anypoint, and what remains a human decision.",
    sourceArtifacts: [
      "BusinessWorks processes and sub-processes",
      "XPath and XSLT transformations",
      "JMS, HTTP and JDBC activities",
      "Shared resources and connection profiles",
      "EMS destinations and queues",
    ],
  },
  {
    source: "webmethods",
    target: "mulesoft",
    status: "draft",
    headline: "Migrating Software AG webMethods to MuleSoft Anypoint",
    summary:
      "How VektoForge reads a webMethods Integration Server estate, maps flow services and document types onto MuleSoft Anypoint, and what remains a human decision.",
    sourceArtifacts: [
      "Flow services and Java services",
      "Document types and IS schemas",
      "Broker and Universal Messaging destinations",
      "Adapters and connection aliases",
    ],
  },
  {
    source: "oracle-soa",
    target: "mulesoft",
    status: "draft",
    headline: "Migrating Oracle SOA Suite to MuleSoft Anypoint",
    summary:
      "How VektoForge reads an Oracle SOA Suite estate, maps BPEL processes and mediator routing onto MuleSoft Anypoint, and what remains a human decision.",
    sourceArtifacts: [
      "BPEL processes",
      "Mediator routing rules",
      "XSLT and XQuery transformations",
      "Adapter configurations",
      "Business rules",
    ],
  },
  {
    source: "tibco",
    target: "azure-logic-apps",
    status: "draft",
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
    source: "ibm-ace",
    target: "mulesoft",
    status: "draft",
    headline: "Migrating IBM App Connect Enterprise to MuleSoft Anypoint",
    summary:
      "How VektoForge reads an IBM ACE and Integration Bus estate, maps message flows and ESQL onto MuleSoft Anypoint, and what remains a human decision.",
    sourceArtifacts: [
      "Message flows and subflows",
      "ESQL compute nodes",
      "Message sets and DFDL models",
      "MQ queues and channels",
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
