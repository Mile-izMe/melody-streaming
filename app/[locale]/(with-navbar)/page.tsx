import BackgroundEffects from "@/components/ui/BackgroundEffects";
import React from "react";

function HomePage() {
  return (
    <div className=" selection:bg-amber-500/30 selection:text-amber-100 flex flex-col relative">
      <BackgroundEffects />
      <div>This is the home page</div>
    </div>
  );
}

export default HomePage;
