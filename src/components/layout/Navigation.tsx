"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const primaryLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/shop", label: "Shop" },
];

const exploreLinks = [
  { href: "/testimonials", label: "Testimonials" },
  { href: "/before-and-after", label: "Before & After" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

// All links for mobile menu
const allLinks = [...primaryLinks, ...exploreLinks];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef(pathname);
  const logoDoc = useQuery(api.siteContent.getByKey, { key: "site_logo" });
  const logoUrl = logoDoc?.imageUrl;
  const logoAlt = logoDoc?.title ?? "MADE Med Spa";

  // /booking no longer has a dark hero (Karlyne 2026-05-12 — burgundy header
  // with the radial glow was removed entirely). The Pabau iframe is white,
  // so the nav needs cream bg + dark text on /booking, same as any other
  // content-first page.
  // /services no longer has a hero (opens on the filter bar), so the nav uses
  // its solid cream bar there instead of a transparent overlay.
  const heroOverlayRoutes = new Set(["/", "/about", "/testimonials", "/shop", "/membership", "/faq", "/before-and-after"]);
  const lightTextRoutes = new Set(["/"]);
  // /shop/[slug] product detail pages share the same atmospheric background
  // as /shop, so the nav should overlay there too (Karlyne 2026-05-13).
  const isOverlayRoute = heroOverlayRoutes.has(pathname) || pathname.startsWith("/shop/");
  const isHeroOverlay = isOverlayRoute && !isScrolled;
  const useLightNavText = lightTextRoutes.has(pathname) && !isScrolled;

  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (transitionsEnabled) {
      setTransitionsEnabled(false);
    }
  }

  useEffect(() => {
    setIsScrolled(window.scrollY > 20);
    const raf = requestAnimationFrame(() => {
      setTransitionsEnabled(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollYRef = useRef(0);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      isNavigatingRef.current = false;
      scrollYRef.current = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.removeEventListener("keydown", onKey);
        if (isNavigatingRef.current) {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, scrollYRef.current);
        }
      };
    }
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = () => {
    isNavigatingRef.current = true;
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP NAV — fixed, full bar (hidden on mobile)
          ═══════════════════════════════════════════ */}
      <nav
        className={`hidden lg:block fixed top-0 w-full z-50 ${transitionsEnabled ? "transition-all duration-500" : ""}`}
        style={{
          backgroundColor: isHeroOverlay ? "transparent" : "#fbfaef",
          boxShadow: isScrolled ? "var(--shadow-nav)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-12 py-8">
          <Link
            href="/"
            className="font-headline text-2xl tracking-tight transition-colors duration-500"
            style={{
              color: useLightNavText
                ? "var(--color-on-primary)"
                : "var(--color-primary)",
              display: "flex",
              alignItems: "center",
            }}
            aria-label={logoAlt}
          >
            <Image
              src={logoUrl ?? (useLightNavText && !isScrolled ? "/images/logo-white.svg" : "/images/logo-espresso.svg")}
              alt={logoAlt}
              width={180}
              height={60}
              priority
              style={{
                height: "56px",
                width: "auto",
                maxHeight: "56px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <ul className="flex gap-10 items-center">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-headline tracking-wide text-xl transition-all duration-500"
                    style={{
                      color: useLightNavText
                        ? "var(--color-on-primary)"
                        : isActive
                          ? "var(--color-primary)"
                          : "#4a4040",
                      opacity: 1,
                      borderBottom: isActive
                        ? useLightNavText
                          ? "1px solid var(--color-on-primary)"
                          : "1px solid var(--color-primary)"
                        : "1px solid transparent",
                      paddingBottom: "0.25rem",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Explore dropdown */}
            <li
              className="relative"
              onMouseEnter={() => {
                if (exploreTimeoutRef.current) clearTimeout(exploreTimeoutRef.current);
                setExploreOpen(true);
              }}
              onMouseLeave={() => {
                exploreTimeoutRef.current = setTimeout(() => setExploreOpen(false), 200);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape" && exploreOpen) {
                  setExploreOpen(false);
                  const target = e.currentTarget.querySelector(
                    "button",
                  ) as HTMLButtonElement | null;
                  target?.focus();
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setExploreOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={exploreOpen}
                onClick={() => setExploreOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExploreOpen(true);
                  }
                }}
                className="font-headline tracking-wide text-xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-secondary)]"
                style={{
                  color: useLightNavText
                    ? "var(--color-on-primary)"
                    : exploreLinks.some((l) => pathname === l.href)
                      ? "var(--color-primary)"
                      : "#4a4040",
                  opacity: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  paddingBottom: "0.25rem",
                  borderBottom: exploreLinks.some((l) => pathname === l.href)
                    ? useLightNavText
                      ? "1px solid var(--color-on-primary)"
                      : "1px solid var(--color-primary)"
                    : "1px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Explore
                <span style={{ fontSize: "0.6em", marginTop: 2 }}>&#9662;</span>
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: "0.75rem",
                      backgroundColor: "#fbfaef",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 40px rgba(57,30,30,0.1)",
                      border: "1px solid rgba(212,195,194,0.3)",
                      padding: "0.5rem 0",
                      minWidth: 180,
                      zIndex: 100,
                    }}
                  >
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="font-headline tracking-wide transition-all duration-300"
                        style={{
                          display: "block",
                          padding: "0.6rem 1.5rem",
                          fontSize: "1rem",
                          color: pathname === link.href ? "var(--color-primary)" : "#4a4040",
                          opacity: 1,
                          textDecoration: "none",
                        }}
                        onClick={() => setExploreOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Over the dark home hero the espresso button vanished into the video,
             so it adopts the same silk/matcha treatment as the hero CTA. On
             cream pages (and once scrolled) it stays espresso for contrast. */}
          <Link
            href="/booking#pabau-iframe"
            className={useLightNavText ? "btn-hero" : "btn-primary"}
            style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}
          >
            Book Consultation
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          MOBILE — MADE logo (scrolls with page)
          ═══════════════════════════════════════════ */}
      <div className="lg:hidden relative z-10 px-6 py-5" style={{ marginBottom: "-100px" }}>
        <Link
          href="/"
          className="font-headline text-2xl tracking-tight"
          style={{
            color: useLightNavText && !isScrolled
              ? "var(--color-on-primary)"
              : "var(--color-primary)",
            display: "inline-flex",
            alignItems: "center",
          }}
          aria-label={logoAlt}
        >
          <Image
            src={logoUrl ?? (useLightNavText && !isScrolled ? "/images/logo-white.svg" : "/images/logo-espresso.svg")}
            alt={logoAlt}
            width={132}
            height={44}
            priority
            style={{
              height: "44px",
              width: "auto",
              maxHeight: "44px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE — Single fixed hamburger with animated X
          Always visible, animates between states
          ═══════════════════════════════════════════ */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        className="lg:hidden fixed top-5 right-6 z-[80] w-11 h-11 flex flex-col justify-center items-center gap-0 transition-all duration-500"
        style={{
          // No background square — just the lines. Espresso/black lines when
          // scrolled (light pages), white over the dark hero. A whisper-subtle
          // shadow keeps the lines legible if a dark section scrolls under the
          // fixed button (client 2026-05-31).
          backgroundColor: "transparent",
          filter: isMobileMenuOpen
            ? "none"
            : useLightNavText
              ? "drop-shadow(0 1px 3px rgba(0,0,0,0.45))"
              : "drop-shadow(0 0 2px rgba(247,246,235,0.65))",
        }}
      >
        {/* Top line — rotates to form X */}
        <span
          className="block w-5 h-[1.5px] transition-all duration-400 origin-center"
          style={{
            backgroundColor: isMobileMenuOpen
              ? "var(--color-primary)"
              : useLightNavText ? "#ffffff" : "#391e1e",
            transform: isMobileMenuOpen
              ? "translateY(0.5px) rotate(45deg)"
              : "translateY(-4px)",
          }}
        />
        {/* Middle line — fades out */}
        <span
          className="block w-5 h-[1.5px] transition-all duration-400"
          style={{
            backgroundColor: isMobileMenuOpen
              ? "var(--color-primary)"
              : useLightNavText ? "#ffffff" : "#391e1e",
            opacity: isMobileMenuOpen ? 0 : 1,
          }}
        />
        {/* Bottom line — rotates to form X */}
        <span
          className="block w-5 h-[1.5px] transition-all duration-400 origin-center"
          style={{
            backgroundColor: isMobileMenuOpen
              ? "var(--color-primary)"
              : useLightNavText ? "#ffffff" : "#391e1e",
            transform: isMobileMenuOpen
              ? "translateY(-0.5px) rotate(-45deg)"
              : "translateY(4px)",
          }}
        />
      </button>

      {/* ═══════════════════════════════════════════
          MOBILE MENU OVERLAY
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[65]"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 w-full z-[70] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              style={{
                height: "100dvh",
                minHeight: "-webkit-fill-available",
                backgroundColor: "#fbfaef",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              {/* Scrollable inner — content centers when it fits the viewport
                 (e.g. iPad/large phone) and scrolls vertically when it
                 doesn't (e.g. iPhone SE 375x667, where 10 menu items at
                 text-3xl + gap-8 + CTA exceed the viewport). The my-auto
                 wrapper handles both states with no JS measurement.
                 - overscrollBehavior: contain prevents iOS rubber-band
                   from leaking scroll to the body once you hit the ends.
                 - paddingTop of 5rem clears the fixed hamburger X
                   (top-5 right-6, ~64px tall) so menu items never sit
                   under the close affordance when the user scrolls. */}
              <div
                className="flex-1 overflow-y-auto px-8 sm:px-12"
                style={{
                  paddingTop: "calc(env(safe-area-inset-top, 0px) + 5rem)",
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                }}
              >
              <div className="flex flex-col min-h-full">
              <div className="my-auto">

              <ul className="flex flex-col gap-7">
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                >
                  <Link
                    href="/"
                    onClick={handleMobileNavClick}
                    className="text-3xl tracking-tight transition-opacity duration-500"
                    style={{
                      fontFamily: "var(--font-label)",
                      color: pathname === "/" ? "var(--color-primary)" : "#4a4040",
                      opacity: 1,
                    }}
                  >
                    Home
                  </Link>
                </motion.li>
                {allLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + index * 0.05,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleMobileNavClick}
                        className="text-3xl tracking-tight transition-opacity duration-500"
                        style={{
                          fontFamily: "var(--font-label)",
                          color: isActive ? "var(--color-primary)" : "#4a4040",
                          opacity: 1,
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <Link
                  href="/booking#pabau-iframe"
                  onClick={handleMobileNavClick}
                  className="btn-primary w-full text-center"
                >
                  Book Consultation
                </Link>
              </motion.div>
              </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
