// Bookmark service — business logic for saving/removing articles.
// Delegates to the storage adapter; never imports a DB client directly.
// To upgrade storage: change lib/storage/index.ts — this file stays identical.

import { storage } from "@/lib/storage";

const KEY = "weels:bookmarks";
const MAX_BOOKMARKS = 200;

export interface BookmarkItem {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  pageUrl: string;
  savedAt: number;
}

interface BookmarkStore {
  items: BookmarkItem[];
}

export function getBookmarks(): BookmarkItem[] {
  const store = storage.get<BookmarkStore>(KEY);
  return store?.items ?? [];
}

export function isBookmarked(id: number): boolean {
  return getBookmarks().some((b) => b.id === id);
}

export function addBookmark(item: Omit<BookmarkItem, "savedAt">): void {
  const items = getBookmarks().filter((b) => b.id !== item.id);
  const next: BookmarkItem[] = [
    { ...item, savedAt: Date.now() },
    ...items,
  ].slice(0, MAX_BOOKMARKS); // FIFO eviction
  storage.set<BookmarkStore>(KEY, { items: next });
}

export function removeBookmark(id: number): void {
  const items = getBookmarks().filter((b) => b.id !== id);
  storage.set<BookmarkStore>(KEY, { items });
}

export function toggleBookmark(item: Omit<BookmarkItem, "savedAt">): boolean {
  if (isBookmarked(item.id)) {
    removeBookmark(item.id);
    return false;
  }
  addBookmark(item);
  return true;
}
