"use client";

interface LocationMapProps {
  address: string;
  embedQuery?: string;
  height?: number;
}

export default function LocationMap({
  address,
  embedQuery,
  height = 320,
}: LocationMapProps) {
  const query = encodeURIComponent(embedQuery ?? address);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="space-y-4">
      <div
        className="overflow-hidden rounded-lg"
        style={{
          border: "1px solid var(--color-outline-variant)",
          height,
          backgroundColor: "var(--color-surface-variant)",
        }}
      >
        <iframe
          title={`Map showing ${address}`}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="link-editorial inline-flex items-center gap-2 text-sm"
        style={{ color: "var(--color-secondary)" }}
      >
        Get Directions
        <span aria-hidden style={{ display: "inline-block", transform: "translateY(-1px)" }}>
          →
        </span>
      </a>
    </div>
  );
}
