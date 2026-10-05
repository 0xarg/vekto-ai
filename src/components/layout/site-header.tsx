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

const SHEET_ID = "site-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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

  // The sheet covers the page, so focus has to follow it in and come back out.
  // Without this, tabbing from an open sheet walks the page underneath it,
  // which for a screen-reader or keyboard user means the menu never really
  // opened.
  useEffect(() => {
    if (mobileOpen) {
      sheetRef.current?.focus();
    } else if (document.activeElement === document.body) {
      triggerRef.current?.focus();
    }
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

  // The hover-close timer outlives the component if a pointer leaves the nav
  // as the route changes, so it gets the same cleanup as the listeners.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    /* A floating island rather than a full-width bar. It is detached from the
       top edge, so the page visibly scrolls underneath it, and it tightens once
       you are past the hero. `--header-h` and `--header-gap` in globals.css are
       the single source for its geometry — `scroll-padding-top`, the anchor
       offset and the mobile sheet all derive from them, because those values
       used to be written out independently and had already drifted apart.

       The outer padding matches `Container`'s ladder exactly. It used to be
       `px-4 sm:px-6` against the container's `px-5 sm:px-8`, so the island's
       edge missed the column of content underneath it by 4px on a phone and
       8px above — small, but it is the first thing on the page and it was the
       one element not sitting on the grid. */
    <header
      className="3xl:px-16 sticky z-50 px-5 sm:px-8 lg:px-10"
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
          "border-rule bg-surface/85 mx-auto flex items-center justify-between gap-4 rounded-full border pr-2 pl-5 backdrop-blur-xl lg:gap-6",
          "3xl:max-w-7xl max-w-6xl",
          "transition-[box-shadow,max-width,height] duration-300 ease-out",
          scrolled ? "shadow-panel 3xl:max-w-6xl md:max-w-5xl" : "shadow-card",
        )}
        style={{ height: "var(--header-h)" }}
      >
        <>
          <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
            <Wordmark />
          </Link>

          {/* ---------------- Desktop nav ----------------
              Opens at `md` rather than `lg`. At 820px — an iPad in portrait,
              which is a real share of this audience — the island used to carry
              a wordmark, a hamburger and about 600px of nothing. Four groups
              fit there comfortably; both CTAs do not, so only the primary
              comes along and the secondary waits for `lg`. */}
          <div ref={navRef} className="hidden items-center gap-1 md:flex">
            {primaryNav.map((group, i) => {
              const open = openGroup === group.label;
              // The last group sits against the island's right edge, so a
              // left-anchored 320px panel hangs off it at the narrow end of
              // the desktop range. That one anchors right instead.
              const last = i === primaryNav.length - 1;
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
                      "flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[0.9375rem] transition-colors duration-150 lg:px-3",
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
                      className={cn(
                        "border-rule bg-surface shadow-menu animate-menu-in absolute top-full mt-2 w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border",
                        last ? "right-0" : "left-0",
                      )}
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

          {/* Three steps, because the primary label is 26 characters and the
              island is a fixed-height pill that nothing may spill out of.
              `md` buys the four nav groups, which is the change that matters —
              a tablet used to get a wordmark, a hamburger and 600px of
              nothing. The primary CTA joins at `lg` and the secondary at `xl`,
              each at the width where it actually fits.

              `whitespace-nowrap` here and nowhere else: buttons wrap by
              default across the site, because a full-width CTA in a card has
              the room and clipping it is worse. This is the one surface with a
              fixed height, so a label taking a second line grew the control
              past the pill around it. */}
          <div className="hidden items-center gap-3 lg:flex">
            <ButtonLink
              href={cta.secondary.href}
              variant="ghost"
              size="sm"
              className="hidden whitespace-nowrap xl:inline-flex"
            >
              {cta.secondary.label}
            </ButtonLink>
            <ButtonLink
              href={cta.primary.href}
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
            >
              {cta.primary.label}
            </ButtonLink>
          </div>

          {/* ---------------- Mobile trigger ---------------- */}
          <button
            ref={triggerRef}
            type="button"
            className="text-ink -mr-1 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={SHEET_ID}
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

      {/* ---------------- Mobile sheet ----------------
          `overscroll-contain` stops a flick past the end of the list from
          scrolling the page underneath; the safe-area padding keeps the last
          CTA clear of the home indicator, and depends on `viewportFit:
          "cover"` in the root layout's viewport export. */}
      {mobileOpen && (
        <div
          ref={sheetRef}
          id={SHEET_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          className="border-rule bg-ground fixed inset-x-0 bottom-0 z-40 overflow-y-auto overscroll-contain border-t outline-none md:hidden"
          style={{
            top: "calc(var(--header-h) + var(--header-gap) * 2)",
            paddingBottom: "env(safe-area-inset-bottom)",
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
                            "-mx-2 flex min-h-11 items-center rounded-sm px-2 text-base",
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
