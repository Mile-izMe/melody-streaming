import { ContentModal } from "@/components/features/home";
import HomeView from "@/components/features/home/HomeView";
import { CursorPage, songApi } from "@/libs";
import { Song } from "@/types";

export default async function HomePage() {
  const initial: CursorPage<Song> = await songApi.getSongs();

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      <div className=" selection:bg-amber-500/30 selection:text-amber-100 flex flex-col relative">
        <ContentModal />
        <HomeView initialData={initial} />
      </div>
    </div>
  );
}
