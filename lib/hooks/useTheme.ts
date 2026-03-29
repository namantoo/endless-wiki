"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "dark" | "light";
const KEY = "wheels_theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    const system: Theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const initial = saved ?? system;
    document.documentElement.setAttribute("data-theme", initial);
    setTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
