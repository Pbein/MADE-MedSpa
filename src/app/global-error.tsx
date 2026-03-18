"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--color-ivory)]">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <p className="text-[var(--color-accent-text)] text-sm tracking-[0.2em] uppercase mb-4">
              Error
            </p>
            <h1 className="text-4xl md:text-5xl text-[var(--color-chocolate)] mb-6" style={{ fontFamily: "serif" }}>
              Something Went Wrong
            </h1>
            <p className="text-lg text-stone-500 mb-10 leading-relaxed">
              We apologize for the inconvenience. Please try again or return to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="inline-block bg-[var(--color-burgundy)] text-[var(--color-ivory)] text-sm tracking-[0.15em] uppercase px-10 py-4 hover:bg-[var(--color-chocolate)] transition-colors duration-300 cursor-pointer"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="inline-block border border-[var(--color-accent-text)] text-[var(--color-accent-text)] text-sm tracking-[0.15em] uppercase px-10 py-4 hover:bg-[var(--color-burgundy)] hover:text-[var(--color-ivory)] transition-colors duration-300"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
