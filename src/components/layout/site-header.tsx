"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cta, primaryNav, site } from "@/lib/site";
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

  // Whether the page has scrolled far enough for the island to tighten. One
  // passive listener driving one boolean — deliberately not a scroll-linked
  // animation, which would run work on every frame to save a 150ms transition.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    /* A floating island rather than a full-width bar. It is detached from the
       top edge, so the page visibly scrolls underneath it, and it tightens once
       you are past the hero. `--header-h` and `--header-gap` in globals.css are
       the single source for its geometry — `scroll-padding-top` and the mobile
       sheet's offset both derive from them, because those three used to be
       written out independently and had already drifted apart. */
    <header
      className="sticky z-50 px-4 sm:px-6"
      style={{ top: "var(--header-gap)" }}
    >
      <a
        href="#main"
        className="bg-accent-fill text-accent-ink sr-only rounded-full px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-6 focus:z-50"
      >
        Skip to content
      </a>

      <div
        className={cn(
          "border-rule bg-surface/85 mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border pr-2 pl-5 backdrop-blur-xl",
          "transition-[box-shadow,max-width,height] duration-300 ease-out",
          scrolled ? "shadow-panel max-w-5xl" : "shadow-card",
        )}
        style={{ height: "var(--header-h)" }}
      >
        <>
          <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
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
                      "flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.9375rem] transition-colors duration-150",
                      isActive(group.href)
                        ? "text-ink"
                        : "text-ink-muted hover:text-ink",
                      open && "text-ink",
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
                      className="border-rule bg-surface shadow-menu animate-menu-in absolute top-full left-0 mt-2 w-80 overflow-hidden rounded-xl border"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="border-rule hover:bg-surface-2 group block border-b p-4 transition-colors duration-150 last:border-b-0"
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
        </>
      </div>

      {/* ---------------- Mobile sheet ---------------- */}
      {mobileOpen && (
        <div
          className="border-rule bg-ground fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t lg:hidden"
          style={{
            top: "calc(var(--header-h) + var(--header-gap) * 2)",
          }}
        >
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
