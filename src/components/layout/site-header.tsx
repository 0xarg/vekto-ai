"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cta, primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Any navigation closes everything. Adjusted during render rather than in an
  // effect — an effect here would cascade an extra render on every route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenGroup(null);
    setMobileOpen(false);
  }

  // Escape closes the open dropdown or the mobile sheet.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenGroup(null);
      setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Clicking outside the nav closes the dropdown.
  useEffect(() => {
    if (!openGroup) return;
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openGroup]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-ground/85 border-rule sticky top-0 z-50 border-b backdrop-blur-md">
      <a
        href="#main"
        className="bg-accent text-accent-ink sr-only rounded-sm px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>

      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label={`${"Vekto AI"} home`}>
            <Wordmark />
          </Link>

          {/* ---------------- Desktop nav ---------------- */}
          <div ref={navRef} className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((group) => {
              const open = openGroup === group.label;
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenGroup(group.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenGroup(open ? null : group.label)}
                    className={cn(
                      "flex h-16 items-center gap-1.5 px-3 text-[0.9375rem] transition-colors",
                      isActive(group.href)
                        ? "text-ink"
                        : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-150",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>

                  {open && (
                    <div
                      className="border-rule bg-surface absolute top-full left-0 w-80 border shadow-[0_12px_32px_-12px_rgb(20_23_26/0.18)]"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="border-rule hover:bg-surface-2 group block border-b p-4 last:border-b-0"
                        >
                          <span className="text-ink group-hover:text-accent block text-[0.9375rem] font-medium transition-colors">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="text-ink-muted mt-1 block text-[0.8125rem] leading-snug">
                              {item.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ButtonLink href={cta.secondary.href} variant="ghost" size="sm">
              {cta.secondary.label}
            </ButtonLink>
            <ButtonLink href={cta.primary.href} variant="primary" size="sm">
              {cta.primary.label}
            </ButtonLink>
          </div>

          {/* ---------------- Mobile trigger ---------------- */}
          <button
            type="button"
            className="text-ink -mr-2 p-2 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* ---------------- Mobile sheet ---------------- */}
      {mobileOpen && (
        <div className="border-rule bg-ground fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t lg:hidden">
          <Container>
            <nav className="py-6">
              {primaryNav.map((group) => (
                <div key={group.label} className="border-rule border-b py-5">
                  <div className="text-label text-ink-faint mb-3 font-mono uppercase">
                    {group.label}
                  </div>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "-mx-2 block rounded-sm px-2 py-2.5 text-base",
                            isActive(item.href)
                              ? "text-accent"
                              : "text-ink hover:bg-surface-2",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col gap-3 py-6">
                <ButtonLink href={cta.primary.href} variant="primary" size="lg">
                  {cta.primary.label}
                </ButtonLink>
                <ButtonLink
                  href={cta.secondary.href}
                  variant="secondary"
                  size="lg"
                >
                  {cta.secondary.label}
                </ButtonLink>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
