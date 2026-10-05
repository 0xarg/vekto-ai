import type { Agent } from "@/content/agents";

/**
 * One diagram per pipeline stage.
 *
 * These are hand-authored forms, not one chart fed five ways, and that is the
 * whole point: `inputs.length` is 2 and `outputs.length` is 3 for every agent in
 * the registry, so anything keyed on those counts draws the same shape five
 * times — which is exactly what the bar-tick graphic these replace did.
 *
 * What varies is what each stage *does*, so each diagram states that: Discovery
 * finds a graph with loose ends in it, Analysis routes artifacts into three
 * dispositions, Transformation maps one side onto the other, Validation overlays
 * two behaviors and marks where they part, Reporting stacks a row per artifact
 * with how it was handled.
 *
 * None of them carries a numeral or an axis. They say what the stage's output
 * is shaped like, which is true; they do not claim a quantity, which would need
 * a source (non-negotiable #6). Colour is `currentColor` except where the
 * source/target poles are the actual subject.
 */

const stroke = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <svg
      className="diagram"
      viewBox="0 0 180 110"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** Discovery — a dependency graph, with the orphans it also turns up. */
function Discovery() {
  const nodes: [number, number][] = [
    [30, 34],
    [68, 20],
    [62, 62],
    [102, 42],
    [106, 82],
    [144, 30],
    [148, 68],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 6],
  ];
  return (
    <Svg label="A dependency graph of connected artifacts, with two unresolved references left detached.">
      <g stroke="currentColor" opacity={0.42} {...stroke}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            pathLength={1}
            className="animate-draw"
            style={{ animationDelay: `${120 + i * 70}ms` }}
          />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            className="animate-mark-in"
            style={{
              transformOrigin: `${x}px ${y}px`,
              animationDelay: `${i * 70}ms`,
            }}
          />
        ))}
      </g>
      {/* The unresolved references. Dashed and detached, because that is what
          the stage reports them as. */}
      <g stroke="var(--legacy)" strokeDasharray="3 3" {...stroke}>
        <circle cx={22} cy={88} r={4} />
        <circle cx={166} cy={98} r={4} />
      </g>
    </Svg>
  );
}

/** Analysis — one inventory routed into three dispositions. */
function Analysis() {
  const lanes = [24, 56, 88];
  return (
    <Svg label="An artifact inventory fanning into three lanes: maps cleanly, needs restructuring, and needs a human decision.">
      <g fill="currentColor" opacity={0.5}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={10}
            y={24 + i * 13}
            width={22}
            height={7}
            rx={1.5}
            className="animate-mark-in"
            style={{
              transformOrigin: `21px ${27 + i * 13}px`,
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </g>
      <g stroke="currentColor" opacity={0.45} {...stroke}>
        {lanes.map((y, i) => (
          <path
            key={i}
            d={`M40 56 C 72 56, 76 ${y}, 108 ${y}`}
            pathLength={1}
            className="animate-draw"
            style={{ animationDelay: `${260 + i * 110}ms` }}
          />
        ))}
      </g>
      {/* Three terminals, three different marks — the dispositions are not
          interchangeable, so they must not look it. */}
      <rect x={118} y={19} width={11} height={11} rx={2} fill="var(--accent)" />
      <rect
        x={118}
        y={51}
        width={11}
        height={11}
        rx={2}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <g stroke="var(--legacy)" {...stroke}>
        <rect x={118} y={83} width={11} height={11} rx={2} />
        <line x1={121} y1={88.5} x2={126} y2={88.5} />
      </g>
    </Svg>
  );
}

/** Transformation — the source side mapped onto the target side. */
function Transformation() {
  return (
    <Svg label="Source-platform artifacts mapped onto target-platform implementations, one of them splitting in two.">
      <g fill="var(--legacy)" opacity={0.75}>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={12}
            y={22 + i * 28}
            width={34}
            height={14}
            rx={2.5}
            className="animate-mark-in"
            style={{
              transformOrigin: `29px ${29 + i * 28}px`,
              animationDelay: `${i * 70}ms`,
            }}
          />
        ))}
      </g>
      <g stroke="currentColor" opacity={0.5} {...stroke}>
        <path
          d="M50 29 C 80 29, 84 25, 128 25"
          pathLength={1}
          className="animate-draw"
          style={{ animationDelay: "220ms" }}
        />
        {/* One source artifact becoming two target ones. The description calls
            these the non-mechanical conversions; this is that, drawn. */}
        <path
          d="M50 57 C 80 57, 84 53, 128 53"
          pathLength={1}
          className="animate-draw"
          style={{ animationDelay: "300ms" }}
        />
        <path
          d="M50 57 C 80 57, 84 81, 128 81"
          pathLength={1}
          className="animate-draw"
          style={{ animationDelay: "380ms" }}
        />
        <path
          d="M50 85 C 76 85, 80 95, 128 95"
          pathLength={1}
          className="animate-draw"
          style={{ animationDelay: "460ms" }}
        />
      </g>
      <g fill="var(--accent)">
        {[18, 46, 74, 88].map((y, i) => (
          <rect
            key={i}
            x={132}
            y={y}
            width={34}
            height={14}
            rx={2.5}
            className="animate-mark-in"
            style={{
              transformOrigin: `149px ${y + 7}px`,
              animationDelay: `${420 + i * 70}ms`,
            }}
          />
        ))}
      </g>
    </Svg>
  );
}

