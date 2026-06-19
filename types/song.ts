export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  lyrics?: string[];
  status: string;
}
 