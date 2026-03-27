"use client";

import { useSyncExternalStore, useCallback } from "react";
import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  BookmarkItem,
} from "@/lib/services/bookmarks";

// Subscribe to localStorage changes so all components stay in sync
function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribe,
    getBookmarks,
    () => [] // server snapshot
  );

  const toggle = useCallback(
    (item: Omit<BookmarkItem, "savedAt">) => {
      toggleBookmark(item);
      // Trigger re-render for same-tab subscribers
      window.dispatchEvent(new Event("storage"));
    },
    []
  );

  const check = useCallback((id: number) => isBookmarked(id), []);

  return { bookmarks, toggle, isBookmarked: check };
}
