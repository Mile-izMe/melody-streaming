"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { wsClient } from "@/libs/websocket";
import { authApi } from "@/libs";

export function useWebSocket() {
  const { user, accessToken, refreshToken, setTokens, logout } = useAuthStore();

  // Init — inject getter & refresh function
  useEffect(() => {
    wsClient.init(
      // Get latest token from store
      () => useAuthStore.getState().accessToken,

      // Refresh token when it expires
      async () => {
        const rt = refreshToken;
        if (!rt) return null;
        try {
          const res = await authApi.refreshToken(rt);
          setTokens(res.accessToken, res.refreshToken);
          return res.accessToken;
        } catch {
          logout();
          return null;
        }
      },
    );
  }, []);

  // Connect/disconnect based on auth state
  useEffect(() => {
    if (!user?.isLoggedIn || !accessToken || !user.id) {
      wsClient.disconnect();
      return;
    }

    wsClient.connect(user.id);
    console.log("[WS] Connected, userId=", user.id);
    return () => {
      wsClient.disconnect();
    };
  }, [user?.isLoggedIn, accessToken, user?.id]);
}
