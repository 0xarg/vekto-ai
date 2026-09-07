import { z } from "zod";

/**
 * Integration platforms referenced across the site. Names and vendors are
 * factual; nothing here asserts a capability.
 */
const platformSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  shortName: z.string(),
  vendor: z.string(),
  /** Which side of a migration this platform usually sits on. */
  role: z.enum(["source", "target", "both"]),
});

export type Platform = z.infer<typeof platformSchema>;

const raw: Platform[] = [
  // ---- Legacy / source estates -------------------------------------------
  {
    id: "tibco",
    name: "TIBCO BusinessWorks",
    shortName: "TIBCO",
    vendor: "TIBCO Software",
    role: "source",
  },
  {
    id: "webmethods",
    name: "Software AG webMethods",
    shortName: "webMethods",
    vendor: "Software AG",
    role: "source",
  },
  {
    id: "oracle-soa",
    name: "Oracle SOA Suite",
    shortName: "Oracle SOA",
    vendor: "Oracle",
    role: "source",
  },
  {
    id: "ibm-ace",
    name: "IBM App Connect Enterprise",
    shortName: "IBM ACE",
    vendor: "IBM",
    role: "source",
  },

  // ---- Modern / target platforms -----------------------------------------
  {
    id: "mulesoft",
    name: "MuleSoft Anypoint Platform",
    shortName: "MuleSoft",
    vendor: "Salesforce",
    role: "target",
  },
  {
    id: "azure-logic-apps",
    name: "Azure Logic Apps",
    shortName: "Logic Apps",
    vendor: "Microsoft",
    role: "target",
  },
  {
    id: "boomi",
    name: "Boomi Integration",
    shortName: "Boomi",
    vendor: "Boomi",
    role: "target",
  },
  {
    id: "ibm-sterling",
    name: "IBM Sterling Integration",
    shortName: "IBM Sterling",
    vendor: "IBM",
    role: "target",
  },
];

export const platforms = z.array(platformSchema).parse(raw);

const byId = new Map(platforms.map((p) => [p.id, p]));

export function getPlatform(id: string): Platform {
  const found = byId.get(id);
  if (!found) throw new Error(`Unknown platform id: "${id}"`);
  return found;
}
