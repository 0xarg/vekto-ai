import { site, staticRoutes } from "@/lib/site";
import { publishedMigrations } from "@/content/migrations";
import { agents } from "@/content/agents";
import { absoluteUrl } from "@/lib/utils";

/**
 * /llms.txt — a plain-text map of the site for answer engines.
 * Generated from the same registries as the sitemap, so it cannot drift.
 */
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.product} is the product. It runs a five-stage agent pipeline over an existing integration estate: ${agents.map((a) => a.name).join(", ")}.`,
    "",
    "## Core pages",
    "",
    ...staticRoutes.map((r) => `- [${r}](${absoluteUrl(r)})`),
    "",
    "## Agent pipeline",
    "",
    ...agents.map(
      (a) => `- [${a.name}](${absoluteUrl(`/agents/${a.slug}`)}): ${a.role}`,
    ),
  ];

  if (publishedMigrations.length > 0) {
    lines.push(
      "",
      "## Migration paths",
      "",
      ...publishedMigrations.map(
        (m) =>
          `- [${m.sourcePlatform.name} to ${m.targetPlatform.name}](${absoluteUrl(`/migrations/${m.slug}`)}): ${m.summary}`,
      ),
    );
  }

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
