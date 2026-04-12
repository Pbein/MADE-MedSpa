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

  // Detect route change during render — disable transitions immediately
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (transitionsEnabled) {
      setTransitionsEnabled(false);
    }
  }

  // Re-enable transitions after route change paint
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
      scrollYRef.current = window.scrollY;
      isNavigatingRef.current = false;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
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
      <nav
        className={`fixed top-0 w-full z-50 ${transitionsEnabled ? "transition-all duration-500" : ""}`}
        style={{
          backgroundColor: isHeroOverlay
            ? "transparent"
            : "#fbfaef",
          boxShadow: isScrolled ? "var(--shadow-nav)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8">
          {/* Logo */}
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

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex gap-12 items-center">
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

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/booking"
              className="btn-primary"
              style={{
                padding: "0.75rem 2rem",
                fontSize: "0.95rem",
              }}
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile: Hamburger */}
          <div className="md:hidden relative z-[90]">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="relative w-8 h-6 flex flex-col justify-between"
            >
              <span
                className="block w-full h-[1.5px] transition-all duration-500 origin-center"
                style={{
                  backgroundColor:
                    isMobileMenuOpen
                      ? "var(--color-primary)"
                      : useLightNavText
                        ? "var(--color-on-primary)"
                        : "var(--color-primary)",
                  transform: isMobileMenuOpen
                    ? "translateY(10px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="block w-full h-[1.5px] transition-all duration-500"
                style={{
                  backgroundColor:
                    isMobileMenuOpen
                      ? "var(--color-primary)"
                      : useLightNavText
                        ? "var(--color-on-primary)"
                        : "var(--color-primary)",
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-full h-[1.5px] transition-all duration-500 origin-center"
                style={{
                  backgroundColor:
                    isMobileMenuOpen
                      ? "var(--color-primary)"
                      : useLightNavText
                        ? "var(--color-on-primary)"
                        : "var(--color-primary)",
                  transform: isMobileMenuOpen
                    ? "translateY(-12px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
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
              {/* Close button — top right */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-6 w-8 h-8 flex items-center justify-center"
                style={{ top: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
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
