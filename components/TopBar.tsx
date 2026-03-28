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
        background: "rgba(10,10,8,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Left: streak */}
      <div className="w-20 flex items-center gap-1">
        {streak >= 2 && (
          <span
            className="flex items-center gap-1 text-xs font-semibold font-body"
            style={{
              color: "var(--streak)",
              textShadow: streak >= 7 ? "0 0 8px rgba(232,164,53,0.3)" : "none",
            }}
          >
            <FireIcon hasRing={streak >= 7} />
            {streak}
          </span>
        )}
      </div>

      {/* Center: wordmark — italic serif */}
      <span
        className="font-heading select-none"
        style={{
          fontSize: "20px",
          fontWeight: 600,
          fontStyle: "italic",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        Weels
      </span>

      {/* Right: today count — stacked */}
      <div className="w-20 flex flex-col items-end">
        {todayCount > 0 && (
          <>
            <span
              className="font-body font-semibold"
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1",
              }}
            >
              {todayCount}
            </span>
            <span
              className="font-body font-medium uppercase"
              style={{
                fontSize: "9px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                lineHeight: "1",
                marginTop: "2px",
              }}
            >
              today
            </span>
          </>
        )}
      </div>
    </header>
  );
}

function FireIcon({ hasRing }: { hasRing: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      {hasRing && (
        <span
          className="absolute rounded-full"
          style={{
            width: "20px",
            height: "20px",
            border: "1px solid rgba(232,164,53,0.3)",
          }}
        />
      )}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.5 7 14 9 11 14c-1 2-3 3-3 3s.5-2-.5-3.5C6 12 4 10.5 4 8c0-3 2.5-5.5 5-6 0 0-1 3 1 4.5C11.5 7.5 12 2 12 2zM12 22c-3.3 0-6-2.7-6-6 0-2.2 1.5-4.2 3-5.5.5 1 1.5 1.5 1.5 3 0 .8-.5 1.5-.5 1.5s3-1 3-4c1.5 1 3 3 3 5 0 3.3-2.7 6-6 6z" />
      </svg>
    </span>
  );
}
