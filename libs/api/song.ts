import { CursorPage } from "../response";
import { PresignInput, SongRequest } from "../validations";
import { privateApi, publicApi } from "./api";

export interface PresignResponse {
  objectKey: string;
  presignUrl: string;
}

export interface SongResponse {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  lyrics?: string[];
  status: string;
}

export const songApi = {
  getSongs: (cursor?: string, size = 20): Promise<CursorPage<SongResponse>> =>
    publicApi.get(
      `/api/songs?size=${size}${cursor ? `&cursor=${cursor}` : ""}`,
    ),

  getSong: (id: string): Promise<SongResponse> =>
    publicApi.get(`/api/songs/${id}`),

  getStreamUrl: (songId: string) =>
    `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/songs/stream/${songId}/master.m3u8`,

  getPresignUrl: (
    data: PresignInput,
    token: string,
  ): Promise<PresignResponse> =>
    privateApi(token).post("/api/songs/presign", data),

  createSong: (data: SongRequest, token: string): Promise<SongResponse> =>
    privateApi(token).post("/api/songs/metadata", data),

  uploadDirect: (url: string, file: File): Promise<Response> =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    }),
};
