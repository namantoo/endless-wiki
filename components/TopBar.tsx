"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { APP_NAME } from "@/lib/config/tokens";

// Row 1: streak · wordmark · today count
// Row 2: scrolling fact ticker — shuffled randomly on each page load

// 30 facts — enough that one full scroll takes ~90s, so repeats are never noticeable
const ALL_FACTS = [
  "Honey never expires — 3,000-year-old honey found in Egyptian tombs was still edible",
  "A group of flamingos is called a flamboyance",
  "Cleopatra lived closer in time to the Moon landing than to the Great Pyramid's construction",
  "Sharks are older than trees — they've existed for over 400 million years",
  "The word 'nerd' was first coined by Dr. Seuss in 1950",
  "Wombat poop is cube-shaped — the only known animal to produce cube-shaped waste",
  "The Eiffel Tower grows up to 15 cm taller in summer due to thermal expansion",
  "A day on Venus is longer than a year on Venus",
  "Octopuses have three hearts, nine brains, and blue blood",
  "The shortest war in history lasted 38 to 45 minutes — Britain vs Zanzibar, 1896",
  "There are more possible iterations of a chess game than atoms in the observable universe",
  "A group of crows is called a murder",
  "The average person walks the equivalent of five times around the Earth in their lifetime",
  "Bananas are slightly radioactive due to naturally occurring potassium-40",
  "Oxford University is older than the Aztec Empire",
  "The dot over the letters 'i' and 'j' is called a tittle",
  "Vending machines kill more people per year than sharks",
  "The smell of rain on dry earth has a name — petrichor",
  "Scotland's national animal is the unicorn",
  "A group of owls is called a parliament",
  "Humans share 50% of their DNA with bananas",
  "The moon is moving away from Earth at approximately 3.8 cm per year",
  "Nintendo was founded in 1889 — originally as a playing card company",
  "There are more stars in the universe than grains of sand on all of Earth's beaches",
  "Butterflies taste with their feet",
  "The heart of a blue whale is so large a human could crawl through its arteries",
  "It rains diamonds on Neptune and Uranus",
  "A group of porcupines is called a prickle",
  "The inventor of the frisbee was turned into a frisbee after he died — he requested it",
  "Cleopatra's reign was closer to the invention of the iPhone than to the construction of the Great Pyramid",
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// px per frame at 60 fps  →  ~24 px/s
// Total content width ≈ 30 facts × ~500px each = ~15 000px → full loop ≈ 625 s ≈ 10 min
// Feels leisurely on any device; adjust here only.
const SCROLL_SPEED = 0.4;

interface TopBarProps {
  streak: number;
  todayCount: number;
}

export default function TopBar({ streak, todayCount }: TopBarProps) {
  // ── ticker state (only used for UI indicator) ──
  const [isDragging, setIsDragging] = useState(false);

  // ── rAF refs — no re-renders ──
  const innerRef  = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);          // current translateX magnitude (px)
  const halfRef   = useRef(0);          // half-width of inner div (seamless loop point)
  const pausedRef = useRef(false);      // hover/keyboard pause
  const dragging  = useRef(false);      // touch/mouse drag in progress
  const dragStartX    = useRef(0);
  const dragStartOff  = useRef(0);

  // Shuffle once on mount; duplicate for seamless loop
  const facts = useMemo(() => {
    const s = shuffle(ALL_FACTS);
    return [...s, ...s];
  }, []);

  // rAF loop
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

  // ── touch drag handlers ──
  function onTouchStart(e: React.TouchEvent) {
    dragging.current = true;
    setIsDragging(true);
    dragStartX.current   = e.touches[0].clientX;
    dragStartOff.current = offsetRef.current;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return;
    const dx   = dragStartX.current - e.touches[0].clientX;
    const half = halfRef.current;
    if (!half) return;
    let next = dragStartOff.current + dx;
    // wrap into [0, half)
    next = ((next % half) + half) % half;
    offsetRef.current = next;
  }

  function onTouchEnd() {
    dragging.current = false;
    setIsDragging(false);
  }

  // ── mouse drag handlers (desktop) ──
  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    setIsDragging(true);
    dragStartX.current   = e.clientX;
    dragStartOff.current = offsetRef.current;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx   = dragStartX.current - e.clientX;
    const half = halfRef.current;
    if (!half) return;
    let next = dragStartOff.current + dx;
    next = ((next % half) + half) % half;
    offsetRef.current = next;
  }

  function onMouseUp() {
    dragging.current = false;
    setIsDragging(false);
  }

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
      {/* Row 1: streak / wordmark / count */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
          paddingBottom: "10px",
        }}
      >
        {/* Streak — always visible; dims to 0.28 when streak = 0 */}
        <div className="w-20 flex items-center gap-1.5">
          <span
            className="flex items-center gap-1 font-body font-bold"
            style={{
              fontSize: "13px",
              color: "var(--streak)",
              opacity: streak >= 1 ? 1 : 0.28,
              transition: "opacity 0.3s ease",
            }}
          >
            <FireIcon />
            {streak >= 1 ? streak : ""}
          </span>
        </div>

        <span
          className="font-heading font-bold select-none"
          style={{ fontSize: "19px", color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {nameMain}<span style={{ color: "var(--accent)" }}>{nameAccent}</span>
        </span>

        <div className="w-20 flex flex-col items-end">
          {todayCount > 0 && (
            <>
              <span
                className="font-body font-bold"
                style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1" }}
              >
                {todayCount}
              </span>
              <span
                className="font-body font-semibold uppercase"
                style={{ fontSize: "8.5px", color: "var(--text-tertiary)", letterSpacing: "0.07em", marginTop: "1px" }}
              >
                today
              </span>
            </>
          )}
        </div>
      </div>

      {/* Row 2: fact ticker — JS-driven scroll, draggable */}
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
        {/* Inner strip — transformed by rAF */}
        <div
          ref={innerRef}
          style={{
            display: "flex",
            width: "max-content",
            willChange: "transform",
          }}
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

        {/* Drag-to-scroll hint — shown while dragging */}
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

function FireIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 7 14 9 11 14c-1 2-3 3-3 3s.5-2-.5-3.5C6 12 4 10.5 4 8c0-3 2.5-5.5 5-6 0 0-1 3 1 4.5C11.5 7.5 12 2 12 2zM12 22c-3.3 0-6-2.7-6-6 0-2.2 1.5-4.2 3-5.5.5 1 1.5 1.5 1.5 3 0 .8-.5 1.5-.5 1.5s3-1 3-4c1.5 1 3 3 3 5 0 3.3-2.7 6-6 6z" />
    </svg>
  );
}
