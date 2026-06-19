import { ContentModal } from "@/components/features/home";
import { CursorPage, songApi } from "@/libs";
import { Song } from "@/types";

export default async function HomePage() {
  const inital: CursorPage<Song> = await songApi.getSongs();
  return (
    <div className=" selection:bg-amber-500/30 selection:text-amber-100 flex flex-col relative">
      <ContentModal />
    </div>
  );
}


