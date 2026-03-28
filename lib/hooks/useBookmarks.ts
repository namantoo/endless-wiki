"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  BookmarkItem,
} from "@/lib/services/bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());

    const update = () => setBookmarks(getBookmarks());
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  const toggle = useCallback(
    (item: Omit<BookmarkItem, "savedAt">) => {
      toggleBookmark(item);
      setBookmarks(getBookmarks());
      window.dispatchEvent(new Event("storage")); // notify other tabs
    },
    []
  );

  const check = useCallback((id: number) => isBookmarked(id), []);

  return { bookmarks, toggle, isBookmarked: check };
}
