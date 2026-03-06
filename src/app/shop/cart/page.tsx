"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Types ────────────────────────────────────────── */
interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/* ── Framer Motion helpers ────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, x: -60, height: 0, marginBottom: 0, transition: { duration: 0.4, ease } },
};

/* ── Helpers ──────────────────────────────────────── */
const CART_KEY = "made-cart";

function formatPrice(cents: number) {
  return "$" + (cents / 100).toFixed(2);
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/* ── Page Component ───────────────────────────────── */
export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  /* Hydrate cart from localStorage */
  useEffect(() => {
    setCart(readCart());
    setLoaded(true);
  }, []);

  /* Persist cart changes */
  useEffect(() => {
    if (loaded) writeCart(cart);
  }, [cart, loaded]);

  /* Cart operations */
  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? "Free" : null;
  const total = subtotal;

  /* Checkout handler */
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setCheckingOut(false);
      }
    } catch {
      alert("Unable to reach checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  /* ── Empty cart state ───────────────────────────── */
  if (loaded && cart.length === 0) {
    return (
      <>
        <section
          className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: "var(--color-ivory)" }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="pt-[var(--nav-height)]"
          >
            {/* Empty cart icon */}
            <motion.div
              variants={revealUp}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--color-cream)",
                border: "2px solid var(--color-stone)",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-stone-dark)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </motion.div>

            <motion.h1
              variants={revealUp}
              className="headline-text mb-4"
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--color-chocolate)",
              }}
            >
              Your Cart is <span className="accent-text">Empty</span>
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mx-auto mb-10 max-w-md leading-relaxed text-[var(--color-brown)]"
              style={{ fontSize: "var(--text-lg)" }}
            >
              Discover our curated collection of premium skincare products to
              elevate your routine.
            </motion.p>

            <motion.div variants={revealUp}>
              <Link href="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </>
    );
  }

  /* ── Loading state ──────────────────────────────── */
  if (!loaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-ivory)" }}
      >
        <div
          className="editorial-spacing text-[var(--color-stone-dark)]"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Loading
        </div>
      </div>
    );
  }

  /* ── Cart with items ────────────────────────────── */
  return (
    <>
      {/* ═══════════════ MINI HERO ═══════════════ */}
      <section
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "var(--color-ivory)",
          paddingTop: "calc(var(--nav-height) + var(--space-3xl))",
          paddingBottom: "var(--space-2xl)",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={revealUp}
            className="editorial-spacing mb-4 text-[var(--color-stone-dark)]"
          >
            Shopping
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="headline-text"
            style={{
              fontSize: "var(--text-5xl)",
              color: "var(--color-chocolate)",
            }}
          >
            Your <span className="accent-text">Cart</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* ═══════════════ CART CONTENT ═══════════════ */}
      <section
        className="px-6 lg:px-10"
        style={{
          backgroundColor: "var(--color-cream)",
          paddingTop: "var(--space-section)",
          paddingBottom: "var(--space-section)",
        }}
      >
        <div className="mx-auto grid max-w-[var(--max-width)] gap-12 lg:grid-cols-[1fr_380px]">
          {/* ── Items List ────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Column headers (desktop) */}
            <motion.div
              variants={revealUp}
              className="mb-6 hidden grid-cols-[80px_1fr_120px_140px_100px_40px] items-center gap-6 lg:grid"
            >
              <span />
              <span
                className="editorial-spacing text-[var(--color-stone-dark)]"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Product
              </span>
              <span
                className="editorial-spacing text-[var(--color-stone-dark)]"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Price
              </span>
              <span
                className="editorial-spacing text-center text-[var(--color-stone-dark)]"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Quantity
              </span>
              <span
                className="editorial-spacing text-right text-[var(--color-stone-dark)]"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Total
              </span>
              <span />
            </motion.div>

            <div
              className="mb-2 h-[1px] w-full hidden lg:block"
              style={{ backgroundColor: "var(--color-stone)" }}
            />

            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.productId}
                  variants={itemVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="mb-6"
                >
                  <div
                    className="grid grid-cols-[80px_1fr] gap-4 lg:grid-cols-[80px_1fr_120px_140px_100px_40px] lg:items-center lg:gap-6"
                    style={{
                      backgroundColor: "var(--color-ivory)",
                      borderRadius: "var(--border-radius-sm)",
                      padding: "var(--space-lg)",
                      border: "1px solid var(--color-stone)",
                    }}
                  >
                    {/* Image placeholder */}
                    <div
                      className="flex h-20 w-20 items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: "var(--color-cream)",
                        borderRadius: "var(--border-radius-sm)",
                        border: "1px solid var(--color-stone)",
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-stone-dark)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    {/* Product name (+ mobile price & controls) */}
                    <div className="flex flex-col gap-2 lg:contents">
                      <h3
                        className="headline-text text-[var(--color-chocolate)]"
                        style={{ fontSize: "var(--text-lg)" }}
                      >
                        {item.productName}
                      </h3>

                      {/* Mobile-only: price row */}
                      <div className="flex items-center justify-between lg:hidden">
                        <span
                          className="text-[var(--color-brown)]"
                          style={{ fontSize: "var(--text-base)" }}
                        >
                          {formatPrice(item.price)}
                        </span>
                        <span
                          className="font-medium text-[var(--color-chocolate)]"
                          style={{ fontSize: "var(--text-base)" }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Mobile-only: quantity + remove */}
                      <div className="flex items-center justify-between lg:hidden">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="flex h-8 w-8 items-center justify-center"
                            style={{
                              border: "1px solid var(--color-stone)",
                              borderRadius: "var(--border-radius-sm)",
                              backgroundColor: "var(--color-cream)",
                              color: "var(--color-brown)",
                              cursor: "pointer",
                            }}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span
                            className="min-w-[2rem] text-center text-[var(--color-chocolate)]"
                            style={{ fontSize: "var(--text-base)" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="flex h-8 w-8 items-center justify-center"
                            style={{
                              border: "1px solid var(--color-stone)",
                              borderRadius: "var(--border-radius-sm)",
                              backgroundColor: "var(--color-cream)",
                              color: "var(--color-brown)",
                              cursor: "pointer",
                            }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex h-8 w-8 items-center justify-center text-[var(--color-stone-dark)] transition-colors hover:text-[var(--color-burgundy)]"
                          style={{ cursor: "pointer" }}
                          aria-label={`Remove ${item.productName}`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Desktop-only: unit price */}
                      <span
                        className="hidden text-[var(--color-brown)] lg:block"
                        style={{ fontSize: "var(--text-base)" }}
                      >
                        {formatPrice(item.price)}
                      </span>

                      {/* Desktop-only: quantity controls */}
                      <div className="hidden items-center justify-center gap-3 lg:flex">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="flex h-8 w-8 items-center justify-center"
                          style={{
                            border: "1px solid var(--color-stone)",
                            borderRadius: "var(--border-radius-sm)",
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-brown)",
                            cursor: "pointer",
                          }}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span
                          className="min-w-[2rem] text-center text-[var(--color-chocolate)]"
                          style={{ fontSize: "var(--text-base)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="flex h-8 w-8 items-center justify-center"
                          style={{
                            border: "1px solid var(--color-stone)",
                            borderRadius: "var(--border-radius-sm)",
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-brown)",
                            cursor: "pointer",
                          }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Desktop-only: line total */}
                      <span
                        className="hidden text-right font-medium text-[var(--color-chocolate)] lg:block"
                        style={{ fontSize: "var(--text-base)" }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Desktop-only: remove button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="hidden h-8 w-8 items-center justify-center text-[var(--color-stone-dark)] transition-colors hover:text-[var(--color-burgundy)] lg:flex"
                        style={{ cursor: "pointer" }}
                        aria-label={`Remove ${item.productName}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Summary Sidebar ───────────────────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={revealUp}
              className="sticky top-[calc(var(--nav-height)+2rem)]"
              style={{
                backgroundColor: "var(--color-ivory)",
                borderRadius: "var(--border-radius-sm)",
                padding: "var(--space-2xl)",
                border: "1px solid var(--color-stone)",
              }}
            >
              <h2
                className="headline-text mb-8"
                style={{
                  fontSize: "var(--text-2xl)",
                  color: "var(--color-chocolate)",
                }}
              >
                Order <span className="accent-text">Summary</span>
              </h2>

              <div className="flex flex-col gap-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span
                    className="font-medium text-[var(--color-chocolate)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    Estimated Shipping
                  </span>
                  <span
                    className="text-[var(--color-brown)]"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    {shipping ?? "Calculated at checkout"}
                  </span>
                </div>

                <div
                  className="my-2 h-[1px] w-full"
                  style={{ backgroundColor: "var(--color-stone)" }}
                />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span
                    className="editorial-spacing text-[var(--color-stone-dark)]"
                    style={{ fontSize: "var(--text-xs)" }}
                  >
                    Total
                  </span>
                  <span
                    className="headline-text text-[var(--color-chocolate)]"
                    style={{ fontSize: "var(--text-2xl)" }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn btn-primary mt-8 w-full"
                style={{ opacity: checkingOut ? 0.6 : 1 }}
              >
                {checkingOut ? "Processing..." : "Proceed to Checkout"}
              </button>

              {/* Continue shopping */}
              <Link
                href="/shop"
                className="btn btn-outline mt-4 block w-full text-center"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
