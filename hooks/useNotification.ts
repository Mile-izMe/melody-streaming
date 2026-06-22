"use client";

import { wsClient } from "@/libs";
import { notificationApi } from "@/libs/api/notification";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useSongStore } from "@/store/songStore";
import { Notification } from "@/types/notification";
import { useCallback, useEffect } from "react";

export function useNotification() {
  const { user, accessToken } = useAuthStore();
  const { setNotifications, addNotification } = useNotificationStore();
  const { fetchSongs } = useSongStore();

  // Fetch unread when mount or when user logs in
  useEffect(() => {
    if (!user?.isLoggedIn || !accessToken) return;

    notificationApi
      .getUnread(accessToken)
      .then(setNotifications)
      .catch(() => {});
  }, [user?.isLoggedIn, accessToken, setNotifications]);

  // Subscribe WebSocket topic
  const handleNotification = useCallback(
    (data: unknown) => {
      const notification = data as Notification;
      addNotification(notification);

      if (notification.type === "SONG_COMPLETED") {
           console.log("[Notification] Calling fetchSongs...");
        fetchSongs();
      }
    },
    [fetchSongs, addNotification],
  );

  useEffect(() => {
    // Only subscribe if client is connected
    if (!user?.id) return;

    const topic = `/topic/notifications/${user.id}`;
    wsClient.subscribe(topic, handleNotification);

    return () => {
      wsClient.unsubscribe(topic, handleNotification);
    };
  }, [user?.id, handleNotification]);
}
