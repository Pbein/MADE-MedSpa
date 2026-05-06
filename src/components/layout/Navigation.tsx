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

  const heroOverlayRoutes = new Set(["/", "/services", "/about", "/booking", "/testimonials", "/shop", "/membership", "/faq", "/before-and-after"]);
  const lightTextRoutes = new Set(["/", "/booking"]);
  const isOverlayRoute = heroOverlayRoutes.has(pathname);
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
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
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
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={120}
                height={40}
                priority
                style={{
                  height: "40px",
                  width: "auto",
                  maxHeight: "40px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              "MADE"
            )}
          </Link>

          <ul className="flex gap-10 items-center">
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-headline tracking-wide text-lg transition-all duration-500"
                    style={{
                      color: useLightNavText
                        ? "var(--color-on-primary)"
                        : "var(--color-primary)",
                      opacity: isActive ? 1 : 0.6,
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
                className="font-headline tracking-wide text-lg transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-secondary)]"
                style={{
                  color: useLightNavText
                    ? "var(--color-on-primary)"
                    : "var(--color-primary)",
                  opacity: exploreLinks.some((l) => pathname === l.href) ? 1 : 0.6,
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
                          color: "var(--color-primary)",
                          opacity: pathname === link.href ? 1 : 0.65,
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

          <Link
            href="/booking"
            className="btn-primary"
            style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}
          >
            Book Appointment
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
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={96}
              height={32}
              priority
              style={{
                height: "32px",
                width: "auto",
                maxHeight: "32px",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            "MADE"
          )}
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
          backgroundColor: isMobileMenuOpen
            ? "transparent"
            : isScrolled
              ? "#221010"
              : "transparent",
        }}
      >
        {/* Top line — rotates to form X */}
        <span
          className="block w-5 h-[1.5px] transition-all duration-400 origin-center"
          style={{
            backgroundColor: isMobileMenuOpen
              ? "var(--color-primary)"
              : isScrolled
                ? "#f7f6eb"
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
              : isScrolled
                ? "#f7f6eb"
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
              : isScrolled
                ? "#f7f6eb"
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
              className="fixed top-0 left-0 w-full z-[70]"
              style={{
                height: "100dvh",
                minHeight: "-webkit-fill-available",
                backgroundColor: "#fbfaef",
                touchAction: "none",
                overscrollBehavior: "none",
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
              {/* Inner content — safe area padded */}
              <div
                className="flex flex-col justify-center h-full px-8 sm:px-12"
                style={{
                  paddingTop: "env(safe-area-inset-top, 0px)",
                  paddingBottom: "env(safe-area-inset-bottom, 0px)",
                }}
              >

              <ul className="flex flex-col gap-8">
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
                    className="font-headline text-3xl tracking-tight transition-opacity duration-500"
                    style={{
                      color: "var(--color-primary)",
                      opacity: pathname === "/" ? 1 : 0.5,
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
                        className="font-headline text-3xl tracking-tight transition-opacity duration-500"
                        style={{
                          color: "var(--color-primary)",
                          opacity: isActive ? 1 : 0.5,
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
                  href="/booking"
                  onClick={handleMobileNavClick}
                  className="btn-primary w-full text-center"
                >
                  Book Consultation
                </Link>
              </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
