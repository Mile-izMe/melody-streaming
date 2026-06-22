import { authApi, clearTokenCookie } from "@/libs";
import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            await authApi.logout(accessToken);
          }
        } catch {
        } finally {
          clearTokenCookie();
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },
    }),
    {
      name: "melody-auth", // Unique name for localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }), // Only persist user and tokens
    },
  ),
);
