"use client";

// page.tsx — state hub for the app.
// Owns: selectedCategory state.
// Renders: TopBar → CategoryFilterBar → ReelFeed (inside ErrorBoundary).

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/TopBar";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import ErrorBoundary from "@/components/ErrorBoundary";

// ReelFeed is client-only (IntersectionObserver, scroll)
const ReelFeed = dynamic(() => import("@/components/ReelFeed"), { ssr: false });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
  }, []);

  return (
    <main
      className="relative overflow-hidden"
      style={{ background: "var(--surface-0)", height: "100dvh" }}
    >
      <TopBar />
      <CategoryFilterBar
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <ErrorBoundary>
        <ReelFeed
          selectedCategory={selectedCategory}
        />
      </ErrorBoundary>
    </main>
  );
}
