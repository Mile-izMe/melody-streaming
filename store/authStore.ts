import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  token: string | null;
  zenMode: boolean;
  setZenMode: (value: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      zenMode: false,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setZenMode: (value) => set({ zenMode: value }),
    }),
    {
      name: "melody-auth", // Unique name for localStorage
      partialize: (state) => ({ user: state.user, token: state.token }), // Only persist user and token
    },
  ),
);
