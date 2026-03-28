// SkeletonReel — shimmer placeholder shown during initial load.
// Replaces the full-screen spinner with 3 skeleton cards that feel immediate.

export default function SkeletonReel() {
  return (
    <div
      className="w-full flex-shrink-0 flex flex-col justify-end"
      style={{ height: "100dvh", background: "var(--surface-1)" }}
    >
      {/* Simulated gradient bottom area */}
      <div className="p-6 pb-16 space-y-3">
        {/* Category chip */}
        <div
          className="animate-shimmer rounded-full"
          style={{ width: "72px", height: "22px" }}
        />
        {/* Title — two lines */}
        <div className="space-y-2 pt-1">
          <div
            className="animate-shimmer rounded-md"
            style={{ width: "85%", height: "28px" }}
          />
          <div
            className="animate-shimmer rounded-md"
            style={{ width: "60%", height: "28px" }}
          />
        </div>
        {/* Description */}
        <div
          className="animate-shimmer rounded"
          style={{ width: "50%", height: "16px" }}
        />
        {/* Body lines */}
        <div className="space-y-2 pt-1">
          {[100, 95, 88, 92, 75].map((w, i) => (
            <div
              key={i}
              className="animate-shimmer rounded"
              style={{ width: `${w}%`, height: "14px" }}
            />
          ))}
        </div>
        {/* Related topic pills */}
        <div className="flex gap-2 pt-2">
          {[80, 96, 72].map((w, i) => (
            <div
              key={i}
              className="animate-shimmer rounded-full"
              style={{ width: `${w}px`, height: "26px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
