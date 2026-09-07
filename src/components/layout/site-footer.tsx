import Link from "next/link";
import { footerColumns, pendingFooterItems, site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { Pending } from "@/components/ui/pending";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-rule bg-surface-2 border-t">
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.5fr_3fr]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="text-ink-muted mt-4 text-sm leading-relaxed">
              {site.shortDescription}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <Label className="mb-4">{column.heading}</Label>
                <ul className="space-y-2.5">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-ink-muted hover:text-accent text-sm transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-rule flex flex-col gap-4 border-t py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-faint text-sm">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-ink-faint text-sm">
            {pendingFooterItems.map((i) => i.label).join(" · ")} — pending
          </p>
        </div>

        <Pending
          className="mb-10"
          item="Privacy Policy and Terms of Service copy"
          due="18 Sep"
          note="Held out of the footer as real links until the text exists. Linking to empty legal pages is worse than not linking."
        />
      </Container>
    </footer>
  );
}
