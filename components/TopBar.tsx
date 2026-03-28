"use client";

// TopBar — fixed overlay header.
// Row 1: streak (left) · Weels wordmark (center) · today count (right)
// Row 2: scrolling Wikipedia fact ticker strip (bored.com-inspired)

const FACTS = [
  "Honey never expires — archaeologists found 3,000-year-old edible honey in Egyptian tombs",
  "A group of flamingos is called a flamboyance",
  "Cleopatra lived closer in time to the Moon landing than to the Great Pyramid's construction",
  "Sharks are older than trees — they've existed for over 400 million years",
  "The word \"nerd\" was first coined by Dr. Seuss in 1950",
  "Wombat poop is cube-shaped",
  "The Eiffel Tower grows up to 15 cm taller in summer due to thermal expansion",
  "A day on Venus is longer than a year on Venus",
  "Octopuses have three hearts and blue blood",
  "The shortest war in history lasted 38 to 45 minutes",
];

interface TopBarProps {
  streak: number;
  todayCount: number;
}

export default function TopBar({ streak, todayCount }: TopBarProps) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: "rgba(13,13,13,0.75)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Row 1: streak / wordmark / count */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: "10px",
        }}
      >
        {/* Left: streak */}
        <div className="w-20 flex items-center gap-1.5">
          {streak >= 1 && (
            <span
              className="flex items-center gap-1 font-body font-bold"
              style={{ fontSize: "13px", color: "var(--streak)" }}
            >
              <FireIcon />
              {streak}
            </span>
          )}
        </div>

        {/* Center: wordmark */}
        <span
          className="font-heading font-bold select-none"
          style={{
            fontSize: "19px",
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          Wee<span style={{ color: "var(--accent)" }}>ls</span>
        </span>

        {/* Right: today count */}
        <div className="w-20 flex flex-col items-end">
          {todayCount > 0 && (
            <>
              <span
                className="font-body font-bold"
                style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1" }}
              >
                {todayCount}
              </span>
              <span
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: "8.5px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.07em",
                  marginTop: "1px",
                }}
              >
                today
              </span>
            </>
          )}
        </div>
      </div>

      {/* Row 2: scrolling fact ticker */}
      <div
        style={{
          overflow: "hidden",
          background: "var(--accent)",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >
        <div
          className="animate-ticker"
          style={{ display: "flex", gap: "0", width: "max-content" }}
        >
          {[...FACTS, ...FACTS].map((fact, i) => (
            <span
              key={i}
              className="font-body font-bold uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.07em",
                color: "#0D0D0D",
                whiteSpace: "nowrap",
                paddingRight: "48px",
              }}
            >
              ★ {fact}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

function FireIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 7 14 9 11 14c-1 2-3 3-3 3s.5-2-.5-3.5C6 12 4 10.5 4 8c0-3 2.5-5.5 5-6 0 0-1 3 1 4.5C11.5 7.5 12 2 12 2zM12 22c-3.3 0-6-2.7-6-6 0-2.2 1.5-4.2 3-5.5.5 1 1.5 1.5 1.5 3 0 .8-.5 1.5-.5 1.5s3-1 3-4c1.5 1 3 3 3 5 0 3.3-2.7 6-6 6z" />
    </svg>
  );
}
