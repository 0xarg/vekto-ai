import Link from "next/link";
import { agents } from "@/content/agents";
import { stageIndex } from "@/lib/derived";
import { cn } from "@/lib/utils";

/**
 * The five-stage pipeline, as one continuous bus.
 *
 * This is the site's single canonical picture of how the product works. It
 * replaced three separate ones that all rendered the same five registry agents
 * in different shapes — a ruled dark strip on `/platform` and the pair pages, a
 * bespoke five-cell rail on each agent page, and the rail inside `AgentRail` —
 * which meant a change to the pipeline was a change in three places and was
 * never made in three places.
 *
 * Everything it draws resolves from `src/content/agents.ts`: the stage count,
 * the ordering, the names, and the input and output counts. There is no numeral
 * here that is not a `length` (non-negotiable #6).
 *
 * On motion. Two things animate and both are marks, both run on load, and
 * neither gates anything: the bus draws itself once, and a pulse travels it
 * continuously. Every label, count and link is in the server-rendered HTML and
 * is visible on arrival — the animation is the line arriving, never the
 * content. The resting state of the draw is the finished drawing, so an
 * instant or failed animation leaves the pipeline simply there.
 */

type Variant = "overview" | "rail" | "position";

/** One mark per item, the quantity drawn rather than claimed. */
function Ticks({
  count,
  pole,
  delay = 0,
}: {
  count: number;
  pole: "source" | "target";
  delay?: number;
}) {
  return (
    <span aria-hidden className="flex items-center gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "animate-tick-rise block h-2.5 w-0.5",
            pole === "source" ? "bg-legacy" : "bg-accent",
          )}
          style={{ animationDelay: `${delay + i * 60}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * The bus itself: one drawn line plus one travelling pulse, as two strokes.
 *
 * They have to be two. `animate-draw` sets `stroke-dasharray: 1` to normalise
 * the draw, and the pulse needs a short dash of its own — one stroke cannot
 * carry both patterns. Laying the pulse over the drawn line is also what makes
 * it read as something moving *along* the bus rather than the bus flickering.
 *
 * It is positioned as a hairline strip pinned to the centre of the stage marks
 * — `top: 5px` for a 2px-tall strip puts the line through the middle of a
 * 12px dot sitting at the top of its row — rather than as a layer stretched
 * over the whole list. Stretching it meant the line's position depended on how
 * tall the copy underneath happened to be, which is how it ended up running
 * below the marks instead of through them.
 *
 * `preserveAspectRatio="none"` with a 2-unit cross axis is what keeps the
 * stroke exactly 1px: the scale on that axis is 1, and a line's thickness
 * follows the axis across it. Caps are butt rather than round, because a round
 * cap under a very non-uniform scale draws a distorted blob.
 *
 * `vector-effect: non-scaling-stroke` must not be added: it stops `pathLength`
 * normalising the dash array, which is what both animations depend on.
 */
function Bus({
  orientation,
  fill = false,
}: {
  orientation: "horizontal" | "vertical";
  /** Add a third stroke that fills with scroll position. Overview only — in
   *  the rail, `current` already says where you are, and two things saying it
   *  disagree the moment one of them lags. */
  fill?: boolean;
}) {
  const horizontal = orientation === "horizontal";
  const d = horizontal ? "M 0 1 L 100 1" : "M 1 0 L 1 100";

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute",
        // `w-full` / `h-full` rather than relying on the inset alone: an SVG
        // carrying a viewBox is a replaced element with an intrinsic size, so
        // `left:0; right:0` with `width:auto` resolves to that intrinsic width
        // — 100px — instead of stretching. The size has to be stated.
        horizontal ? "inset-x-0 h-0.5 w-full" : "inset-y-0 h-full w-0.5",
      )}
      style={horizontal ? { top: "5px" } : { left: "5px" }}
      preserveAspectRatio="none"
      viewBox={horizontal ? "0 0 100 2" : "0 0 2 100"}
    >
      <path
        d={d}
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="animate-draw"
      />
      <path
        d={d}
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="animate-bus-pulse text-accent"
      />
      {/* A third stroke, filling as the band is read. Same normalised-dash
          contract as the two above, driven by scroll position rather than by
          time. Its resting state is the complete stroke, so where
          `animation-timeline` is unsupported — Firefox stable today — this is
          simply the drawn bus in the target pole, which is what it is at the
          end of its range anyway. */}
      {fill && (
        <path
          d={d}
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="fill-on-scroll text-accent"
        />
      )}
    </svg>
  );
}

/**
 * `overview` — the whole pipeline at a glance, horizontal from `md` up and
 * stacked below it. This is the form that goes at the top of a page.
 */
function Overview() {
  return (
    <ol className="relative grid gap-5 md:grid-cols-5 md:gap-4">
      {/* Horizontal on the wide layout, vertical on the stacked one. Both are
          rendered and CSS picks — a single element whose orientation changed
          would need the breakpoint in JavaScript.

          The bus spans the whole row rather than stopping at the last stage
          mark, and that is deliberate. Ending it exactly on the last dot is
          expressible — `100% - (100% - 4rem) / 5` — but only by hard-coding
          this grid's column count and its `gap-4` into the geometry, so
          changing the gap would silently move the line off the marks. A rail
          the stages sit on is the more robust object, and it claims nothing
          either way. */}
      <div className="text-rule-strong pointer-events-none absolute inset-0 hidden md:block">
        <Bus orientation="horizontal" fill />
      </div>
      <div className="text-rule-strong pointer-events-none absolute inset-0 md:hidden">
        <Bus orientation="vertical" fill />
      </div>

      {agents.map((agent, i) => (
        <li key={agent.slug} className="relative flex gap-4 md:block">
          {/* The stage mark sits on the bus, filled with the ground's own
              colour so the line appears to pass behind it. */}
          <span
            aria-hidden
            className="bg-ground border-accent relative mt-1 block h-3 w-3 shrink-0 rounded-full border-2 md:mt-0 md:mb-7"
          />
          <div className="min-w-0 flex-1">
            <span className="text-ink-faint font-mono text-xs">
              {stageIndex(agent.step)}
            </span>
            <h3 className="font-display mt-1 text-base font-semibold">
              <Link
                href={`/agents/${agent.slug}`}
                className="hover:text-accent transition-colors"
              >
                {agent.name}
              </Link>
            </h3>
            <p className="text-ink-muted mt-1.5 text-xs leading-snug">
              {agent.role}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Ticks
                count={agent.inputs.length}
                pole="source"
                delay={300 + i * 90}
              />
              <Ticks
                count={agent.outputs.length}
                pole="target"
                delay={360 + i * 90}
              />
              <span className="text-ink-faint font-mono text-[0.6875rem]">
                {agent.inputs.length} in &middot; {agent.outputs.length} out
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * `rail` — vertical and compact, for the pinned panel in `AgentRail`.
 *
 * `current` marks which stage is being read. It is decoration: every stage's
 * own heading, copy, diagram and ledger lives in the scrolling panels beside
 * this and is in the HTML on arrival. With JavaScript off, `current` stays at
 * the first stage and the rail simply stops following — which is the line
 * between an observer that decorates and one that gates.
 */
function Rail({ current }: { current: number }) {
  return (
    <div className="relative">
      <div className="text-rule-strong pointer-events-none absolute inset-0">
        <Bus orientation="vertical" />
      </div>
      <ol className="relative space-y-6">
        {agents.map((agent, i) => {
          const active = i === current;
          return (
            <li key={agent.slug} className="flex items-start gap-4">
              <span
                aria-hidden
                className={cn(
                  "bg-ground relative mt-1 block h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-300",
                  active ? "border-accent bg-accent" : "border-rule-strong",
                )}
              />
              <Link
                href={`/agents/${agent.slug}`}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "min-w-0 transition-colors duration-200",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs transition-colors duration-200",
                    active ? "text-accent" : "text-ink-faint",
                  )}
                >
                  {stageIndex(agent.step)}
                </span>
                <span className="font-display block text-base font-semibold">
                  {agent.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * `position` — a single row marking one of five, for an agent detail page.
 * States where in the sequence you are and nothing else.
 */
function Position({ current }: { current: number }) {
  // No bus here. The cells are opaque and butt against each other, so a line
  // behind them would be a line nobody can see; the lattice hairlines are the
  // structure at this size.
  return (
    <nav aria-label="Pipeline stages">
      <ol className="lattice grid grid-cols-5 overflow-hidden rounded-md">
        {agents.map((agent, i) => {
          const active = i === current;
          return (
            <li key={agent.slug}>
              <Link
                href={`/agents/${agent.slug}`}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "block px-3 py-2.5 text-center transition-colors",
                  active
                    ? "bg-accent text-accent-ink"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                <span className="block font-mono text-[0.6875rem]">
                  {stageIndex(agent.step)}
                </span>
                <span className="mt-0.5 block truncate text-xs font-medium">
                  {agent.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PipelineFlow({
  variant = "overview",
  current = 0,
  className,
}: {
  variant?: Variant;
  /** Zero-based stage index. Ignored by `overview`. */
  current?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {variant === "overview" ? (
        <Overview />
      ) : variant === "rail" ? (
        <Rail current={current} />
      ) : (
        <Position current={current} />
      )}
    </div>
  );
}
