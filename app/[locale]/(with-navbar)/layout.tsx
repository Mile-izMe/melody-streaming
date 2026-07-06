import { NavBar } from "@/components";
import AudioPlayer from "@/components/layout/AudioPlayer";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import GlobalListener from "@/context/GlobalListener";
import Providers from "@/context/QueryProvider";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <Providers>
        <GlobalListener />
        <main className="flex-1 pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans text-stone-300 mt-8">
          <BackgroundEffects />
          {children}
        </main>
      </Providers>
      <AudioPlayer />
    </>
  );
}
