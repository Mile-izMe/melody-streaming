export type NotificationType = "SONG_COMPLETED" | "SONG_FAILED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
}
