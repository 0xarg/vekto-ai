import { z } from "zod";

/**
 * Homepage FAQ.
 *
 * Every answer here restates something the site already establishes elsewhere —
 * the agent registry, the migration pair registry, the solutions pages' "what
 * this does not solve" sections, the assessment description on /contact. None of
 * it is new claim-making, which is the constraint that decides what can be in
 * this file at all.
 *
 * The six questions on /security are deliberately NOT here. Those ask where
 * agents run, what leaves the network, how long data is retained, whether code
 * trains models, which certifications are held, and who can access an estate.
 * Only the client can answer them, and a plausible-sounding answer to any of
 * them would be the most damaging thing on the site. They stay a `<Pending>`
 * until answered.
 *
 * Answers are plain strings rather than MDX because `faqSchema()` needs text,
 * and an FAQ whose rich-result markup disagrees with the visible copy is worse
 * than having none.
 */
const faqSchemaShape = z.object({
  question: z.string().min(10),
  answer: z.string().min(60),
});

export type FaqEntry = z.infer<typeof faqSchemaShape>;

export const faq: FaqEntry[] = z.array(faqSchemaShape).parse([
  {
    question: "What does a migration assessment actually produce?",
    answer:
      "It runs the first two stages of the pipeline — Discovery and Analysis — against your real estate. You get a complete artifact inventory, the dependency graph across processes and resources, a per-artifact complexity classification, and an explicit list of the items that need a human decision. It replaces an estimate with an inventory.",
  },
  {
    question: "Does VektoForge migrate everything automatically?",
    answer:
      "No, and a vendor who says otherwise has not looked at your estate. Analysis separates what maps cleanly onto the target platform from what needs restructuring and what has no direct equivalent. The third category is handed back as an explicit list rather than silently converted, and Validation exists specifically to make the gap between old and new visible.",
  },
  {
    question: "Who owns the generated code?",
    answer:
      "You do. Transformation emits source code and configuration in the target platform's own formats, intended to be reviewed, versioned and owned by your team. There is no runtime dependency on Vekto after the migration, and nothing is generated into a proprietary format you would need us to read.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "The source and target platforms in our registry are listed on the migrations page, along with which specific source-to-target pairs are documented today. We publish a pair only once we can speak to it, so the documented list is shorter than the list of platforms we can read — that is deliberate.",
  },
  {
    question: "What does this not solve?",
    answer:
      "Migration reproduces the estate you have, including the parts you would rather not have. It does not fix integration designs that were wrong to begin with: a poorly bounded integration moved onto a modern platform is a poorly bounded integration with better tooling around it. Redesign is a separate program, and it is easier once the move is finished.",
  },
  {
    question: "How do you prove the behavior did not change?",
    answer:
      "Validation compares the generated implementation against the behavior captured from the source estate during Discovery, checks it against the target platform's own conformance rules, and produces a ranked list of differences. Reporting then assembles the per-artifact disposition record and audit trail your architects review and your auditors ask for.",
  },
]);
