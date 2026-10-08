import { migrations, publishedMigrations } from "@/content/migrations";
import { Label } from "@/components/ui/label";
import { CodeCard } from "@/components/sections/code-transform";

/**
 * The hero's principal composition: the artifact classes read on the source
 * side, the specimen they produce, and the target they land on — drawn as a
 * node graph rather than listed.
 *
 * This replaced a two-column hero whose right half was one frosted card on the
 * aura. The note that card carried said the full code figure had been moved out
 * because "the headline was competing with it"; this arrangement removes the
 * competition structurally rather than by shrinking the figure, because the
 * composition is underneath the headline instead of beside it.
 *
 * Everything it names resolves from `src/content/migrations.ts`: the four node
 * labels are the pair's `sourceArtifacts` strings verbatim, the centre is the
 * pair's own specimen, and the target node is the registry's platform name and
 * the specimen's declared output language. There is no label here that is not a
 * registry string, and no numeral at all (non-negotiable #6).
 *
 * The asymmetry — four nodes converging on one — is the registry's claim, not a
 * composition choice: four artifact classes are read and one workflow is
 * generated. It also happens to be the right shape for the poles, which are
 * deliberately no longer symmetric in presence.
 *
 * ## Geometry
 *
 * The node positions and the connector endpoints have to agree at every width,
 * and they are different coordinate systems — the nodes are DOM elements
 * positioned in percentages, the connectors are SVG user units. They agree
 * because every position below is authored as a percentage and converted into
 * the viewBox by `vx`/`vy`, and because the node that the connectors have to
 * touch is sized in percent (`w-[34%]`) rather than in rem. A `max-w-sm` card
 * would be 512 viewBox units at one container width and 439 at another, and the
 * connectors would gap or overlap depending on the display.
 *
 * The viewBox is 1600×900 against an `aspect-[16/9]` box, so the scale is
 * uniform and a stroke keeps its weight. That is also why
 * `vector-effect: non-scaling-stroke` is neither needed nor permitted here — it
 * would stop `pathLength` normalising the dash array, which is what both the
 * draw-on and the pulse depend on.
 *
 * Below `md` the whole canvas becomes a stacked list and the SVG is dropped. A
 * node graph at 320px is unreadable, and the connectors would be drawing
 * between elements that are no longer where the percentages say they are.
 *
 * ## Motion
 *
 * The connectors draw themselves on load and a pulse runs each one, both on the
 * `pathLength="1"` contract the pipeline bus established. The whole graph then
 * drifts as one rigid layer over the aura — see `GRAPH_DRIFT` for why it cannot
 * be four layers at four rates. Every node label is server-rendered text at
 * full opacity and none of it waits for a scroll.
 */

/** Percentage → viewBox units. 1600×700 so the scale stays uniform at 16/7.
 *  The viewBox aspect has to follow the box aspect: the moment they disagree
 *  the scale is non-uniform and a 2px stroke renders at two different weights
 *  depending on which way it runs. */
const vx = (p: number) => p * 16;
const vy = (p: number) => p * 7;

/** Right edge of the source column — where its connectors leave from. */
const SOURCE_X = 25;
/** The centre card's own edges. Must match its `w-[34%]` centred at 50%. */
const CARD_LEFT = 33;
const CARD_RIGHT = 67;
/** Left edge of the target node. */
const TARGET_X = 79;
const TARGET_Y = 44;

/**
 * Deliberately not evenly spaced. An even column reads as a list that happens
 * to be drawn; an uneven one reads as a graph, which is what this is.
 */
const SOURCE_Y = [14, 36, 62, 85];

/**
 * The graph drifts as ONE rigid layer, not as four.
 *
 * Per-node parallax was the first attempt and it is wrong here, for a reason
 * worth recording: a connector is a static path between two points, so the
 * moment its two endpoints travel at different rates the line detaches from
 * the cards it is drawn between. There is no path that interpolates between
 * two different transforms.
 *
 * It is also not what the reference does. weave.figma.com parallaxes the layers
 * of its *unconnected* compositions — scattered chips around a centre image —
 * and moves its hero node graph as a single object. Depth in a connected graph
 * comes from the graph travelling against the field behind it, which is what
 * this is: the aura is on the wrapper and stays put, the graph moves over it.
 *
 * The per-layer version of the device lives where it belongs — the problem
 * cards and the engagement row, which have no lines between them.
 */
const GRAPH_DRIFT = "1.25rem";

/** A node's label and body. Glass is legal here because the canvas is an
 *  aura — and it is the strong step, because `--ink-faint` fails on the plain
 *  one and `Label` is `--ink-faint` by definition. */
