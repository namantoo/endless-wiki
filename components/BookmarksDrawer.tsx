"use client";

import { useEffect, useState, useCallback } from "react";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { BookmarkItem } from "@/lib/services/bookmarks";

interface BookmarksDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function BookmarksDrawer({ open, onClose }: BookmarksDrawerProps) {
  const { bookmarks, toggle } = useBookmarks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleRemove = useCallback(
    (item: BookmarkItem) => {
      toggle({ id: item.id, title: item.title, description: item.description, thumbnail: item.thumbnail, pageUrl: item.pageUrl });
    },
    [toggle]
  );

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 101,
          maxHeight: "80dvh",
          background: "var(--drawer-bg)",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid var(--drawer-border)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Handle + header */}
        <div
          style={{
            padding: "12px 20px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          {/* Pull handle */}
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: "2px",
              background: "var(--on-surface-faint)",
            }}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--drawer-divider)",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
              }}
            >
              Saved
              {bookmarks.length > 0 && (
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--on-surface-low)",
                  }}
                >
                  {bookmarks.length}
                </span>
              )}
            </span>

            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9999px",
                background: "var(--btn-bg)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--btn-icon)" strokeWidth="2.5"
                strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "8px 0 16px",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          }}
        >
          {bookmarks.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                gap: "10px",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="var(--on-surface-faint)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "14px",
                color: "var(--on-surface-low)",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.5,
              }}>
                No saved articles yet.<br />
                Tap <span style={{ color: "var(--on-surface-med)" }}>☆</span> on any card to save it here.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <BookmarkRow key={item.id} item={item} onRemove={handleRemove} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

function BookmarkRow({
  item,
  onRemove,
}: {
  item: BookmarkItem;
  onRemove: (item: BookmarkItem) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 20px",
        borderBottom: "1px solid var(--drawer-divider)",
      }}
    >
      {/* Thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "10px",
            objectFit: "cover",
            flexShrink: 0,
            background: "var(--surface-2)",
          }}
        />
      ) : (
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "10px",
            background: "rgba(198,255,71,0.08)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#C6FF47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      )}

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <a
          href={item.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--on-surface)",
            letterSpacing: "-0.01em",
            textDecoration: "none",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </a>
        {item.description && (
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "12px",
              color: "var(--on-surface-low)",
              margin: "2px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item)}
        style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          borderRadius: "9999px",
          background: "var(--btn-bg)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Remove bookmark"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="var(--on-surface-low)" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
