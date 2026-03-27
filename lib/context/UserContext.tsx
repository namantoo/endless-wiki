"use client";

// UserContext — provides user identity to the component tree.
// V1: anonymous UUID from localStorage, isAuthenticated: false.
// V2: replace providers.tsx internals to pull from your auth system.
//     This file (the interface + hook) stays identical.

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { storage } from "@/lib/storage";

export interface User {
  id: string;            // anonymous UUID in V1; real user ID in V2
  isAuthenticated: boolean;
  email?: string;
}

const UserContext = createContext<User | null>(null);

function getOrCreateAnonId(): string {
  const existing = storage.get<string>("weels:anon-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.set("weels:anon-id", id);
  return id;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // V1: create stable anonymous user
    const id = getOrCreateAnonId();
    setUser({ id, isAuthenticated: false });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): User | null {
  return useContext(UserContext);
}
