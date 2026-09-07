import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";

export type Crumb = { name: string; path: string };

/**
 * Interior page header. Emits BreadcrumbList JSON-LD from the same trail it
 * renders, so the visible breadcrumb and the structured data cannot disagree.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <>
      {crumbs.length > 0 && <JsonLd schema={breadcrumbSchema(trail)} />}
      <section className="border-rule border-b">
        <Container width="wide">
          <div className="py-14 sm:py-20">
            {crumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="text-ink-faint flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  {trail.map((crumb, i) => {
                    const last = i === trail.length - 1;
                    return (
                      <li
                        key={crumb.path}
                        className="flex items-center gap-1.5"
                      >
                        {last ? (
                          <span className="text-ink-muted" aria-current="page">
                            {crumb.name}
                          </span>
                        ) : (
                          <Link
                            href={crumb.path}
                            className="hover:text-accent transition-colors"
                          >
                            {crumb.name}
                          </Link>
                        )}
                        {!last && (
                          <ChevronRight
                            className="h-3 w-3 shrink-0"
                            aria-hidden
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            {eyebrow && <Label className="mb-5">{eyebrow}</Label>}
            <h1 className="text-h1 max-w-4xl">{title}</h1>
            {lede && (
              <p className="text-lead text-ink-muted mt-6 max-w-2xl">{lede}</p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </Container>
      </section>
    </>
  );
}