function Node({
  kicker,
  children,
  pole,
  className,
}: {
  kicker: string;
  children: React.ReactNode;
  pole: "source" | "target";
  className?: string;
}) {
  return (
    <div className={`glass-strong rounded-md px-3.5 py-2.5 ${className ?? ""}`}>
      <Label className="mb-1.5 flex items-center gap-1.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            pole === "source" ? "bg-legacy" : "bg-accent"
          }`}
        />
        {kicker}
      </Label>
      <p className="text-ink text-xs leading-snug">{children}</p>
    </div>
  );
}

export function ArtifactCanvas({ className }: { className?: string }) {
  const migration = publishedMigrations[0] ?? migrations[0];
  if (!migration?.specimen) return null;

  const { specimen, sourcePlatform, targetPlatform, sourceArtifacts } =
    migration;

  // The column never draws more rows than it has positions for, and never a
  // position with no artifact behind it.
  const artifacts = sourceArtifacts.slice(0, SOURCE_Y.length);

  const sourceNodes = artifacts.map((artifact, i) => ({
    artifact,
    y: SOURCE_Y[i],
  }));

  return (
    <div
      className={`aura-hero relative min-w-0 overflow-clip rounded-2xl ${className ?? ""}`}
    >
      {/* The grid sits under the graph and over the aura. Nothing here is
          running copy — the node labels are on `.glass-strong` cards, which is
          their own measured surface — so this is decoration behind a
          composition, which is the only place the grid is allowed. */}
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-70"
      />
      {/* ---------------- Wide: the graph ---------------- */}
      <div
        className="drift relative hidden aspect-[16/7] w-full md:block"
        style={{ "--drift": GRAPH_DRIFT } as React.CSSProperties}
      >
        {/* The connectors. Drawn first so the nodes sit over the line ends,
            which is what makes a connector read as attached rather than as a
            stroke pointing at a card. */}
        <svg
          aria-hidden
          className="text-rule-strong pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1600 700"
          fill="none"
        >
          {sourceNodes.map(({ y }, i) => {
            // Control points pull horizontally only, so every curve leaves and
            // arrives flat and the fan reads as one bundle.
            const d = `M ${vx(SOURCE_X)} ${vy(y)} C ${vx(SOURCE_X + 5)} ${vy(y)}, ${vx(CARD_LEFT - 5)} ${vy(50)}, ${vx(CARD_LEFT)} ${vy(50)}`;
            return (
              <g key={i}>
                <path
                  d={d}
                  pathLength="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-draw"
                  style={{ animationDelay: `${160 + i * 110}ms` }}
                />
                {/* The pulse has to be its own stroke: `animate-draw` owns
                    `stroke-dasharray`, and one stroke cannot carry two dash
                    patterns. Same contract as the pipeline bus. */}
                <path
                  d={d}
                  pathLength="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-bus-pulse text-legacy"
                  style={{ animationDelay: `${i * 380}ms` }}
                />
                <circle
                  cx={vx(SOURCE_X)}
                  cy={vy(y)}
                  r="5"
                  fill="currentColor"
                  className="animate-mark-in"
                  style={{
                    transformOrigin: `${vx(SOURCE_X)}px ${vy(y)}px`,
                    animationDelay: `${160 + i * 110}ms`,
                  }}
                />
              </g>
            );
          })}

          {/* Centre to target. One stroke, in the target pole, because this is
              the half of the picture that has already happened. */}
          <path
            d={`M ${vx(CARD_RIGHT)} ${vy(50)} C ${vx(CARD_RIGHT + 6)} ${vy(50)}, ${vx(TARGET_X - 6)} ${vy(TARGET_Y)}, ${vx(TARGET_X)} ${vy(TARGET_Y)}`}
            pathLength="1"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-draw"
            style={{ animationDelay: "620ms" }}
          />
          <path
            d={`M ${vx(CARD_RIGHT)} ${vy(50)} C ${vx(CARD_RIGHT + 6)} ${vy(50)}, ${vx(TARGET_X - 6)} ${vy(TARGET_Y)}, ${vx(TARGET_X)} ${vy(TARGET_Y)}`}
            pathLength="1"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-bus-pulse text-accent"
          />
          <circle
            cx={vx(TARGET_X)}
            cy={vy(TARGET_Y)}
            r="5"
            fill="currentColor"
            className="animate-mark-in"
            style={{
              transformOrigin: `${vx(TARGET_X)}px ${vy(TARGET_Y)}px`,
              animationDelay: "620ms",
            }}
          />
        </svg>

        {/* ---- Source nodes. The positioning transform is on the outer box and
                the parallax on the inner one, because `.drift` sets `transform`
                and the two would otherwise overwrite each other. ---- */}
        {sourceNodes.map(({ artifact, y }) => (
          <div
            key={artifact}
            className="absolute w-56 -translate-x-full -translate-y-1/2 pr-3 lg:w-64"
            style={{ left: `${SOURCE_X}%`, top: `${y}%` }}
          >
            <Node kicker={`Source · ${sourcePlatform.shortName}`} pole="source">
              {artifact}
            </Node>
          </div>
        ))}

        {/* ---- The specimen. Sized in percent so the connector endpoints above
                stay on its edges at every width. ---- */}
        <div className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2">
          <CodeCard className="max-w-none" />
        </div>

        {/* ---- The target. ---- */}
        <div
          className="absolute w-48 -translate-y-1/2 pl-3 lg:w-56"
          style={{ left: `${TARGET_X}%`, top: `${TARGET_Y}%` }}
        >
          <Node kicker={`Target · ${specimen.targetLanguage}`} pole="target">
            {targetPlatform.name}
          </Node>
        </div>
      </div>

      {/* ---------------- Narrow: the same nodes, stacked ----------------
          Not a fallback — the same registry strings in document order, which is
          what the graph is saying anyway. The connectors are the only thing
          lost, and a connector between stacked rows is a vertical line. */}
      <div className="flex min-w-0 flex-col gap-3 p-5 md:hidden">
        {artifacts.map((artifact) => (
          <Node
            key={artifact}
            kicker={`Source · ${sourcePlatform.shortName}`}
            pole="source"
          >
            {artifact}
          </Node>
        ))}
        <CodeCard className="max-w-none" />
        <Node kicker={`Target · ${specimen.targetLanguage}`} pole="target">
          {targetPlatform.name}
        </Node>
      </div>
    </div>
  );
}
