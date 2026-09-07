import type { MetadataRoute } from "next";
import { staticRoutes } from "@/lib/site";
import { publishedMigrations } from "@/content/migrations";
import { agents } from "@/content/agents";
import { absoluteUrl } from "@/lib/utils";

/** Priority weighting by route depth and commercial intent. */
const priorities: Record<string, number> = {
  "/": 1,
  "/platform": 0.9,
  "/migrations": 0.9,
  "/contact": 0.8,
  "/agents": 0.8,
  "/security": 0.8,
  "/case-studies": 0.7,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priorities[route] ?? 0.6,
  }));

  // Only confirmed migration pairs are advertised to crawlers.
  const migrationPages = publishedMigrations.map((m) => ({
    url: absoluteUrl(`/migrations/${m.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const agentPages = agents.map((a) => ({
    url: absoluteUrl(`/agents/${a.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...statics, ...migrationPages, ...agentPages];
}
