"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import SwipeHint from "@/components/SwipeHint";
import BookmarksDrawer from "@/components/BookmarksDrawer";
import SearchDrawer from "@/components/SearchDrawer";
import type { ReelFeedHandle } from "@/components/ReelFeed";

const ReelFeed = dynamic(() => import("@/components/ReelFeed"), { ssr: false });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarksOpen, setBookmarksOpen]         = useState(false);
  const [searchOpen, setSearchOpen]               = useState(false);
  const reelRef = useRef<ReelFeedHandle>(null);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
  }, []);

  const handleSearchSelect = useCallback((title: string) => {
    reelRef.current?.explore(title);
  }, []);

  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "var(--surface-0)", height: "100dvh" }}
    >
      <TopBar
        onBookmarksOpen={() => setBookmarksOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <CategoryFilterBar selected={selectedCategory} onChange={handleCategoryChange} />
      <ErrorBoundary>
        <ReelFeed ref={reelRef} selectedCategory={selectedCategory} />
      </ErrorBoundary>

      <SwipeHint />
      <BookmarksDrawer open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
      <SearchDrawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </main>
  );
}
