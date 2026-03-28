"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { WikiArticle } from "@/types/wiki";
import WikiReel from "./WikiReel";
import SkeletonReel from "./SkeletonReel";

const DOM_CAP = 40;      // max articles in DOM at once
const TRIM_BATCH = 5;    // how many to remove from front when capping
const PREFETCH_AHEAD = 2; // prefetch when N articles from the end

interface ReelFeedProps {
  selectedCategory: string | null;
  onActiveIndexChange?: (index: number) => void;
}

export default function ReelFeed({
  selectedCategory,
  onActiveIndexChange,
}: ReelFeedProps) {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0); // avoid stale closure in keydown handler

  // ─── Fetch helpers ──────────────────────────────────────────────

  const fetchArticles = useCallback(async (count = 5): Promise<WikiArticle[]> => {
    try {
      const param = selectedCategory
        ? `&topic=${encodeURIComponent(selectedCategory)}`
        : "";
      const res = await fetch(`/api/wiki?count=${count}${param}`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }, [selectedCategory]);

  // ─── Initial load / category change ────────────────────────────

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    setActiveIndex(0);
    activeIndexRef.current = 0;
    itemRefs.current = [];

    fetchArticles(5).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [fetchArticles]); // selectedCategory is captured in fetchArticles

  // ─── Prefetch + DOM cap ─────────────────────────────────────────

  useEffect(() => {
    if (articles.length === 0 || fetchingMore) return;
    if (activeIndex < articles.length - PREFETCH_AHEAD) return;

    setFetchingMore(true);
    fetchArticles(5).then((more) => {
      setArticles((prev) => {
        const combined = [...prev, ...more];
        if (combined.length <= DOM_CAP) {
          return combined;
        }
        // Trim oldest articles from front, keep activeIndex in sync
        const trimmed = combined.slice(TRIM_BATCH);
        setActiveIndex((ai) => Math.max(0, ai - TRIM_BATCH));
        activeIndexRef.current = Math.max(0, activeIndexRef.current - TRIM_BATCH);
        itemRefs.current = itemRefs.current.slice(TRIM_BATCH);
        return trimmed;
      });
      setFetchingMore(false);
    });
  }, [activeIndex, articles.length, fetchingMore, fetchArticles]);

  // ─── Intersection observer ──────────────────────────────────────

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setActiveIndex(idx);
              activeIndexRef.current = idx;
              onActiveIndexChange?.(idx);
            }
          }
        }
      },
      { threshold: 0.6 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [articles, onActiveIndexChange]);

  // ─── Keyboard navigation ────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        itemRefs.current[activeIndexRef.current + 1]?.scrollIntoView({
          behavior: "smooth",
        });
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        itemRefs.current[activeIndexRef.current - 1]?.scrollIntoView({
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ─── Render ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="w-full overflow-hidden" style={{ height: "100dvh" }}>
        <SkeletonReel />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll snap-y snap-mandatory scrollbar-none"
      style={{ height: "100dvh" }}
    >
      {articles.map((article, i) => (
        <div
          key={`${article.id}-${i}`}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="snap-start snap-always w-full"
          style={{ height: "100dvh" }}
        >
          <WikiReel article={article} isActive={i === activeIndex} />
        </div>
      ))}

      {/* Loading more indicator — sequential pulse dots */}
      {fetchingMore && (
        <div
          className="snap-start snap-always w-full flex items-center justify-center gap-2"
          style={{ height: "100dvh", background: "var(--surface-0)" }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "9999px",
                background: "var(--accent)",
                opacity: 0.5,
                animation: `dotPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
