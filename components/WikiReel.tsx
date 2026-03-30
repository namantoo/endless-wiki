"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { WikiArticle } from "@/types/wiki";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useHaptic } from "@/lib/hooks/useHaptic";

interface WikiReelProps {
  article: WikiArticle;
  isActive: boolean;
  onExplore?: (title: string) => void;  // related deep dive
}

export default function WikiReel({ article, isActive, onExplore }: WikiReelProps) {
  const [expanded, setExpanded] = useState(false);
  const { toggle, isBookmarked } = useBookmarks();
  const saved = isBookmarked(article.id);
  const bookmarkRef = useRef<HTMLButtonElement>(null);
  const haptic = useHaptic();

  const handleBookmark = useCallback(() => {
    toggle({
      id: article.id,
      title: article.title,
      description: article.description,
      thumbnail: article.thumbnail?.source,
      pageUrl: article.pageUrl,
    });
    haptic.medium(); // confirmation pulse on save/unsave
    const el = bookmarkRef.current;
    if (el) {
      el.classList.remove("animate-bookmarkPulse");
      void el.offsetWidth;
      el.classList.add("animate-bookmarkPulse");
    }
  }, [article, toggle]);

  const handleShare = useCallback(async () => {
    const ogUrl = `/api/og?title=${encodeURIComponent(article.displayTitle)}&desc=${encodeURIComponent(article.description ?? "")}&extract=${encodeURIComponent(article.extract ?? "")}`;
    const shareText = `${article.displayTitle}${article.description ? `\n${article.description}` : ""}\n\n${article.pageUrl}`;

    // Try sharing as image file (Web Share API level 2)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const resp = await fetch(ogUrl);
        const blob = await resp.blob();
        const file = new File([blob], "wheels-discovery.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: article.displayTitle });
          return;
        }
      } catch { /* fall through */ }

      // Fallback: share text + URL
      try {
        await navigator.share({
          title: article.displayTitle,
          text: shareText,
          url: article.pageUrl,
        });
        return;
      } catch { /* cancelled */ }
    }

    // Desktop fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n\nvia Wheels`);
    } catch { /* ignore */ }
  }, [article]);

  const hasMore = article.extractFull.length > article.extract.length;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "100dvh",
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.35s ease",
      }}
    >
      {/* ── Background ─────────────────────────────────────────── */}
      {article.thumbnail ? (
        <>
          <Image
            src={article.thumbnail.source}
            alt={article.title}
            fill
            className="object-cover"
            priority={isActive}
            sizes="100vw"
            style={{
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: isActive ? "scale(1)" : "scale(1.05)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.15) 45%, transparent 70%)",
            }}
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: `var(--card-gradient-${article.colorSeed})` }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </>
      )}

      {/* ── Glass panel ─────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid var(--glass-border)",
          padding: "18px 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
        }}
      >
        {/* Zone 1: category chip + bookmark/share */}
        <div className="animate-cardReveal flex items-center justify-between" style={{ marginBottom: "10px" }}>
          <div>
            {article.categories[0] ? (
              <span
                className="font-body font-bold uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.09em",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  display: "inline-block",
                  lineHeight: "1.6",
                }}
              >
                {article.categories[0]}
              </span>
            ) : <span />}
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={bookmarkRef}
              onClick={handleBookmark}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: "36px", height: "36px", borderRadius: "9999px",
                background: saved ? "var(--accent)" : "var(--btn-bg)",
                border: saved ? "none" : "1px solid var(--btn-border)",
              }}
              aria-label={saved ? "Remove bookmark" : "Bookmark article"}
            >
              <BookmarkIcon filled={saved} />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center active:scale-90 transition-transform"
              style={{
                width: "36px", height: "36px", borderRadius: "9999px",
                background: "var(--btn-bg)",
                border: "1px solid var(--btn-border)",
              }}
              aria-label="Share article"
            >
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Zone 2: title + description + extract */}
        <div className="animate-cardReveal-d1">
          <h1
            className="font-heading font-bold"
            style={{
              fontSize: "clamp(22px, 5.5vw, 30px)",
              lineHeight: "1.1",
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "4px",
            }}
          >
            {article.displayTitle}
          </h1>

          {article.description && (
            <p
              className="font-body"
              style={{
                fontSize: "13px", lineHeight: "1.35",
                color: "var(--text-secondary)", marginBottom: "10px",
                display: "-webkit-box", WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}
            >
              {article.description}
            </p>
          )}

          <p
            className="font-body"
            style={{
              fontSize: "14px", lineHeight: "1.65",
              color: "var(--on-surface)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.extract}
          </p>
          {hasMore && (
            <button
              onClick={() => { haptic.light(); setExpanded(true); }}
              className="font-body font-semibold transition-opacity hover:opacity-70"
              style={{ fontSize: "12px", color: "var(--accent)", marginTop: "4px", display: "block" }}
            >
              Read more ›
            </button>
          )}
        </div>

        {/* Zone 3: Wikipedia link + related pills (hidden when reader open) */}
        <div className="animate-cardReveal-d2" style={{ marginTop: "14px" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={article.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{
                fontSize: "11.5px", padding: "4px 11px", borderRadius: "9999px",
                border: "1px solid var(--btn-border)",
                color: "var(--text-secondary)", whiteSpace: "nowrap",
              }}
            >
              Wikipedia <ArrowIcon />
            </a>

            {article.relatedTopics.map((topic) => (
              <button
                key={topic.title}
                onClick={() => { haptic.light(); onExplore?.(topic.title); }}
                className="font-body font-medium transition-opacity hover:opacity-70 active:scale-95"
                style={{
                  fontSize: "11.5px", padding: "4px 11px", borderRadius: "9999px",
                  border: "1px solid var(--chip-border)",
                  background: "var(--btn-bg)",
                  color: "var(--text-tertiary)", whiteSpace: "nowrap",
                  maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-screen reader sheet ─────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => { haptic.light(); setExpanded(false); }}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: expanded ? 1 : 0,
          pointerEvents: expanded ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
          height: "88dvh",
          background: "var(--drawer-bg)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid var(--drawer-border)",
          display: "flex", flexDirection: "column",
          transform: expanded ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--on-surface-faint)" }} />
        </div>

        {/* Header: title + close */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "4px 20px 12px",
          borderBottom: "1px solid var(--drawer-divider)",
          gap: "12px",
        }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--accent)", marginBottom: "4px",
            }}>
              {article.categories[0] ?? "Article"}
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "19px", fontWeight: 700,
              letterSpacing: "-0.02em", lineHeight: "1.15",
              color: "var(--on-surface)",
            }}>
              {article.displayTitle}
            </h2>
          </div>
          <button
            onClick={() => { haptic.light(); setExpanded(false); }}
            style={{
              flexShrink: 0, width: "32px", height: "32px",
              borderRadius: "9999px", border: "none",
              background: "var(--btn-bg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", marginTop: "2px",
            }}
            aria-label="Close reader"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--btn-icon)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: "auto",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          padding: "20px 20px 32px",
        }}>
          {article.description && (
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "14px", fontWeight: 500,
              color: "var(--on-surface-low)",
              lineHeight: "1.4", marginBottom: "16px",
              fontStyle: "italic",
            }}>
              {article.description}
            </p>
          )}
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "15px", lineHeight: "1.75",
            color: "var(--on-surface)",
          }}>
            {article.extractFull}
          </p>

          {/* Wikipedia link at bottom */}
          <a
            href={article.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              marginTop: "28px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px", fontWeight: 500,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            Read full article on Wikipedia <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "var(--accent-fg)" : "none"}
      stroke={filled ? "var(--accent-fg)" : "var(--btn-icon)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="var(--btn-icon)"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
