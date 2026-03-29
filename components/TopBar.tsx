"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { APP_NAME } from "@/lib/config/tokens";

const FALLBACK_FACTS = [
  "Wikipedia has over 6.7 million articles in English alone",
  "Honey never expires — 3,000-year-old honey found in Egyptian tombs was still edible",
  "Sharks are older than trees — they've existed for over 400 million years",
  "A day on Venus is longer than a year on Venus",
  "Octopuses have three hearts, nine brains, and blue blood",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SCROLL_SPEED = 0.4;

interface TopBarProps {
  onBookmarksOpen: () => void;
  onSearchOpen: () => void;
}

export default function TopBar({ onBookmarksOpen, onSearchOpen }: TopBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rawFacts, setRawFacts]     = useState<string[]>(FALLBACK_FACTS);

  useEffect(() => {
    fetch("/api/facts?count=30")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: string[] | null) => {
        if (data && data.length >= 5) setRawFacts(data);
      })
      .catch(() => {});
  }, []);

  const facts = useMemo(() => {
    const s = shuffle(rawFacts);
    return [...s, ...s];
  }, [rawFacts]);

  const innerRef     = useRef<HTMLDivElement>(null);
  const offsetRef    = useRef(0);
  const halfRef      = useRef(0);
  const pausedRef    = useRef(false);
  const dragging     = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartOff = useRef(0);

  useEffect(() => {
    halfRef.current   = 0;
    offsetRef.current = 0;
  }, [facts]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    let raf: number;
    function tick() {
      if (!pausedRef.current && !dragging.current) {
        offsetRef.current += SCROLL_SPEED;
        const half = halfRef.current || el!.scrollWidth / 2;
        halfRef.current = half;
        if (offsetRef.current >= half) offsetRef.current -= half;
      }
      el!.style.transform = `translateX(${-offsetRef.current}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    dragging.current = true; setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartOff.current = offsetRef.current;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const half = halfRef.current; if (!half) return;
    offsetRef.current = ((dragStartOff.current + (dragStartX.current - e.touches[0].clientX)) % half + half) % half;
  }
  function onTouchEnd() { dragging.current = false; setIsDragging(false); }

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true; setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartOff.current = offsetRef.current;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const half = halfRef.current; if (!half) return;
    offsetRef.current = ((dragStartOff.current + (dragStartX.current - e.clientX)) % half + half) % half;
  }
  function onMouseUp() { dragging.current = false; setIsDragging(false); }

  const nameMain   = APP_NAME.slice(0, -2);
  const nameAccent = APP_NAME.slice(-2);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: "rgba(13,13,13,0.75)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Wordmark row */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: "10px",
        }}
      >
        {/* Search button — left */}
        <button
          onClick={onSearchOpen}
          className="flex items-center justify-center active:scale-90 transition-transform"
          style={{
            width: "36px", height: "36px", borderRadius: "9999px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
          aria-label="Search Wikipedia"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.70)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Wordmark — centred */}
        <span
          className="font-heading font-bold select-none"
          style={{ fontSize: "19px", color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {nameMain}<span style={{ color: "var(--accent)" }}>{nameAccent}</span>
        </span>

        {/* Bookmarks button — top right */}
        <button
          onClick={onBookmarksOpen}
          className="flex items-center justify-center active:scale-90 transition-transform"
          style={{
            width: "36px", height: "36px", borderRadius: "9999px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
          aria-label="Open saved articles"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.70)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Ticker row */}
      <div
        className="relative"
        style={{
          overflow: "hidden", background: "var(--accent)",
          paddingTop: "5px", paddingBottom: "5px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none", WebkitUserSelect: "none",
        }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; dragging.current = false; setIsDragging(false); }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          ref={innerRef}
          style={{ display: "flex", width: "max-content", willChange: "transform" }}
        >
          {facts.map((fact, i) => (
            <span
              key={i}
              className="font-body font-bold uppercase"
              style={{
                fontSize: "10px", letterSpacing: "0.07em",
                color: "#0D0D0D", whiteSpace: "nowrap", paddingRight: "52px",
              }}
            >
              ★ {fact}
            </span>
          ))}
        </div>

        {isDragging && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pointer-events-none"
            style={{
              paddingRight: "10px", paddingLeft: "24px",
              background: "linear-gradient(to right, transparent, var(--accent) 40%)",
            }}
          >
            <span
              className="font-body font-bold uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(0,0,0,0.5)" }}
            >
              ‹ drag ›
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
