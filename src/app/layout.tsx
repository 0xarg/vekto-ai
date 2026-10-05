import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * No webfonts. The type stack is Apple's own — SF Pro Display, SF Pro Text and
 * SF Mono — reached through the system font stack in globals.css, because those
 * faces are not licensed for webfont use. The site downloads no font files at
 * all; see the `--font-*` block there for the fallback chain on other
 * platforms.
 */

import { site } from "@/lib/site";
import { GROUND_HEX } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

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
    <html lang="en">
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
