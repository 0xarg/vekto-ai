import { z } from "zod";

/**
 * The five-stage agent pipeline. Stage names and ordering are taken from the
 * client's existing product material. Descriptions state what each stage does;
 * none of them assert a speed, cost or accuracy figure. Those belong on the
 * page only once the client has supplied evidence.
 */
const agentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** 1-indexed position in the pipeline. */
  step: z.number().int().positive(),
  name: z.string(),
  /** One line, used in nav, cards and the pipeline strip. */
  role: z.string().min(20).max(140),
  /** Two or three sentences for the detail page intro. */
  description: z.string().min(80),
  /** What the stage consumes. */
  inputs: z.array(z.string()).min(1),
  /** What the stage produces for the next stage or for a human. */
  outputs: z.array(z.string()).min(1),
});

export type Agent = z.infer<typeof agentSchema>;

const raw: Agent[] = [
  {
    slug: "discovery",
    step: 1,
    name: "Discovery",
    role: "Inventories the existing integration estate and its dependencies.",
    description:
      "Discovery connects to the source platform and builds a complete inventory of what exists: processes, services, transformations, endpoints, queues and the connections between them. It produces the dependency graph that every later stage reads from. Nothing is changed at this stage.",
    inputs: [
      "Source platform export or repository access",
      "Deployment and environment configuration",
    ],
    outputs: [
      "Full artefact inventory",
      "Dependency graph across processes and resources",
      "Unresolved or orphaned reference list",
    ],
  },
  {
    slug: "analysis",
    step: 2,
    name: "Analysis",
    role: "Classifies each artefact by complexity and migration approach.",
    description:
      "Analysis reads the inventory and classifies every artefact: what maps cleanly onto the target platform, what needs restructuring, and what has no direct equivalent and will require a human decision. This is the stage that produces the honest scope of the migration rather than an estimate.",
    inputs: ["Artefact inventory from Discovery", "Target platform selection"],
    outputs: [
      "Per-artefact complexity classification",
      "Mapping strategy for each pattern",
      "Explicit list of items requiring human decisions",
    ],
  },
  {
    slug: "transformation",
    step: 3,
    name: "Transformation",
    role: "Generates target-platform implementations from the source estate.",
    description:
      "Transformation converts classified artefacts into working implementations on the target platform, following the mapping strategy produced by Analysis. Output is source code and configuration in the target platform's own formats, intended to be reviewed, versioned and owned by your team.",
    inputs: [
      "Classification and mapping strategy from Analysis",
      "Target platform conventions and naming standards",
    ],
    outputs: [
      "Target-platform source code and configuration",
      "Transformation and mapping logic",
      "Notes on every non-mechanical conversion",
    ],
  },
  {
    slug: "validation",
    step: 4,
    name: "Validation",
    role: "Checks generated implementations against the original behaviour.",
    description:
      "Validation compares the generated implementation against the behaviour of the source estate, checks it against the target platform's own rules, and surfaces the differences. Its purpose is to make the gap between old and new explicit rather than to declare the migration finished.",
    inputs: [
      "Generated implementations from Transformation",
      "Source behaviour captured during Discovery",
    ],
    outputs: [
      "Behavioural comparison results",
      "Target platform conformance findings",
      "Ranked list of differences to resolve",
    ],
  },
  {
    slug: "reporting",
    step: 5,
    name: "Reporting",
    role: "Produces the audit trail and hand-over documentation.",
    description:
      "Reporting assembles the record of the migration: what was found, how each artefact was handled, what was changed by hand and what remains open. This is the artefact your architects review and your auditors ask for.",
    inputs: [
      "Outputs from every preceding stage",
      "Human decisions recorded during the migration",
    ],
    outputs: [
      "Migration audit trail",
      "Per-artefact disposition record",
      "Outstanding items and hand-over notes",
    ],
  },
];

export const agents = z
  .array(agentSchema)
  .parse(raw)
  .sort((a, b) => a.step - b.step);

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}
