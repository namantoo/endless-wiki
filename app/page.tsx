"use client";

// page.tsx — state hub for the app.
// Owns: selectedCategory, streak/today count.
// Renders: TopBar → CategoryFilterBar → ReelFeed (inside ErrorBoundary).

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useSession } from "@/lib/hooks/useSession";

// ReelFeed is client-only (IntersectionObserver, scroll)
const ReelFeed = dynamic(() => import("@/components/ReelFeed"), { ssr: false });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { streak, todayCount, trackView } = useSession();

  const handleCategoryChange = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
  }, []);

  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "var(--surface-0)", height: "100dvh" }}
    >
      <TopBar streak={streak} todayCount={todayCount} />
      <CategoryFilterBar
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />

      {/* Padding to account for fixed TopBar + CategoryFilterBar (~96px total) */}
      <div style={{ height: "100dvh", paddingTop: "96px" }}>
        <ErrorBoundary>
          <ReelFeed
            selectedCategory={selectedCategory}
            onActiveIndexChange={trackView}
          />
        </ErrorBoundary>
      </div>
    </main>
  );
}
