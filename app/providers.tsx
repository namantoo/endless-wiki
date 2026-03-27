"use client";

// Providers — wraps the app with all context providers.
// To add auth in V2: replace UserProvider internals in lib/context/UserContext.tsx.
// This file remains the composition root and doesn't need to change.

import { ReactNode } from "react";
import { UserProvider } from "@/lib/context/UserContext";

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
