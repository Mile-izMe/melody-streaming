import { PresignInput, SongRequest } from "../validations";
import { privateApi } from "./api";

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
}

export const songApi = {
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
