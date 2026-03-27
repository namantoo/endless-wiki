// Session service — streak and daily discovery counter.
// Delegates to storage adapter; never imports a DB client.
// To persist cross-device in V2: swap storage adapter in lib/storage/index.ts.

import { storage } from "@/lib/storage";

const KEY = "weels:session";

interface SessionStore {
  streak: number;
  lastOpenDate: string; // YYYY-MM-DD
  todayCount: number;
  totalCount: number;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getSession(): SessionStore {
  return (
    storage.get<SessionStore>(KEY) ?? {
      streak: 0,
      lastOpenDate: "",
      todayCount: 0,
      totalCount: 0,
    }
  );
}

/** Call once on app open to update streak and open date. */
export function recordOpen(): SessionStore {
  const session = getSession();
  const today = todayISO();

  if (session.lastOpenDate === today) {
    // Same day — nothing to update for streak
    return session;
  }

  const gap = session.lastOpenDate
    ? daysBetween(session.lastOpenDate, today)
    : 0;

  const streak =
    gap === 1
      ? session.streak + 1  // consecutive day
      : 1;                   // streak broken or first open

  const next: SessionStore = {
    streak,
    lastOpenDate: today,
    todayCount: 0,
    totalCount: session.totalCount,
  };

  storage.set(KEY, next);
  return next;
}

/** Call each time user views a new article. */
export function recordView(): SessionStore {
  const session = getSession();
  const next: SessionStore = {
    ...session,
    todayCount: session.todayCount + 1,
    totalCount: session.totalCount + 1,
  };
  storage.set(KEY, next);
  return next;
}
