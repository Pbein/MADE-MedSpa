"use client";

export default function PreviewBanner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#6366f1",
        color: "#fff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      Preview Mode — These changes are not live yet. Go back to the admin to save.
    </div>
  );
}
