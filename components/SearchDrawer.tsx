"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SearchResult {
  title: string;
  description: string;
}

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}

const ACTION_API = "https://en.wikipedia.org/w/api.php";

export default function SearchDrawer({ open, onClose, onSelect }: SearchDrawerProps) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when drawer opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Debounced search — fires 300ms after the user stops typing
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setLoading(false); return; }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        // Wikipedia opensearch: returns [query, [titles], [descriptions], [urls]]
        const params = new URLSearchParams({
          action: "query",
          list: "search",
          srsearch: q,
          srlimit: "8",
          srprop: "snippet",
          format: "json",
          origin: "*",
        });
        const res  = await fetch(`${ACTION_API}?${params}`);
        const data = await res.json();
        const hits = (data?.query?.search ?? []) as Array<{
          title: string;
          snippet: string;
        }>;

        setResults(
          hits.map((h) => ({
            title: h.title,
            // Snippets have <span> highlights — strip tags for plain text
            description: h.snippet.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').slice(0, 100),
          }))
        );
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  function handleSelect(title: string) {
    onSelect(title);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 101,
          maxHeight: "88dvh",
          background: "#161616",
          borderRadius: "22px 22px 0 0",
          borderTop: "1px solid rgba(255,255,255,0.10)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.30s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex", flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Pull handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* Search input */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 16px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
            placeholder="Search Wikipedia…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "17px", fontWeight: 500,
              color: "rgba(255,255,255,0.90)",
              caretColor: "#C6FF47",
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}>
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.10)",
                borderTopColor: "#C6FF47",
                animation: "spin 0.7s linear infinite",
              }} />
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div style={{
              padding: "40px 24px", textAlign: "center",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "14px", color: "rgba(255,255,255,0.32)",
            }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.length === 0 && !query.trim() && (
            <div style={{
              padding: "32px 24px", textAlign: "center",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "14px", color: "rgba(255,255,255,0.28)", lineHeight: 1.6,
            }}>
              Search any topic —<br />quantum physics, ancient Rome, anything.
            </div>
          )}

          {results.map((r) => (
            <button
              key={r.title}
              onClick={() => handleSelect(r.title)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                width: "100%", padding: "13px 20px", gap: "3px",
                background: "none", border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "15px", fontWeight: 700,
                color: "rgba(255,255,255,0.90)", letterSpacing: "-0.01em",
              }}>
                {r.title}
              </span>
              {r.description && (
                <span style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.4,
                }}>
                  {r.description}
                </span>
              )}
            </button>
          ))}

          {results.length > 0 && (
            <div style={{ height: "16px" }} />
          )}
        </div>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.40)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
