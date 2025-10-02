"use client";

import { User } from "@supabase/supabase-js";
import { createContext } from "react";

type UserContextType = User | null;

export const UserContext = createContext<UserContextType>(null);

export function UserProvider({ user, children }: { user: UserContextType; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
