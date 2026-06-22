"use client";

import { notificationApi } from "@/libs/api/notification";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotificationStore();
  const { accessToken } = useAuthStore();
  const [open, setOpen] = useState(false);
  const t = useTranslations("ui.notification_bell");
  const locale = useLocale();

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unreadCount > 0 && accessToken) {
      await notificationApi.markAllRead(accessToken);
      markAllRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="cursor-pointer relative p-2 rounded-lg text-stone-400 hover:text-amber-400 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-stone-900/95 border border-stone-800 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              {t("title")}
            </span>
            {unreadCount === 0 && (
              <span className="text-[10px] text-stone-600">
                {t("all_read")}
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-stone-600 text-xs py-8">
                {t("empty")}
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-stone-800/50 transition-colors ${
                    !n.isRead ? "bg-amber-950/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        n.type === "SONG_COMPLETED"
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-stone-200 truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-stone-600 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
