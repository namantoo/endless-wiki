"use client";

// CategoryFilterBar — horizontal scrollable chip row below the TopBar.
// Active chip glows with accent color. Selecting resets the feed.

import { CATEGORIES } from "@/lib/config/categories";

interface CategoryFilterBarProps {
  selected: string | null;
  onChange: (slug: string | null) => void;
}

export default function CategoryFilterBar({
  selected,
  onChange,
}: CategoryFilterBarProps) {
  return (
    <div
      className="fixed inset-x-0 z-40 scrollbar-none"
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 52px)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
      }}
    >
      <div className="flex gap-2 px-4 py-2" style={{ width: "max-content" }}>
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.slug;
          return (
            <button
              key={cat.label}
              onClick={() => onChange(cat.slug)}
              className="flex-shrink-0 font-heading font-semibold transition-all duration-200"
              style={{
                fontSize: "12px",
                lineHeight: "1",
                padding: "6px 14px",
                borderRadius: "9999px",
                border: isActive
                  ? "1px solid var(--accent-border)"
                  : "1px solid var(--border)",
                background: isActive ? "var(--accent-dim)" : "var(--surface-3)",
                color: isActive ? "var(--accent-light)" : "var(--text-secondary)",
                boxShadow: isActive
                  ? "0 0 14px var(--accent-dim)"
                  : "none",
                letterSpacing: "0.02em",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
