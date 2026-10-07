#!/usr/bin/env node
/**
 * Lists every <Pending> and <PendingSection> marker in the app — the content
 * the client (or we) still owe — sorted by due date, with overdue items
 * flagged.
 *
 * The markers are the source of truth. They render on preview deploys and
 * disappear in production, so this script and the preview URL agree.
 *
 * With one qualification. Some markers are guards rather than debts — the ones
 * on a collection index that fire only when the collection is empty, or only
 * when it holds a draft. On /case-studies both are satisfied today: there is a
 * published study and no drafts, so neither renders, and a flat scan of the
 * source still reported two items the client did not owe. A checklist nobody
 * trusts is not a checklist.
 *
 * So the guards are resolved against the content directory rather than guessed
 * at. Being inside a conditional is not the test — /use-cases carries the same
 * shape of guard and it genuinely does render, because that collection really
 * is empty. What matters is whether the condition currently holds, and for
 * every guard of this shape that is a fact about `content/`.
 *
 * Anything guarded that this cannot resolve stays in the owed list. Reporting a
 * debt that turns out to be satisfied costs a question; hiding one costs a
 * launch.
 *
 *   pnpm pending
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

/**
 * The state of each MDX collection: how many entries exist, and how many are
 * drafts. `status` defaults to draft in the schema, so a missing field counts
 * as one here too.
 */
function readCollections() {
  const out = {};
  for (const name of ["case-studies", "solutions", "use-cases", "resources"]) {
    const dir = join(ROOT, "content", name);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    } catch {
      // The directory does not exist yet, which is itself the empty case.
    }
    const drafts = files.filter(
      (f) =>
        !/^status:\s*"published"/m.test(readFileSync(join(dir, f), "utf8")),
    ).length;
    out[`/${name}`] = { total: files.length, drafts };
  }
  return out;
}

const collections = readCollections();

/**
 * The JSX condition this marker sits inside, if any.
 *
 * Walks back to the `{` that opens the marker's expression and returns the text
 * between there and the marker. Reading the condition is the point: an earlier
 * version of this classified markers by their prose, which put the /solutions
 * draft guard in the wrong bucket because its wording does not match the other
 * three. The four collection index pages all spell their conditions the same
 * way, and the code is what actually decides what renders.
 */
function guardHead(source, at) {
  let depth = 0;
  for (let i = at - 1; i >= 0 && at - i < 4000; i--) {
    const c = source[i];
    if (c === "}") depth++;
    else if (c === "{") {
      if (depth === 0) return source.slice(i, at);
      depth--;
    }
  }
  return "";
}

/**
 * Would this marker actually render right now?
 *
 * Returns true only when the guard can be shown to be false — the content it
 * was waiting for has landed. An unrecognised guard, or none, is a debt.
 */
function isSatisfiedGuard(head, where) {
  const state = collections[where];
  if (!state) return false;
  // `xs.some(x => x.frontmatter.status === "draft") && <Pending/>`
  if (/\.some\([^)]*\)|draft/.test(head)) return state.drafts === 0;
  // `xs.length === 0 ? <Pending/> : …`
  if (/\.length\s*===?\s*0/.test(head)) return state.total > 0;
  return false;
}

const items = [];
for (const file of walk(join(ROOT, "src"))) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/<Pending(?:Section)?\b[\s\S]*?\/>/g)) {
    const block = match[0];
    const item = prop(block, "item");
    if (!item) continue;
    items.push({
      item,
      owner: prop(block, "owner") ?? "Vekto",
      due: prop(block, "due"),
      head: guardHead(source, match.index),
      where:
        relative(ROOT, file)
          .replace(/^src\/app\//, "/")
          .replace(/\/page\.tsx$/, "") || "/",
    });
  }
}

const parseDue = (due) => {
  if (!due) return Number.POSITIVE_INFINITY;
  const [day, mon] = due.split(" ");
  const m = MONTHS.indexOf(mon);
  return m < 0
    ? Number.POSITIVE_INFINITY
    : new Date(2026, m, Number(day)).getTime();
};

items.sort((a, b) => parseDue(a.due) - parseDue(b.due));

const today = new Date();
today.setHours(0, 0, 0, 0);

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

for (const it of items) it.conditional = isSatisfiedGuard(it.head, it.where);

const owed = items.filter((it) => !it.conditional);
const guards = items.filter((it) => it.conditional);

let overdue = 0;
console.log(`\n${bold(`${owed.length} outstanding content items`)}\n`);

for (const it of owed) {
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
  console.log(
    red(bold(`${overdue} of ${owed.length} are past their due date.\n`)),
  );
}

if (guards.length > 0) {
  console.log(
    dim(
      `${guards.length} further marker(s) are satisfied guards — the content ` +
        `they were waiting for has landed, so they no longer render:\n`,
    ),
  );
  for (const it of guards) {
    console.log(dim(`    ${it.item}`));
    console.log(dim(`    ${it.owner} · ${it.where}\n`));
  }
}
