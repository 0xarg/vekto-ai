/**
 * The conceptual diagrams — the problem cards and the engagement models.
 *
 * These are deliberately NOT chart-shaped, and that is a content rule rather
 * than a style one. A bar chart asserts a measurement, and these have no
 * measurement behind them: there is no source for "how far a manual rewrite
 * gets" because we have not measured it. Non-negotiable #6 permits decorative
 * surface and forbids asserting something untrue, so these say something
 * structural — a track that runs off the frame, estimates that do not agree,
 * the gaps between known things — and carry no axis, no scale and no numeral.
 *
 * The agent diagrams in `agent-diagram.tsx` are the opposite case: their shape
 * comes from the registry, so they are allowed to look like data.
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

/**
 * Manual rewrites do not finish. A track of segments, partly done, running off
 * the right edge — and a second track starting underneath, because the estate
 * keeps changing while the work is going on.
 */
function Unfinishable() {
  const seg = (y: number, done: number, delay: number) => (
    <g>
      {Array.from({ length: 9 }).map((_, i) => {
        // Falls off toward the right rather than stopping at an end marker. A
        // marker would imply a known total, and therefore a percentage
        // complete, which is a figure nobody has measured.
        const falloff = Math.max(0, 1 - i / 9);
        return (
          <rect
            key={i}
            x={12 + i * 19}
            y={y}
            width={14}
            height={9}
            rx={2}
            fill="currentColor"
            opacity={(i < done ? 0.85 : 0.18) * falloff}
            className="animate-mark-in"
            style={{
              transformOrigin: `${19 + i * 19}px ${y + 4.5}px`,
              animationDelay: `${delay + i * 55}ms`,
            }}
          />
        );
      })}
    </g>
  );
  return (
    <Svg label="A track of work partly completed, running off the edge of the frame, with a second track beginning beneath it.">
      {seg(26, 4, 0)}
      {seg(52, 2, 240)}
      {seg(78, 1, 480)}
    </Svg>
  );
}

/**
 * Estimates are guesses. Four spans for the same piece of work, none agreeing,
 * and no axis beneath them — because there is no measured number here, only the
 * disagreement.
 */
function Divergent() {
  const spans: [number, number][] = [
    [22, 74],
    [38, 140],
    [16, 108],
    [52, 166],
  ];
  return (
    <Svg label="Four estimates of the same work, each a different span, none agreeing with the others.">
      {spans.map(([x1, x2], i) => {
        const y = 24 + i * 21;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="currentColor"
              opacity={0.55}
              pathLength={1}
              className="animate-draw"
              style={{ animationDelay: `${i * 130}ms` }}
              {...stroke}
              strokeWidth={2}
            />
            <line
              x1={x1}
              y1={y - 5}
              x2={x1}
              y2={y + 5}
              stroke="currentColor"
              opacity={0.55}
              {...stroke}
            />
            <line
              x1={x2}
              y1={y - 5}
              x2={x2}
              y2={y + 5}
              stroke="currentColor"
              opacity={0.55}
              {...stroke}
            />
          </g>
        );
      })}
    </Svg>
  );
}

/**
 * Risk sits in the gaps. A graph where the lit elements are the missing edges,
 * not the nodes — the failures are not in the flows anyone remembers.
 */
function Gaps() {
  const nodes: [number, number][] = [
    [26, 28],
    [68, 20],
    [112, 32],
    [152, 24],
    [34, 76],
    [76, 86],
    [120, 74],
    [158, 84],
  ];
  const solid: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [4, 5],
    [0, 4],
    [2, 6],
  ];
  const missing: [number, number][] = [
    [5, 6],
    [6, 7],
    [1, 5],
  ];
  return (
    <Svg label="A graph of known connections, with the unmapped gaps between them picked out.">
      <g stroke="currentColor" opacity={0.28} {...stroke}>
        {solid.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      {/* The subject. Drawn last, in the source pole, so the eye lands on the
          absence rather than on the structure around it.

          Not dashed: `animate-draw` owns `stroke-dasharray` to do the drawing,
          and a CSS dasharray beats the presentation attribute, so the two
          cannot both apply. Weight and colour carry the distinction instead. */}
      <g stroke="var(--legacy)" {...stroke} strokeWidth={2.5}>
        {missing.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            pathLength={1}
            className="animate-draw"
            style={{ animationDelay: `${300 + i * 160}ms` }}
          />
        ))}
      </g>
      <g fill="currentColor" opacity={0.45}>
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.5} />
        ))}
      </g>
    </Svg>
  );
}

/**
 * Who drives the migration — as a position on a track, not as a proportion.
 *
 * The first version of this drew a filled bar at 85/50/20 percent, which is a
 * fabricated statistic in a costume: we have never measured what share of a
 * migration each model involves, and a filled bar states that we have. What the
 * engagement content does support is an *ordering* — the three models differ in
 * how much your team owns, and they differ monotonically. So this marks one of
 * three positions and claims nothing about the distance between them.
 */
function Drive({ position }: { position: 0 | 1 | 2 }) {
  const stops = [34, 90, 146];
  const labels = ["run by us", "shared", "run by your team"];
  return (
    <Svg
      label={`Where this model sits between a migration run by us and one run by your team: ${labels[position]}.`}
    >
      <line
        x1={20}
        y1={55}
        x2={160}
        y2={55}
        stroke="currentColor"
        opacity={0.22}
        {...stroke}
        strokeWidth={2}
      />
      {stops.map((cx, i) => (
        <circle
          key={i}
          cx={cx}
          cy={55}
          r={i === position ? 9 : 4}
          fill={i === position ? "var(--accent)" : "currentColor"}
          opacity={i === position ? 1 : 0.28}
          className={i === position ? "animate-mark-in" : undefined}
          style={
            i === position
              ? { transformOrigin: `${cx}px 55px`, animationDelay: "120ms" }
              : undefined
          }
        />
      ))}
      {/* The two ends of the track, so the position has something to be
          relative to. No scale between them, because there is not one. */}
      <g stroke="currentColor" opacity={0.4} {...stroke}>
        <line x1={20} y1={47} x2={20} y2={63} />
        <line x1={160} y1={47} x2={160} y2={63} />
      </g>
    </Svg>
  );
}

const byName = {
  unfinishable: () => <Unfinishable />,
  divergent: () => <Divergent />,
  gaps: () => <Gaps />,
  "drive-full": () => <Drive position={0} />,
  "drive-shared": () => <Drive position={1} />,
  "drive-partner": () => <Drive position={2} />,
} as const;

export type ConceptName = keyof typeof byName;

export function ConceptDiagram({ name }: { name: ConceptName }) {
  const Diagram = byName[name];
  return Diagram ? <Diagram /> : null;
}
