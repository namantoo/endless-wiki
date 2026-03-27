"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WikiArticle } from "@/types/wiki";
import WikiReel from "./WikiReel";

export default function ReelFeed() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fetchArticles = useCallback(async (count = 5) => {
    try {
      const res = await fetch(`/api/wiki?count=${count}`);
      const data: WikiArticle[] = await res.json();
      return data;
    } catch {
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchArticles(5).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [fetchArticles]);

  // Prefetch more when near the end
  useEffect(() => {
    if (articles.length === 0) return;
    if (activeIndex >= articles.length - 2 && !fetchingMore) {
      setFetchingMore(true);
      fetchArticles(5).then((more) => {
        setArticles((prev) => [...prev, ...more]);
        setFetchingMore(false);
      });
    }
  }, [activeIndex, articles.length, fetchingMore, fetchArticles]);

  // Intersection observer to track active reel
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [articles]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-sm">Loading articles…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      {articles.map((article, i) => (
        <div
          key={`${article.id}-${i}`}
          ref={(el) => { itemRefs.current[i] = el; }}
          className="snap-start snap-always h-screen w-full"
        >
          <WikiReel article={article} isActive={i === activeIndex} />
        </div>
      ))}

      {fetchingMore && (
        <div className="h-screen w-full flex items-center justify-center bg-black snap-start">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
