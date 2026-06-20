import { z } from "zod";

type MessageGetter = (key: string) => string;

export const createPresignSchema = (t: MessageGetter) =>
  z.object({
    fileName: z.string().nonempty(t("file_name_required")),
    contentType: z.string().nonempty(t("content_type_required")),
  });

export const createSongSchema = (t: MessageGetter) =>
  z.object({
    title: z.string().min(3, t("title_min_length")),
    artist: z.string().min(2, t("artist_min_length")),
    lyrics: z.string().optional(),
  });

export type PresignInput = z.infer<ReturnType<typeof createPresignSchema>>;
export type SongInput = z.infer<ReturnType<typeof createSongSchema>>;

export interface SongRequest {
  title: string;
  artist: string;
  objectKey: string;
  thumbnailUrl?: string;
  lyrics?: string;
}
