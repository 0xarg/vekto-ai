/**
 * Single source of truth for site identity and information architecture.
 *
 * Navigation, the footer and the sitemap are all generated from the structures
 * below. A link can only point at a route declared here, which is what makes
 * the dead-link problem of the previous site structurally impossible.
 */

export const site = {
  name: "Vekto AI",
  product: "VektoForge",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vektoai.com",
  locale: "en_US",
  /** Factual and structural only — no performance claims until the client
   *  supplies evidence for them. See lib/content/pending.ts. */
  description:
    "Vekto AI migrates enterprise integrations off legacy middleware using AI agents that read your existing implementation and produce working code on a modern platform.",
  shortDescription:
    "AI-agent-driven migration for enterprise integration platforms.",
} as const;

export const cta = {
  primary: { label: "Get a Migration Assessment", href: "/contact" },
  secondary: { label: "Book a Demo", href: "/contact#demo" },
} as const;

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

/** Static routes that always exist. Dynamic segments are added by the sitemap
 *  from their respective registries and content collections. */
export const staticRoutes = [
  "/",
  "/platform",
  "/agents",
  "/migrations",
  "/solutions",
  "/use-cases",
  "/case-studies",
  "/security",
  "/resources",
  "/pricing",
  "/about",
  "/contact",
] as const;

export type StaticRoute = (typeof staticRoutes)[number];

/* -------------------------------------------------------------------------- */
/* Primary navigation                                                          */
/* -------------------------------------------------------------------------- */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  /** Landing page for the group. Every dropdown has one — no dead parents. */
  href: string;
  items: NavLink[];
};

export const primaryNav: NavGroup[] = [
  {
    label: "Platform",
    href: "/platform",
    items: [
      {
        label: "VektoForge overview",
        href: "/platform",
        description: "How the platform is put together, end to end.",
      },
      {
        label: "The five agents",
        href: "/agents",
        description:
          "Discovery, Analysis, Transformation, Validation, Reporting.",
      },
      {
        label: "Security & trust",
        href: "/security",
        description: "Where your code runs, what is retained, who can see it.",
      },
    ],
  },
  {
    label: "Migrations",
    href: "/migrations",
    items: [
      {
        label: "All migration paths",
        href: "/migrations",
        description: "Every source and target platform pair we support.",
      },
      {
        label: "Solutions",
        href: "/solutions",
        description: "Modernisation programmes by shape of problem.",
      },
      {
        label: "Use cases",
        href: "/use-cases",
        description: "What teams actually run on VektoForge.",
      },
    ],
  },
  {
    label: "Evidence",
    href: "/case-studies",
    items: [
      {
        label: "Case studies",
        href: "/case-studies",
        description: "Migrations we have run, with numbers.",
      },
      {
        label: "Resources",
        href: "/resources",
        description: "Guides, comparisons and technical writing.",
      },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About Vekto", href: "/about", description: "Who builds this." },
      {
        label: "Engagement models",
        href: "/pricing",
        description: "How to work with us.",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Talk to an engineer.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export type FooterColumn = {
  heading: string;
  items: NavLink[];
};

/**
 * Every entry resolves to a real page. Legal routes are included only once the
 * client supplies the copy — see `pendingFooterItems` below, which is rendered
 * separately and visibly in non-production builds.
 */
export const footerColumns: FooterColumn[] = [
  {
    heading: "Platform",
    items: [
      { label: "VektoForge", href: "/platform" },
      { label: "AI agents", href: "/agents" },
      { label: "Security & trust", href: "/security" },
      { label: "Engagement models", href: "/pricing" },
    ],
  },
  {
    heading: "Migrations",
    items: [
      { label: "All migration paths", href: "/migrations" },
      { label: "Solutions", href: "/solutions" },
      { label: "Use cases", href: "/use-cases" },
    ],
  },
  {
    heading: "Evidence",
    items: [
      { label: "Case studies", href: "/case-studies" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** Held back until the client provides the text. Rendering these as live links
 *  before they exist is how the previous site ended up with 20 dead hrefs. */
export const pendingFooterItems: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
