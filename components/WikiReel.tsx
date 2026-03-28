"use client";

import { useState, useCallback } from "react";
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

  const handleBookmark = useCallback(() => {
    toggle({
      id: article.id,
      title: article.title,
      description: article.description,
      thumbnail: article.thumbnail?.source,
      pageUrl: article.pageUrl,
    });
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
    // Single style prop — height + opacity merged to avoid duplicate-attribute error
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
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.2) 60%, transparent 100%)",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: getGradient(article.colorSeed) }}
        />
      )}

      {/* ── Right action rail ──────────────────────────────────── */}
      <div
        className="absolute right-4 flex flex-col gap-4"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 140px)" }}
      >
        <button
          onClick={handleBookmark}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "9999px",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            border: saved ? "1px solid var(--accent-border)" : "1px solid var(--border)",
          }}
          aria-label={saved ? "Remove bookmark" : "Bookmark article"}
        >
          <BookmarkIcon filled={saved} />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "9999px",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border)",
          }}
          aria-label="Share article"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── Content — absolute bottom so it's always anchored to screen bottom */}
      <div
        className="absolute left-0 right-0 bottom-0 animate-fadeUp"
        style={{
          padding: "0 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
        }}
      >
        {/* Category chip */}
        {article.categories[0] && (
          <div className="mb-2">
            <span
              className="font-heading font-semibold uppercase tracking-widest"
              style={{
                fontSize: "11px",
                color: "var(--accent-light)",
                letterSpacing: "0.08em",
              }}
            >
              {article.categories[0]}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="font-heading font-bold mb-1"
          style={{
            fontSize: "clamp(24px, 5vw, 32px)",
            lineHeight: "1.1",
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
            className="font-body mb-2"
            style={{
              fontSize: "13px",
              lineHeight: "1.3",
              color: "var(--text-secondary)",
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
        <div className="mb-2">
          <p
            className="font-body"
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "var(--text-primary)",
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
              className="font-body font-medium mt-1 transition-opacity hover:opacity-70"
              style={{ fontSize: "12px", color: "var(--accent-light)" }}
            >
              {expanded ? "Show less" : "Read more ›"}
            </button>
          )}
        </div>

        {/* Open in Wikipedia */}
        <a
          href={article.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-heading font-semibold mb-3 transition-opacity hover:opacity-70"
          style={{ fontSize: "12px", color: "var(--text-tertiary)" }}
        >
          Open in Wikipedia
          <ExternalIcon />
        </a>

        {/* Related topic pills */}
        {article.relatedTopics.length > 0 && (
          <div className="flex gap-2 scrollbar-none" style={{ overflowX: "auto" }}>
            {article.relatedTopics.map((topic) => (
              <a
                key={topic.title}
                href={topic.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 font-heading font-medium transition-all hover:opacity-80"
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  border: "1px solid var(--border-strong)",
                  background: "rgba(255,255,255,0.06)",
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
  );
}

// ─── Icons ────────────────────────────────────────────────────────

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "rgba(255,255,255,0.8)"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="rgba(255,255,255,0.8)"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
