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
  /**
   * A worked before/after for this path: a representative fragment of the
   * source platform's own format, and the target-platform output generated
   * from it. The homepage renders this as its principal graphic.
   *
   * Optional, and deliberately so. A pair without one renders the diagram
   * specimen instead — a wrong sample is worse than no sample, because this is
   * the one element on the site an integration architect will read line by line
   * looking for a reason to disbelieve it. Both fragments must be accurate to
   * the platform, trimmed rather than invented, and reviewed before they land.
   */
  specimen: z
    .object({
      sourceLanguage: z.enum(["xml", "json"]),
      targetLanguage: z.enum(["xml", "json"]),
      source: z.string().min(40),
      target: z.string().min(40),
      /** Which `sourceArtifacts` entry this fragment demonstrates. */
      demonstrates: z.string(),
    })
    .optional(),
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
    specimen: {
      demonstrates: "JMS and HTTP activities",
      sourceLanguage: "xml",
      targetLanguage: "json",
      source: `<pd:ProcessDefinition name="OrderIntake">
  <pd:startName>ReceiveOrder</pd:startName>
  <pd:activity name="ReceiveOrder">
    <pd:type>com.tibco.plugin.jms.JMSQueueEventSource</pd:type>
    <config>
      <destination>QUEUE.ORDER.INBOUND</destination>
      <sessionAttributes acknowledgeMode="2" />
    </config>
  </pd:activity>
  <pd:activity name="MapToCanonical">
    <pd:type>com.tibco.plugin.mapper.MapperActivity</pd:type>
    <config><stylesheet>order-to-canonical.xslt</stylesheet></config>
  </pd:activity>
  <pd:transition from="ReceiveOrder" to="MapToCanonical" />
</pd:ProcessDefinition>`,
      target: `{
  "definition": {
    "triggers": {
      "When_a_message_is_received": {
        "type": "ServiceBus",
        "inputs": {
          "queueName": "QUEUE.ORDER.INBOUND",
          "autoComplete": false
        }
      }
    },
    "actions": {
      "Map_to_canonical": {
        "type": "Xslt",
        "inputs": { "map": { "name": "order-to-canonical.xslt" } },
        "runAfter": {}
      }
    }
  }
}`,
    },
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
