import { z } from "zod";

type MessageGetter = (key: string) => string;

export const createPlaylistSchema = (t: MessageGetter) =>
  z.object({
    name: z.string().min(3, t("name_min_length")),
    description: z.string().optional(),
    thumbnailUrl: z.file().optional(),
  });

export type PlaylistInput = z.infer<ReturnType<typeof createPlaylistSchema>>;

export const updatePlaylistSchema = (t: MessageGetter) =>
  z.object({
    name: z.string().min(3, t("name_min_length")),
    description: z.string().optional(),
    thumbnailUrl: z.file().optional(),
  });

export type UpdatePlaylistInput = z.infer<ReturnType<typeof updatePlaylistSchema>>;
