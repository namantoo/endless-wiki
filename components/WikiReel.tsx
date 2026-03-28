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
    const el = bookmarkRef.current;
    if (el) {
      el.classList.remove("animate-bookmarkPulse");
      void el.offsetWidth;
      el.classList.add("animate-bookmarkPulse");
    }
  }, [article, toggle]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: article.pageUrl });
      } catch { /* cancelled */ }
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
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.35s ease",
      }}
    >
      {/* ── Background ─────────────────────────────────────── */}
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
          {/* Gradient — lighter at top, heavier only near bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(13,13,13,0.65) 0%, rgba(13,13,13,0.25) 40%, transparent 70%)",
            }}
          />
        </>
      ) : (
        <>
          {/* Fallback gradient */}
          <div
            className="absolute inset-0"
            style={{ background: getGradient(article.colorSeed) }}
          />
          {/* Dot texture overlay — adds depth on no-image cards */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </>
      )}

      {/* ── Right action rail ──────────────────────────────── */}
      <div
        className="absolute right-4 flex flex-col gap-3"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <button
          ref={bookmarkRef}
          onClick={handleBookmark}
          className="flex items-center justify-center active:scale-90 transition-transform"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "9999px",
            background: saved
              ? "var(--accent)"
              : "rgba(13,13,13,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: saved
              ? "none"
              : "1px solid rgba(255,255,255,0.14)",
          }}
          aria-label={saved ? "Remove bookmark" : "Bookmark article"}
        >
          <BookmarkIcon filled={saved} />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center active:scale-90 transition-transform"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "9999px",
            background: "rgba(13,13,13,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
          aria-label="Share article"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── Content — frosted glass bottom-sheet panel ─────── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          background: "rgba(13,13,13,0.78)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "20px 22px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
        }}
      >
        {/* Zone 1: Category chip — filled lime pill */}
        <div className="animate-cardReveal" style={{ marginBottom: "10px" }}>
          {article.categories[0] && (
            <span
              className="font-body font-bold uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.09em",
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "var(--accent)",
                color: "#0D0D0D",
                display: "inline-block",
                lineHeight: "1.6",
              }}
            >
              {article.categories[0]}
            </span>
          )}
        </div>

        {/* Zone 2: Title + description + extract */}
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
                fontSize: "13px",
                lineHeight: "1.35",
                color: "var(--text-secondary)",
                marginBottom: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {article.description}
            </p>
          )}

          <p
            className="font-body"
            style={{
              fontSize: "14px",
              lineHeight: "1.65",
              color: "rgba(255,255,255,0.80)",
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
              className="font-body font-semibold transition-opacity hover:opacity-70"
              style={{
                fontSize: "12px",
                color: "var(--accent)",
                marginTop: "4px",
                display: "block",
              }}
            >
              {expanded ? "Show less" : "Read more ›"}
            </button>
          )}
        </div>

        {/* Zone 3: Wikipedia link + related pills */}
        <div className="animate-cardReveal-d2" style={{ marginTop: "14px" }}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Wikipedia link — styled as an outlined pill */}
            <a
              href={article.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{
                fontSize: "11.5px",
                padding: "4px 11px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              Wikipedia
              <ArrowIcon />
            </a>

            {/* Related topic pills */}
            {article.relatedTopics.map((topic) => (
              <a
                key={topic.title}
                href={topic.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-medium transition-opacity hover:opacity-70"
                style={{
                  fontSize: "11.5px",
                  padding: "4px 11px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                  maxWidth: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {topic.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? "#0D0D0D" : "none"}
      stroke={filled ? "#0D0D0D" : "rgba(255,255,255,0.75)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="rgba(255,255,255,0.75)"
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
