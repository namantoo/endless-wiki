"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { WikiArticle } from "@/types/wiki";
import { getGradient } from "@/lib/config/gradients";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

interface WikiReelProps {
  article: WikiArticle;
  isActive: boolean;
}

export default function WikiReel({ article, isActive }: WikiReelProps) {
  const [expanded, setExpanded] = useState(false);
  const { toggle, isBookmarked } = useBookmarks();
  const saved = isBookmarked(article.id);
  const bookmarkRef = useRef<HTMLButtonElement>(null);

  const handleBookmark = useCallback(() => {
    toggle({
      id: article.id,
      title: article.title,
      description: article.description,
      thumbnail: article.thumbnail?.source,
      pageUrl: article.pageUrl,
    });
    // Trigger pulse animation
    const el = bookmarkRef.current;
    if (el) {
      el.classList.remove("animate-bookmarkPulse");
      void el.offsetWidth; // reflow to restart animation
      el.classList.add("animate-bookmarkPulse");
    }
  }, [article, toggle]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: article.pageUrl });
      } catch {
        // User cancelled or not supported
      }
    } else {
      await navigator.clipboard.writeText(article.pageUrl).catch(() => {});
    }
  }, [article]);

  const hasMore = article.extractFull.length > article.extract.length;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "100dvh",
        opacity: isActive ? 1 : 0.45,
        transition: "opacity 0.4s ease",
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
              transition: "transform 0.6s ease",
              transform: isActive ? "scale(1)" : "scale(1.03)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,8,0.97) 0%, rgba(10,10,8,0.85) 18%, rgba(10,10,8,0.45) 45%, rgba(10,10,8,0.08) 70%, transparent 100%)",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: getGradient(article.colorSeed) }}
        />
      )}

      {/* ── Right action rail — vertically centered ──────────── */}
      <div
        className="absolute right-4 flex flex-col gap-4"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <button
          ref={bookmarkRef}
          onClick={handleBookmark}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: saved ? "var(--accent-dim)" : "rgba(10,10,8,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: saved ? "1px solid var(--accent-border)" : "none",
          }}
          aria-label={saved ? "Remove bookmark" : "Bookmark article"}
        >
          <BookmarkIcon filled={saved} />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "rgba(10,10,8,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          aria-label="Share article"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── Content — three-zone layout anchored to bottom ────── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          padding: "0 24px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        }}
      >
        {/* Zone 1: Identity */}
        <div className="animate-cardReveal">
          {article.categories[0] && (
            <>
              <span
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: "10.5px",
                  color: "var(--accent-light)",
                  letterSpacing: "0.06em",
                  lineHeight: "1.2",
                }}
              >
                {article.categories[0]}
              </span>
              {/* Decorative rule */}
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--accent)",
                  opacity: 0.4,
                  marginTop: "6px",
                  marginBottom: "10px",
                }}
              />
            </>
          )}
        </div>

        {/* Zone 2: Core */}
        <div className="animate-cardReveal-d1">
          {/* Title */}
          <h1
            className="font-heading font-semibold"
            style={{
              fontSize: "clamp(26px, 5vw, 34px)",
              lineHeight: "1.12",
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.displayTitle}
          </h1>

          {/* Wikidata description */}
          {article.description && (
            <p
              className="font-body"
              style={{
                fontSize: "13px",
                lineHeight: "1.35",
                color: "var(--text-secondary)",
                marginTop: "4px",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {article.description}
            </p>
          )}

          {/* Extract */}
          <div style={{ marginTop: "12px" }}>
            <p
              className="font-body"
              style={{
                fontSize: "14.5px",
                lineHeight: "1.7",
                color: "rgba(255, 252, 245, 0.82)",
                letterSpacing: "0.005em",
                display: expanded ? "block" : "-webkit-box",
                WebkitLineClamp: expanded ? undefined : 3,
                WebkitBoxOrient: expanded ? undefined : "vertical",
                overflow: "hidden",
              }}
            >
              {expanded ? article.extractFull : article.extract}
            </p>
            {hasMore && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="font-body font-medium transition-opacity hover:opacity-70"
                style={{
                  fontSize: "12px",
                  color: "var(--accent-light)",
                  marginTop: "4px",
                }}
              >
                {expanded ? "Show less" : "Read more \u203a"}
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Actions */}
        <div className="animate-cardReveal-d2" style={{ marginTop: "16px" }}>
          {/* Wikipedia link */}
          <a
            href={article.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body font-medium transition-opacity hover:opacity-70"
            style={{ fontSize: "12px", color: "var(--text-tertiary)" }}
          >
            Wikipedia
            <ArrowIcon />
          </a>

          {/* Related topic pills */}
          {article.relatedTopics.length > 0 && (
            <div
              className="flex gap-2 scrollbar-none"
              style={{ overflowX: "auto", marginTop: "12px" }}
            >
              {article.relatedTopics.map((topic) => (
                <a
                  key={topic.title}
                  href={topic.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 font-body font-medium transition-all hover:opacity-80"
                  style={{
                    fontSize: "11.5px",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    background: "var(--surface-3)",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    maxWidth: "160px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {topic.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "rgba(255,252,245,0.7)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="rgba(255,252,245,0.7)"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
