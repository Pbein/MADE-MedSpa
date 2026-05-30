// Full-width editorial "moment" — a single bold Playfair statement on deep
// espresso, the brand beat between hero and services (client 2026-05-30,
// Aesop / Violet Grey style). Sized as a compact DIVIDER. Carries the client's
// rocky-wall (marble) texture, blended over the espresso for subtle stone depth.
// Server component; heading styles inline to override the global all-caps
// Futura <h2> with sentence-case Playfair Display.
interface EditorialMomentProps {
  headline?: string;
}

export default function EditorialMoment({
  headline = "Refinement Over Transformation.",
}: EditorialMomentProps) {
  return (
    <section
      className="relative w-full px-6 py-24 md:py-32 flex items-center justify-center text-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 45%, #4a2929 0%, #391e1e 72%)",
        color: "var(--color-on-primary, #f7f6eb)",
      }}
    >
      {/* Stone/marble texture (client's rocky-wall.png, self-hosted at
          /public/textures) blended over the espresso so it reads as subtle
          stone depth without a flat tint. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/textures/rocky-wall.png)",
          backgroundSize: "500px 500px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          opacity: 0.9,
        }}
      />

      <h2
        className="relative z-10 max-w-4xl mx-auto"
        style={{
          fontFamily: "var(--font-headline)",
          fontWeight: 400,
          fontStyle: "normal",
          textTransform: "none",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          color: "var(--color-on-primary, #f7f6eb)",
          fontSize: "clamp(1.75rem, 4vw, 3rem)",
          textWrap: "balance",
        }}
      >
        {headline}
      </h2>
    </section>
  );
}
