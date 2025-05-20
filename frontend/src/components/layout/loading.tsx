import React from "react";
import { IconMoodPuzzled, IconPicnicTable } from "@tabler/icons-react";

function LoadingLayout() {
  return (
    <div className="animate-in flex min-h-screen flex-col items-center justify-center text-center bg-white font-serif text-[#96C5D7]">
      <IconMoodPuzzled
        className="size-32 animate-bounce text-[#96C5D7]"
        aria-label="Loading..."
      />
      <div className="flex flex-col items-center gap-4 mt-4">
        <h1 className="text-5xl font-bold">iMood</h1>
        <p className="text-lg text-[#F2A265]">Your emotional journal, made beautiful</p>
      </div>
    </div>
  );
}

export default LoadingLayout;
