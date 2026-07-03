import { SongResponse } from "@/libs";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  songCount: number;
  songs: SongResponse[];
  createdAt: Date;
}
