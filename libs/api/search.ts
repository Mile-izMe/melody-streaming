import { publicApi } from "./api";

export interface SongData {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  status: string;
}

export interface SearchResultItem {
  type: "SONG" | "ARTIST";
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl?: string;
  data?: SongData | string;
}

export interface SearchResponse {
  songs: SearchResultItem[];
  artists: SearchResultItem[];
  total: number;
}

export const searchApi = {
  search: (keyword: string, size: number = 5): Promise<SearchResponse> =>
    publicApi.get(
      `/api/search?keyword=${encodeURIComponent(keyword)}&size=${size}`,
    ),
};
