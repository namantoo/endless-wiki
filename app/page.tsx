"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import SwipeHint from "@/components/SwipeHint";
import BookmarksDrawer from "@/components/BookmarksDrawer";

const ReelFeed = dynamic(() => import("@/components/ReelFeed"), { ssr: false });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarksOpen, setBookmarksOpen]         = useState(false);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
  }, []);

  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "var(--surface-0)", height: "100dvh" }}
    >
      <TopBar onBookmarksOpen={() => setBookmarksOpen(true)} />
      <CategoryFilterBar selected={selectedCategory} onChange={handleCategoryChange} />
      <ErrorBoundary>
        <ReelFeed selectedCategory={selectedCategory} />
      </ErrorBoundary>

      <SwipeHint />
      <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
    </main>
  );
}