/** Validation — two behaviors overlaid, and the place they part. */
function Validation() {
  const source = "M12 70 L36 70 L52 44 L78 44 L96 62 L124 62 L140 38 L168 38";
  const target = "M12 70 L36 70 L52 44 L78 44 L96 62 L124 62 L140 86 L168 86";
  return (
    <Svg label="The source behavior and the generated behavior overlaid, coincident until one point where they diverge.">
      <path
        d={source}
        stroke="var(--legacy)"
        pathLength={1}
        className="animate-draw"
        {...stroke}
        strokeWidth={2}
        style={{ animationDelay: "80ms" }}
      />
      {/* No `pathLength` on this one. It normalises the path to a length of 1,
          which would make a 4/3 dash pattern longer than the whole path and
          render it solid — and the dashes are how the generated trace is told
          apart from the source trace where the two coincide. */}
      <path
        d={target}
        stroke="var(--accent)"
        strokeDasharray="4 3"
        {...stroke}
        strokeWidth={2}
      />
      {/* The delta. The ranked list of differences is this stage's whole output,
          so the diagram's subject is the gap, not the agreement. */}
      <line
        x1={154}
        y1={38}
        x2={154}
        y2={86}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      <circle
        cx={154}
        cy={62}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="animate-mark-in"
        style={{ transformOrigin: "154px 62px", animationDelay: "760ms" }}
      />
    </Svg>
  );
}

/** Reporting — a row per artifact, with how each was handled. */
function Reporting() {
  const rows = [0, 1, 2, 3, 4];
  return (
    <Svg label="A ledger with one row per artifact and its disposition, the last row still outstanding.">
      <g>
        {rows.map((i) => {
          const y = 18 + i * 17;
          const outstanding = i === rows.length - 1;
          return (
            <g
              key={i}
              className="animate-mark-in"
              style={{
                transformOrigin: `90px ${y + 5}px`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <rect
                x={14}
                y={y}
                width={118}
                height={11}
                rx={2}
                fill="currentColor"
                opacity={outstanding ? 0.16 : 0.3}
              />
              <rect
                x={20}
                y={y + 4}
                width={i % 2 ? 62 : 84}
                height={3}
                rx={1.5}
                fill="currentColor"
                opacity={0.5}
              />
              {outstanding ? (
                <rect
                  x={142}
                  y={y}
                  width={11}
                  height={11}
                  rx={2}
                  fill="none"
                  stroke="var(--legacy)"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
              ) : (
                <rect
                  x={142}
                  y={y}
                  width={11}
                  height={11}
                  rx={2}
                  fill="var(--accent)"
                />
              )}
            </g>
          );
        })}
      </g>
    </Svg>
  );
}

const byStage: Record<string, () => React.ReactElement> = {
  discovery: Discovery,
  analysis: Analysis,
  transformation: Transformation,
  validation: Validation,
  reporting: Reporting,
};

export function AgentDiagram({ agent }: { agent: Agent }) {
  // A stage added to the registry without a diagram renders nothing rather than
  // falling back to a generic one — a wrong diagram is worse than none.
  const Diagram = byStage[agent.slug];
  return Diagram ? <Diagram /> : null;
}
