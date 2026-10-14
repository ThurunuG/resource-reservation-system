"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "ADMIN" | "MEMBER";
  avatarUrl?: string;
}

// Demo accounts available for switching between roles in the app.
export const PRESET_USERS: ActiveUser[] = [
  {
    id: "user-alex",
    name: "Alex Perera",
    email: "alex.perera@primewave.lk",
    department: "Engineering",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-dilshan",
    name: "Dilshan Silva",
    email: "dilshan.silva@primewave.lk",
    department: "Product Design",
    role: "MEMBER",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-kavindi",
    name: "Kavindi Jayawardena",
    email: "kavindi.j@primewave.lk",
    department: "Data & AI",
    role: "MEMBER",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-niroshan",
    name: "Niroshan Fernando",
    email: "niroshan.f@primewave.lk",
    department: "Operations & Facilities",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

interface UserContextType {
  currentUser: ActiveUser;
  setCurrentUser: (user: ActiveUser) => void;
  availableUsers: ActiveUser[];
}

const UserContext = createContext<UserContextType>({
  // Safe defaults for consumers rendered outside the provider.
  currentUser: PRESET_USERS[0],
  setCurrentUser: () => {},
  availableUsers: PRESET_USERS,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ActiveUser>(PRESET_USERS[0]);

  useEffect(() => {
    // Restore the saved account, matching it to a known preset user.
    const saved = localStorage.getItem("primewave_active_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = PRESET_USERS.find((u) => u.email === parsed.email);
        if (match) setCurrentUser(match);
      } catch (e) {
        // Ignore invalid stored data and keep the default user.
      }
    }
  }, []);

  const handleSetUser = (user: ActiveUser) => {
    setCurrentUser(user);
    // Persist account changes so they survive page reloads.
    localStorage.setItem("primewave_active_user", JSON.stringify(user));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetUser,
        availableUsers: PRESET_USERS,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}