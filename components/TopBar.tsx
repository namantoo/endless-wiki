"use client";

// TopBar — fixed overlay header.
// Shows: streak counter (left) · Weels wordmark (center) · today count (right)
// Backdrop blur keeps it readable over images without blocking content.

interface TopBarProps {
  streak: number;
  todayCount: number;
}

export default function TopBar({ streak, todayCount }: TopBarProps) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
        paddingBottom: "12px",
        background: "rgba(8,8,8,0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: streak (hidden until streak ≥ 2) */}
      <div className="w-20 flex items-center gap-1">
        {streak >= 2 && (
          <span
            className="flex items-center gap-1 text-xs font-semibold font-heading"
            style={{ color: "var(--streak)" }}
          >
            <FireIcon />
            {streak}
          </span>
        )}
      </div>

      {/* Center: wordmark */}
      <span
        className="font-heading font-bold tracking-tight select-none"
        style={{
          fontSize: "18px",
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        Weels
      </span>

      {/* Right: today count */}
      <div className="w-20 flex items-center justify-end gap-1.5">
        {todayCount > 0 && (
          <span
            className="text-xs font-medium font-heading flex items-center gap-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "var(--accent)" }}
            />
            {todayCount}
          </span>
        )}
      </div>
    </header>
  );
}

function FireIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 7 14 9 11 14c-1 2-3 3-3 3s.5-2-.5-3.5C6 12 4 10.5 4 8c0-3 2.5-5.5 5-6 0 0-1 3 1 4.5C11.5 7.5 12 2 12 2zM12 22c-3.3 0-6-2.7-6-6 0-2.2 1.5-4.2 3-5.5.5 1 1.5 1.5 1.5 3 0 .8-.5 1.5-.5 1.5s3-1 3-4c1.5 1 3 3 3 5 0 3.3-2.7 6-6 6z" />
    </svg>
  );
}
