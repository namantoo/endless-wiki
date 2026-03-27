"use client";

import { useState, useEffect, useCallback } from "react";
import { recordOpen, recordView, getSession } from "@/lib/services/session";

export function useSession() {
  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const session = recordOpen();
    setStreak(session.streak);
    setTodayCount(session.todayCount);
  }, []);

  const trackView = useCallback(() => {
    const session = recordView();
    setStreak(session.streak);
    setTodayCount(session.todayCount);
  }, []);

  return { streak, todayCount, trackView };
}
