import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { site } from "@/lib/site";
import { GROUND_HEX } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * One webfont, and only one.
 *
 * This reverses the rule that stood here before — "no webfonts", the type stack
 * is Apple's own, the site downloads no font files at all. That rule was ours,
 * not the client's, and it ended with Windows falling back to Georgia and
 * Segoe UI. The client has now named a face directly, by pointing at a site
 * built on Inter, and a named request outranks a self-imposed constraint.
 *
 * `next/font/google` downloads the face at build time and serves it from our
 * own origin, so this adds no runtime request to Google and no layout shift —
 * the privacy and performance properties the old rule was really protecting
 * survive the change. Inter is variable, so one file covers every weight the
 * site uses instead of the five static cuts the reference ships.
 *
 * Mono stays on the system stack. The code specimen needs a monospace face and
 * a second download for it would be weight bought with nothing.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.shortDescription}`,
    template: `%s`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  robots: { index: true, follow: true },
};

/**
 * Next already emits `width=device-width, initial-scale=1`, so this exists for
 * the three things it does not.
 *
 * `themeColor` paints the phone browser's own chrome to match the page ground,
 * which is the difference between the site ending at the viewport edge and
 * ending in a grey band that belongs to nothing. `viewportFit: "cover"` is what
 * makes `env(safe-area-inset-*)` resolve to real numbers on a notched device —
 * the mobile nav sheet's bottom padding depends on it. `colorScheme` is honest
 * rather than aspirational: the site has one surface set, and the dark tokens
 * are band scoping, not a theme.
 *
 * A static object rather than `generateViewport`: nothing here depends on the
 * request, and viewport cannot stream, so a dynamic one would block the shell.
 */
export const viewport: Viewport = {
  themeColor: GROUND_HEX,
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
