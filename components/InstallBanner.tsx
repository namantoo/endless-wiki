"use client";

import { useEffect, useState } from "react";

// Chrome/Edge fire this before showing their own install UI.
// We intercept it so we can trigger the prompt from our own button.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "wheels_install_dismissed_v1";

export default function InstallBanner() {
  const [platform, setPlatform]           = useState<"android" | "ios" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible]             = useState(false);

  useEffect(() => {
    // Already running as installed PWA — nothing to show
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as Navigator & { standalone?: boolean }).standalone) return;
    // User already dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const ua = navigator.userAgent;
    const isIOS    = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);

    if (isIOS && isSafari) {
      // iOS Safari doesn't support beforeinstallprompt — show manual instructions
      setPlatform("ios");
      setTimeout(() => setVisible(true), 4000);
      return;
    }

    // Android Chrome / Edge — intercept the native install prompt
    const handler = (e: Event) => {
      e.preventDefault(); // stop Chrome's mini-infobar
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
      setTimeout(() => setVisible(true), 4000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
    dismiss();
  }

  if (!platform) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "16px", right: "16px",
        bottom: `calc(env(safe-area-inset-bottom, 0px) + 88px)`,
        zIndex: 150,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.38s cubic-bezier(0.32,0.72,0,1), opacity 0.28s ease",
      }}
    >
      <div
        style={{
          background: "rgba(20,20,20,0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.11)",
          padding: "13px 12px 13px 14px",
          display: "flex", alignItems: "center", gap: "11px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
        }}
      >
        {/* Mini app icon */}
        <div style={{
          width: "42px", height: "42px", borderRadius: "11px", flexShrink: 0,
          background: "#111", border: "1px solid rgba(255,255,255,0.09)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: "17px", fontWeight: 800, letterSpacing: "-0.05em",
          userSelect: "none",
        }}>
          <span style={{ color: "#fff" }}>W</span>
          <span style={{ color: "#C6FF47" }}>s</span>
        </div>

        {/* Copy */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "13px", fontWeight: 700,
            color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.2,
          }}>
            Add Wheels to Home Screen
          </p>
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "11.5px", color: "rgba(255,255,255,0.38)",
            margin: "3px 0 0", lineHeight: 1.35,
          }}>
            {platform === "ios"
              ? <>Tap <ShareIcon inline /> then &ldquo;Add to Home Screen&rdquo;</>
              : "One tap — works offline, no browser bar"}
          </p>
        </div>

        {/* CTA */}
        {platform === "android" && (
          <button
            onClick={install}
            style={{
              flexShrink: 0, padding: "7px 15px",
              borderRadius: "9999px", border: "none",
              background: "#C6FF47",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "12px", fontWeight: 700,
              color: "#0D0D0D", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Install
          </button>
        )}

        {/* Dismiss */}
        <button
          onClick={dismiss}
          style={{ flexShrink: 0, padding: "4px", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Inline share icon matching iOS share button visual
function ShareIcon({ inline }: { inline?: boolean }) {
  return (
    <svg
      width={inline ? 12 : 20}
      height={inline ? 12 : 20}
      viewBox="0 0 24 24" fill="none"
      stroke="#C6FF47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={inline ? { display: "inline", verticalAlign: "middle", margin: "0 1px" } : {}}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
