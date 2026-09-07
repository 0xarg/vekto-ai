import Link from "next/link";
import { footerColumns } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NotFound() {
  return (
    <Container width="wide">
      <div className="py-24 sm:py-32">
        <Label className="mb-5">Error 404</Label>
        <h1 className="text-h1 max-w-2xl">That page does not exist.</h1>
        <p className="text-lead text-ink-muted mt-6 max-w-xl">
          It may have moved, or the link that brought you here may be out of
          date. Everything on the site is reachable from below.
        </p>
        <div className="mt-8">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
        </div>

        <div className="border-rule mt-16 grid gap-10 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4">
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
    </Container>
  );
}
