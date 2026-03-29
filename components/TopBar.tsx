"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { APP_NAME } from "@/lib/config/tokens";

// A small fallback shown instantly while the API fetch is in flight.
// Replaced as soon as real facts arrive — usually within ~1s.
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

// px per frame at 60 fps → ~24 px/s, smooth on any device
const SCROLL_SPEED = 0.4;

export default function TopBar() {
  const [isDragging, setIsDragging] = useState(false);
  // Start with fallback, swap in real facts once fetched
  const [rawFacts, setRawFacts] = useState<string[]>(FALLBACK_FACTS);

  // Fetch truly random facts from our API route on every mount
  useEffect(() => {
    fetch("/api/facts?count=30")
      .then((r) => r.ok ? r.json() : null)
      .then((data: string[] | null) => {
        if (data && data.length >= 5) {
          setRawFacts(data);
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  // Shuffle and duplicate for seamless loop.
  // Recalculates when rawFacts changes (fallback → real facts swap).
  const facts = useMemo(() => {
    const s = shuffle(rawFacts);
    return [...s, ...s];
  }, [rawFacts]);

  // ── rAF refs — mutations only, no re-renders ──
  const innerRef     = useRef<HTMLDivElement>(null);
  const offsetRef    = useRef(0);
  const halfRef      = useRef(0);   // reset to 0 when facts change so width recalculates
  const pausedRef    = useRef(false);
  const dragging     = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartOff = useRef(0);

  // When facts swap in, the inner div's width changes — reset halfRef so
  // the loop recalculates on the next tick instead of looping at wrong position.
  useEffect(() => {
    halfRef.current = 0;
    offsetRef.current = 0;
  }, [facts]);

  // rAF loop — runs once, reads refs on every frame
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

  // ── touch handlers ──
  function onTouchStart(e: React.TouchEvent) {
    dragging.current = true; setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartOff.current = offsetRef.current;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const half = halfRef.current; if (!half) return;
    const dx = dragStartX.current - e.touches[0].clientX;
    offsetRef.current = ((dragStartOff.current + dx) % half + half) % half;
  }
  function onTouchEnd() { dragging.current = false; setIsDragging(false); }

  // ── mouse handlers ──
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true; setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartOff.current = offsetRef.current;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const half = halfRef.current; if (!half) return;
    const dx = dragStartX.current - e.clientX;
    offsetRef.current = ((dragStartOff.current + dx) % half + half) % half;
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
        className="flex items-center justify-center"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: "10px",
        }}
      >
        <span
          className="font-heading font-bold select-none"
          style={{ fontSize: "19px", color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {nameMain}<span style={{ color: "var(--accent)" }}>{nameAccent}</span>
        </span>
      </div>

      {/* Ticker row — JS-driven scroll, draggable */}
      <div
        className="relative"
        style={{
          overflow: "hidden",
          background: "var(--accent)",
          paddingTop: "5px",
          paddingBottom: "5px",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
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
                fontSize: "10px",
                letterSpacing: "0.07em",
                color: "#0D0D0D",
                whiteSpace: "nowrap",
                paddingRight: "52px",
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
              paddingRight: "10px",
              paddingLeft: "24px",
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
