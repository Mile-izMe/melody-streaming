import { NavBar } from "@/components";
import AudioPlayer from "@/components/layout/AudioPlayer";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="flex-1 pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans text-stone-300">
        {children}
      </main>
      <AudioPlayer />
    </>
  );
}
