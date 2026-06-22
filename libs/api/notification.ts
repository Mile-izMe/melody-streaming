import { Notification } from "@/types/notification";
import { privateApi } from "./api";

export const notificationApi = {
  getUnread: (token: string): Promise<Notification[]> =>
    privateApi(token).get("/api/notifications"),

  markAllRead: (token: string): Promise<void> =>
    privateApi(token).put("/api/notification/read-all", {}),
};
