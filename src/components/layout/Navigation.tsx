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
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function CartIcon({ count, light }: { count: number; light?: boolean }) {
  return (
    <Link
      href="/shop/cart"
      className="relative flex h-10 w-10 items-center justify-center transition-colors"
      aria-label={`Shopping cart${count > 0 ? `, ${count} items` : ""}`}
      style={{
        color: light ? "var(--color-ivory)" : "var(--color-chocolate)",
        transitionDuration: "var(--duration-fast)",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
          style={{
            backgroundColor: "var(--color-burgundy)",
            fontSize: "0.6rem",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // On homepage over the dark hero video, use light nav text
  const isHeroOverlay = pathname === "/" && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Read cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("made-cart") || "[]");
        const count = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    // Custom event for same-tab updates
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  // Lock body scroll when mobile menu is open
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
          "fixed top-0 left-0 right-0 z-50 transition-all",
          isScrolled
            ? "bg-[var(--color-ivory)]/90 backdrop-blur-md shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        )}
        style={{
          height: "var(--nav-height)",
          transitionDuration: "var(--duration-normal)",
          transitionTimingFunction: "var(--ease-smooth)",
          color: isHeroOverlay ? "var(--color-ivory)" : undefined,
        }}
      >
        <div className="mx-auto flex h-full max-w-[var(--max-width)] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="headline-text text-2xl tracking-[0.15em] transition-colors"
            style={{
              fontFamily: "var(--font-headline)",
              color: isHeroOverlay ? "var(--color-ivory)" : "var(--color-chocolate)",
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
                  className="editorial-spacing transition-colors duration-[var(--duration-fast)]"
                  style={{
                    color: isHeroOverlay ? "rgba(250, 247, 244, 0.85)" : undefined,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA + Cart */}
          <div className="hidden items-center gap-3 lg:flex">
            <CartIcon count={cartCount} light={isHeroOverlay} />
            <Link
              href="/booking"
              className="btn btn-primary"
              style={isHeroOverlay ? {
                backgroundColor: "var(--color-burgundy)",
                borderColor: "var(--color-burgundy)",
                color: "var(--color-ivory)",
              } : undefined}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartIcon count={cartCount} light={isHeroOverlay} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={cn(
                  "block h-[1.5px] w-6 transition-all",
                  isMobileMenuOpen && "translate-y-[4.5px] rotate-45"
                )}
                style={{
                  backgroundColor: isHeroOverlay ? "var(--color-ivory)" : "var(--color-chocolate)",
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
                  backgroundColor: isHeroOverlay ? "var(--color-ivory)" : "var(--color-chocolate)",
                  transitionDuration: "var(--duration-fast)",
                }}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-6 transition-all",
                  isMobileMenuOpen && "-translate-y-[4.5px] -rotate-45"
                )}
                style={{
                  backgroundColor: isHeroOverlay ? "var(--color-ivory)" : "var(--color-chocolate)",
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[var(--color-chocolate)]/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed top-0 right-0 z-40 flex h-full w-[85%] max-w-sm flex-col bg-[var(--color-ivory)] px-8 pt-28 pb-10 shadow-[var(--shadow-xl)] lg:hidden"
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
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="headline-text block text-2xl text-[var(--color-chocolate)] transition-colors hover:text-[var(--color-accent-text)]"
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
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-auto"
              >
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn btn-primary w-full text-center"
                >
                  Book Now
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
