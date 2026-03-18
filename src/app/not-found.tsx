import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-[var(--color-accent-text)] font-[family-name:var(--font-jost)] text-sm tracking-[0.2em] uppercase mb-4">
          404
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[var(--color-chocolate)] mb-6">
          Page Not Found
        </h1>
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-stone-500 mb-10 leading-relaxed">
          The page you are looking for may have been moved, removed, or never existed.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--color-burgundy)] text-[var(--color-ivory)] font-[family-name:var(--font-jost)] text-sm tracking-[0.15em] uppercase px-10 py-4 hover:bg-[var(--color-chocolate)] transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
