#!/usr/bin/env node
/**
 * Lists every <Pending> marker in the app — the content the client (or we)
 * still owe — sorted by due date, with overdue items flagged.
 *
 * The markers are the source of truth. They render on preview deploys and
 * disappear in production, so this script and the preview URL always agree.
 *
 *   pnpm pending
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

/** Pull a prop value whether it is "a string" or {`a template`}. */
function prop(block, name) {
  const quoted = block.match(new RegExp(`${name}="([^"]*)"`));
  if (quoted) return quoted[1];
  const templated = block.match(new RegExp(`${name}=\\{\`([^\`]*)\``));
  if (templated) return templated[1].replace(/\$\{[^}]*\}/g, "…");
  return null;
}

const items = [];
for (const file of walk(join(ROOT, "src"))) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/<Pending\b[\s\S]*?\/>/g)) {
    const block = match[0];
    const item = prop(block, "item");
    if (!item) continue;
    items.push({
      item,
      owner: prop(block, "owner") ?? "Vekto",
      due: prop(block, "due"),
      where: relative(ROOT, file).replace(/^src\/app\//, "/").replace(/\/page\.tsx$/, "") || "/",
    });
  }
}

const parseDue = (due) => {
  if (!due) return Number.POSITIVE_INFINITY;
  const [day, mon] = due.split(" ");
  const m = MONTHS.indexOf(mon);
  return m < 0 ? Number.POSITIVE_INFINITY : new Date(2026, m, Number(day)).getTime();
};

items.sort((a, b) => parseDue(a.due) - parseDue(b.due));

const today = new Date();
today.setHours(0, 0, 0, 0);

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let overdue = 0;
console.log(`\n${bold(`${items.length} outstanding content items`)}\n`);

for (const it of items) {
  const ts = parseDue(it.due);
  const isOverdue = Number.isFinite(ts) && ts < today.getTime();
  if (isOverdue) overdue++;
  const days = Number.isFinite(ts)
    ? Math.round((today.getTime() - ts) / 86400000)
    : null;

  const when = !it.due
    ? dim("no date")
    : isOverdue
      ? red(`${it.due}  (${days}d overdue)`)
      : yellow(it.due);

  console.log(`  ${when}`);
  console.log(`    ${it.item}`);
  console.log(`    ${dim(`${it.owner} · ${it.where}`)}\n`);
}

if (overdue > 0) {
  console.log(red(bold(`${overdue} of ${items.length} are past their due date.\n`)));
}
