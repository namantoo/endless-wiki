"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "wheels:swipe_hint_shown";

export default function SwipeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen it before
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);

    // Auto-dismiss after 3s
    const timer = setTimeout(() => dismiss(), 3000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(13,13,13,0.72)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        pointerEvents: "auto",
        gap: "20px",
      }}
    >
      {/* Animated arrow */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "swipeArrow 1.2s ease-in-out infinite",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C6FF47"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C6FF47"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.5 }}
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>

      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.80)",
          letterSpacing: "0.01em",
          margin: 0,
        }}
      >
        Swipe up to explore
      </p>

      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.32)",
          margin: 0,
        }}
      >
        tap anywhere to dismiss
      </p>

      <style>{`
        @keyframes swipeArrow {
          0%, 100% { transform: translateY(0px); opacity: 1; }
          50%       { transform: translateY(-10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
