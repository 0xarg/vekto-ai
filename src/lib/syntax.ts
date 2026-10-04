/**
 * A tokenizer for the two languages the hero specimen renders: the source
 * platform's XML and the generated target's JSON.
 *
 * Hand-rolled rather than `shiki` or `prism` on purpose. A highlighter ships its
 * own themes, and a theme is a list of hardcoded hex values — which
 * non-negotiable #5 forbids and which would put the one piece of the page
 * carrying the most color outside the token system. Owning ~80 lines means every
 * class here resolves to a `--d-syntax-*` token like everything else, and
 * `pnpm contrast` can measure them.
 *
 * It is deliberately not a parser. It never has to handle arbitrary input: the
 * samples live in `src/content/migrations.ts`, are fixed at build time, and are
 * reviewed by a human before they land.
 */

export type TokenKind = "tag" | "attr" | "value" | "punct" | "plain";

export type Token = { readonly text: string; readonly kind: TokenKind };

/** Tailwind classes per kind. `plain` inherits the panel's body color. */
export const tokenClass: Record<TokenKind, string> = {
  tag: "text-syntax-tag",
  attr: "text-syntax-attr",
  value: "text-syntax-value",
  punct: "text-syntax-punct",
  plain: "",
};

function push(out: Token[], text: string, kind: TokenKind) {
  if (!text) return;
  const last = out[out.length - 1];
  // Merge runs of the same kind so the rendered markup stays small.
  if (last && last.kind === kind) {
    out[out.length - 1] = { text: last.text + text, kind };
    return;
  }
  out.push({ text, kind });
}

function tokenizeXmlLine(line: string): Token[] {
  const out: Token[] = [];
  // `inTag` tracks whether we are between `<` and `>`, which is what decides
  // whether a bare word is an attribute name or ordinary text content.
  let i = 0;
  let inTag = false;

  while (i < line.length) {
    const rest = line.slice(i);

    const open = /^<\/?/.exec(rest);
    if (open && !inTag) {
      push(out, open[0], "punct");
      i += open[0].length;
      const name = /^[\w:.-]+/.exec(line.slice(i));
      if (name) {
        push(out, name[0], "tag");
        i += name[0].length;
      }
      inTag = true;
      continue;
    }

    const close = /^\/?>/.exec(rest);
    if (close && inTag) {
      push(out, close[0], "punct");
      i += close[0].length;
      inTag = false;
      continue;
    }

    const quoted = /^"[^"]*"|^'[^']*'/.exec(rest);
    if (quoted && inTag) {
      push(out, quoted[0], "value");
      i += quoted[0].length;
      continue;
    }

    const attr = /^[\w:.-]+(?=\s*=)/.exec(rest);
    if (attr && inTag) {
      push(out, attr[0], "attr");
      i += attr[0].length;
      continue;
    }

    push(out, line[i], inTag && line[i] === "=" ? "punct" : "plain");
    i += 1;
  }

  return out;
}

function tokenizeJsonLine(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    const str = /^"(?:[^"\\]|\\.)*"/.exec(rest);
    if (str) {
      // A string followed by a colon is a property name, not a value.
      const isKey = /^\s*:/.test(line.slice(i + str[0].length));
      push(out, str[0], isKey ? "tag" : "value");
      i += str[0].length;
      continue;
    }

    const literal = /^(-?\d+(?:\.\d+)?|true|false|null)\b/.exec(rest);
    if (literal) {
      push(out, literal[0], "value");
      i += literal[0].length;
      continue;
    }

    push(out, line[i], /[{}[\],:]/.test(line[i]) ? "punct" : "plain");
    i += 1;
  }

  return out;
}

/**
 * Splits `code` into lines and tokenizes each one. Lines rather than one flat
 * list because the panel numbers them and staggers their highlight, both of
 * which need the line boundary.
 */
export function tokenize(code: string, language: "xml" | "json"): Token[][] {
  const perLine = language === "xml" ? tokenizeXmlLine : tokenizeJsonLine;
  return code.replace(/\t/g, "  ").split("\n").map(perLine);
}
