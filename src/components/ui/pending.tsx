import { cn } from "@/lib/utils";

/**
 * A visible placeholder for content the client still owes us.
 *
 * The scope document forbids fabricated customers, logos and statistics, so
 * nothing invents filler to cover a gap. Instead the gap is drawn on the page
 * in preview builds, which turns the Vercel preview URL into a live checklist
 * of what is outstanding. Renders nothing in production.
 */
/**
 * Whether outstanding-content markers render in this build. Exported so the
 * section-level wrapper cannot drift from the marker's own rule.
 */
export function pendingVisible() {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
  return env !== "production";
}

export function Pending({
  item,
  owner = "Vekto",
  due,
  note,
  className,
}: {
  item: string;
  owner?: "Vekto" | "Anurag";
  due?: string;
  note?: string;
  className?: string;
}) {
  if (!pendingVisible()) return null;

  return (
    <div
      data-pending-content
      className={cn(
        "border-warn-line bg-warn-soft rounded-sm border border-dashed p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-label text-warn font-mono uppercase">
          Awaiting content
        </span>
        <span className="text-label text-ink-faint font-mono">
          owner: {owner}
          {due ? ` · due ${due}` : ""}
        </span>
      </div>
      <p className="text-ink mt-2 text-sm font-medium">{item}</p>
      {note && <p className="text-ink-muted mt-1 text-sm">{note}</p>}
    </div>
  );
}
