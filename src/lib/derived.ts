import { agents } from "@/content/agents";
import { migrations, publishedMigrations } from "@/content/migrations";
import { platforms } from "@/content/platforms";

/**
 * Quantities computed from the content registries.
 *
 * The design rule for this site is that a numeral may only appear if it
 * resolves from real data — the scope forbids fabricated statistics, and the
 * five unsourced figures on the previous site are the reason. This module is
 * where "real" is defined: every count rendered as design (spec lines, ledger
 * columns, stage readouts) reads from here rather than being typed into markup,
 * so adding a migration pair or a pipeline stage updates the page itself.
 *
 * Nothing here asserts performance. These are inventory, position and polarity
 * — the only quantitative claims the site can currently make honestly.
 */

const sourcePlatforms = platforms.filter(
  (p) => p.role === "source" || p.role === "both",
);
const targetPlatforms = platforms.filter(
  (p) => p.role === "target" || p.role === "both",
);

export const counts = {
  /** Stages in the agent pipeline. */
  pipelineStages: agents.length,
  /** Platforms we read from. */
  sourcePlatforms: sourcePlatforms.length,
  /** Platforms we generate onto. */
  targetPlatforms: targetPlatforms.length,
  /**
   * Pairs the client has confirmed. Draft pairs are stripped from production
   * builds, so in production this equals `paths`; in dev and preview it does
   * not, and the difference is the point — it is the coverage gap, visible.
   */
  publishedPaths: publishedMigrations.length,
  /** Pairs present in this build. */
  paths: migrations.length,
} as const;

/**
 * The hero spec line. Facts about the shape of the product, not claims about
 * its results. Deliberately excludes the published-path count: it reads as "1"
 * in production, and coverage belongs on /migrations where it can be shown
 * against the full matrix rather than stated without context.
 */
export const heroSpec: { value: number; label: string }[] = [
  { value: counts.pipelineStages, label: "pipeline stages" },
  { value: counts.sourcePlatforms, label: "source platforms" },
  { value: counts.targetPlatforms, label: "target platforms" },
];

/** Zero-padded stage index, e.g. `3` → "03". Matches the pipeline strip. */
export function stageIndex(step: number) {
  return String(step).padStart(2, "0");
}

/** `getAgent`-adjacent: the stages either side of a given step, for detail-page
 *  navigation that follows from `step` rather than a hand-maintained order. */
export function adjacentAgents(step: number) {
  return {
    previous: agents.find((a) => a.step === step - 1),
    next: agents.find((a) => a.step === step + 1),
  };
}
