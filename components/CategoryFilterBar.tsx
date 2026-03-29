"use client";

// CategoryFilterBar — horizontal scrollable chip row below the TopBar.
// Inactive chips are quiet (tertiary text). Active chip glows with gold accent.

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
        top: "calc(env(safe-area-inset-top, 0px) + 76px)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        maskImage:
          "linear-gradient(to right, transparent 0px, black 16px, black calc(100% - 16px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0px, black 16px, black calc(100% - 16px), transparent 100%)",
      }}
    >
      <div className="flex gap-2 px-4 py-2" style={{ width: "max-content" }}>
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.slug;
          return (
            <button
              key={cat.label}
              onClick={() => onChange(cat.slug)}
              className="flex-shrink-0 font-body font-medium uppercase transition-all duration-200"
              style={{
                fontSize: "11px",
                lineHeight: "1",
                padding: "5px 14px",
                borderRadius: "9999px",
                letterSpacing: "0.04em",
                border: isActive
                  ? "1.5px solid var(--accent)"
                  : "1px solid var(--chip-border)",
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "var(--accent-fg)" : "var(--text-tertiary)",
                fontWeight: isActive ? 700 : 500,
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
