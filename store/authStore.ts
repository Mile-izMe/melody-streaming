import { create } from "zustand";

interface AuthStore {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
    isLoggedIn: boolean;
  };
  zenMode: boolean;
  authModalOpen: boolean;
  setZenMode: (value: boolean) => void;
  login: (user: AuthStore["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: { username: "", email: "", isLoggedIn: false },
  zenMode: false,
  authModalOpen: false,
  setZenMode: (val) => set({ zenMode: val }),
  login: (user) => set({ user: { ...user, isLoggedIn: true } }),
  logout: () => set({ user: { username: "", email: "", isLoggedIn: false } }),
}));
