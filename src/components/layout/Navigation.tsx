"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const prevPathnameRef = useRef(pathname);

  const heroOverlayRoutes = new Set(["/", "/services", "/about"]);
  const lightTextRoutes = new Set(["/"]);
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
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        if (isNavigatingRef.current) {
          window.scrollTo(0, 0);
        }
      };
    }
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = () => {
    isNavigatingRef.current = true;
    setIsMobileMenuOpen(false);
  };

  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkBackground = () => {
      const x = window.innerWidth - 40;
      const y = 40;
      const el = document.elementFromPoint(x, y);
      if (!el) return;

      let node: Element | null = el;
      while (node && node !== document.body) {
        const bg = getComputedStyle(node).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, r, g, b] = match.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (luminance < 0.45) {
            setIsOverDark(true);
            return;
          } else if (luminance > 0.1) {
            setIsOverDark(false);
            return;
          }
        }
        node = node.parentElement;
      }
      setIsOverDark(false);
    };

    const handleScroll = () => {
      requestAnimationFrame(checkBackground);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkBackground();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const hamburgerColor = isMobileMenuOpen
    ? "var(--color-primary)"
    : useLightNavText
      ? "var(--color-on-primary)"
      : "var(--color-primary)";

  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP NAV — fixed, full bar (hidden on mobile)
          ═══════════════════════════════════════════ */}
      <nav
        className={`hidden md:block fixed top-0 w-full z-50 ${transitionsEnabled ? "transition-all duration-500" : ""}`}
        style={{
          backgroundColor: isHeroOverlay ? "transparent" : "#fbfaef",
          boxShadow: isScrolled ? "var(--shadow-nav)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-12 py-8">
          <Link
            href="/"
            className="font-headline italic text-2xl tracking-tight transition-colors duration-500"
            style={{
              color: useLightNavText
                ? "var(--color-on-primary)"
                : "var(--color-primary)",
            }}
          >
            MADE
          </Link>

          <ul className="flex gap-12 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-headline italic tracking-wide text-lg transition-all duration-500"
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
          MOBILE — Static header (scrolls with page, overlays hero)
          ═══════════════════════════════════════════ */}
      <div className="md:hidden absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-5 z-10">
        <Link
          href="/"
          className="font-headline italic text-2xl tracking-tight"
          style={{
            color: useLightNavText && !isScrolled
              ? "var(--color-on-primary)"
              : "var(--color-primary)",
          }}
        >
          MADE
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="relative w-8 h-5 flex flex-col justify-between"
        >
          <span
            className="block w-full h-[1.5px]"
            style={{ backgroundColor: hamburgerColor }}
          />
          <span
            className="block w-full h-[1.5px]"
            style={{ backgroundColor: hamburgerColor }}
          />
          <span
            className="block w-full h-[1.5px]"
            style={{ backgroundColor: hamburgerColor }}
          />
        </button>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE — Floating hamburger (fixed, visible when scrolled)
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {isScrolled && !isMobileMenuOpen && (
          <motion.button
            key="floating-hamburger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden fixed top-5 right-6 z-50 w-11 h-11 flex flex-col justify-center items-center gap-[6px]"
            style={{ backgroundColor: "#221010" }}
          >
            <span className="block w-5 h-[1.5px] bg-[#f7f6eb]" />
            <span className="block w-5 h-[1.5px] bg-[#f7f6eb]" />
            <span className="block w-5 h-[1.5px] bg-[#f7f6eb]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          MOBILE MENU OVERLAY
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[65] bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed inset-0 z-[70] flex flex-col justify-center px-8 sm:px-12"
              style={{
                backgroundColor: "var(--color-surface)",
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
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
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-6 w-10 h-10 flex items-center justify-center"
                style={{ top: "calc(env(safe-area-inset-top, 0px) + 1.25rem)" }}
              >
                <span
                  className="absolute block w-6 h-[1.5px] rotate-45"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <span
                  className="absolute block w-6 h-[1.5px] -rotate-45"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
              </button>

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
                    className="font-headline italic text-3xl tracking-tight transition-opacity duration-500"
                    style={{
                      color: "var(--color-primary)",
                      opacity: pathname === "/" ? 1 : 0.5,
                    }}
                  >
                    Home
                  </Link>
                </motion.li>
                {navLinks.map((link, index) => {
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
                        className="font-headline italic text-3xl tracking-tight transition-opacity duration-500"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
