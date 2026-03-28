// SkeletonReel — warm pulse placeholder shown during initial load.
// Matches the three-zone card structure to hint at real content.

export default function SkeletonReel() {
  return (
    <div
      className="w-full flex-shrink-0 flex flex-col justify-end"
      style={{ height: "100dvh", background: "var(--surface-0)" }}
    >
      {/* Glass panel mirror */}
      <div style={{
        background: "rgba(13,13,13,0.78)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderRadius: "22px 22px 0 0",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        padding: "20px 22px",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
      }}>
        {/* Zone 1: Category + decorative rule */}
        <div
          className="animate-warmPulse rounded"
          style={{ width: "64px", height: "12px", marginBottom: "6px" }}
        />
        <div
          style={{
            width: "24px",
            height: "1px",
            background: "var(--accent)",
            opacity: 0.15,
            marginBottom: "10px",
          }}
        />

        {/* Zone 2: Title */}
        <div className="space-y-2">
          <div
            className="animate-warmPulse rounded-md"
            style={{ width: "85%", height: "28px" }}
          />
          <div
            className="animate-warmPulse rounded-md"
            style={{ width: "55%", height: "28px" }}
          />
        </div>

        {/* Description */}
        <div
          className="animate-warmPulse rounded"
          style={{ width: "45%", height: "14px", marginTop: "8px" }}
        />

        {/* Body lines — 3 lines to match clamp */}
        <div className="space-y-2" style={{ marginTop: "12px" }}>
          {[100, 92, 70].map((w, i) => (
            <div
              key={i}
              className="animate-warmPulse rounded"
              style={{ width: `${w}%`, height: "14px" }}
            />
          ))}
        </div>

        {/* Zone 3: Related topic pills */}
        <div className="flex gap-2" style={{ marginTop: "16px" }}>
          {[56, 72, 64].map((w, i) => (
            <div
              key={i}
              className="animate-warmPulse rounded-full"
              style={{ width: `${w}px`, height: "26px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
