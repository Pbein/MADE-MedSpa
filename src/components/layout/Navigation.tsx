"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHeroOverlay = pathname === "/" && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all"
        )}
        style={{
          height: "var(--nav-height)",
          transitionDuration: "var(--duration-medium)",
          transitionTimingFunction: "var(--ease-smooth)",
          backgroundColor: isScrolled
            ? "rgba(247, 246, 235, 0.92)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : undefined,
          boxShadow: isScrolled ? "var(--shadow-sm)" : undefined,
        }}
      >
        <div className="mx-auto flex h-full max-w-[var(--max-width)] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl tracking-[0.2em] transition-colors"
            style={{
              fontFamily: "var(--font-headline)",
              color: isHeroOverlay
                ? "var(--color-glaze)"
                : "var(--color-espresso)",
              transitionDuration: "var(--duration-normal)",
            }}
          >
            MADE
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="eyebrow hover-underline transition-colors duration-[var(--duration-fast)]"
                  style={{
                    color: isHeroOverlay
                      ? "rgba(247, 246, 235, 0.8)"
                      : "var(--color-olive)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/booking"
              className={cn(isHeroOverlay ? "btn-light" : "btn-primary")}
              style={{ padding: "0.625rem 1.75rem" }}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={cn(
                  "block h-[1.5px] w-6 transition-all",
                  isMobileMenuOpen && "translate-y-[4.5px] rotate-45"
                )}
                style={{
                  backgroundColor: isMobileMenuOpen
                    ? "var(--color-espresso)"
                    : isHeroOverlay
                      ? "var(--color-glaze)"
                      : "var(--color-espresso)",
                  transitionDuration: "var(--duration-normal)",
                  transitionTimingFunction: "var(--ease-smooth)",
                }}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-6 transition-all",
                  isMobileMenuOpen && "opacity-0"
                )}
                style={{
                  backgroundColor: isMobileMenuOpen
                    ? "var(--color-espresso)"
                    : isHeroOverlay
                      ? "var(--color-glaze)"
                      : "var(--color-espresso)",
                  transitionDuration: "var(--duration-fast)",
                }}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-6 transition-all",
                  isMobileMenuOpen && "-translate-y-[4.5px] -rotate-45"
                )}
                style={{
                  backgroundColor: isMobileMenuOpen
                    ? "var(--color-espresso)"
                    : isHeroOverlay
                      ? "var(--color-glaze)"
                      : "var(--color-espresso)",
                  transitionDuration: "var(--duration-normal)",
                  transitionTimingFunction: "var(--ease-smooth)",
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
              style={{ backgroundColor: "rgba(57, 30, 30, 0.5)" }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="fixed top-0 right-0 z-40 flex h-full w-[85%] max-w-sm flex-col px-8 pt-28 pb-10 lg:hidden"
              style={{
                backgroundColor: "var(--color-silk)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <ul className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-2xl transition-colors"
                      style={{
                        fontFamily: "var(--font-headline)",
                        color: "var(--color-espresso)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="mt-auto"
              >
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
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
