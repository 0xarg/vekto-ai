import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { site } from "@/lib/site";
import { GROUND_HEX, GROUND_HEX_DARK, THEME_STORAGE_KEY } from "@/lib/seo";
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
 * the two things it does not.
 *
 * `themeColor` paints the phone browser's own chrome to match the page ground,
 * which is the difference between the site ending at the viewport edge and
 * ending in a grey band that belongs to nothing. `viewportFit: "cover"` is what
 * makes `env(safe-area-inset-*)` resolve to real numbers on a notched device —
 * the mobile nav sheet's bottom padding depends on it.
 *
 * `colorScheme` used to be here, set to `"light"`, with a note calling it
 * honest rather than aspirational because the site had one surface set and the
 * dark tokens were band scoping rather than a theme. Both halves of that have
 * changed: there is a theme now, and `colorScheme` has moved into globals.css,
 * where it can track the attribute we actually set. As a viewport key it
 * resolves against the OS preference, which would have handed a reader on
 * OS-dark the dark scrollbars and form controls over a light page.
 *
 * `themeColor` has the same problem and cannot fully escape it. The `media`
 * keys below resolve against the OS, not against our `data-theme`, so a reader
 * on OS-light who opts into dark gets a light address bar over a dark page.
 * This is the best a static value can do; ThemeToggle closes the gap by
 * rewriting the live meta tag when the theme actually changes.
 *
 * Still a static object rather than `generateViewport`: nothing here depends on
 * the request, and viewport cannot stream, so a dynamic one would block the
 * shell.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: GROUND_HEX },
    { media: "(prefers-color-scheme: dark)", color: GROUND_HEX_DARK },
  ],
  viewportFit: "cover",
};

/**
 * Resolve the theme before the first paint.
 *
 * Parser-blocking on purpose — no `async`, no `defer`, and first in the body,
 * so it runs before anything is painted and `document.documentElement` already
 * exists. Deferring it would mean a light frame before a dark page, which is
 * worse than no dark mode at all.
 *
 * It always writes the attribute rather than only writing it for dark. That
 * gives one invariant the toggle's read path can rely on: by paint time, the
 * attribute is present and says which theme is live. Anything other than the
 * literal "dark" resolves to light, so a corrupted or hand-edited storage
 * value cannot produce a dark first paint.
 *
 * With JavaScript off nothing is written and `:root`'s own light values apply,
 * which is exactly the rule: light is what everyone gets until they ask.
 */
const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* `suppressHydrationWarning` belongs on <html> and nowhere else: the script
       below mutates exactly one attribute on exactly this element, so this
       covers the one mismatch it creates and hides nothing else. */
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
