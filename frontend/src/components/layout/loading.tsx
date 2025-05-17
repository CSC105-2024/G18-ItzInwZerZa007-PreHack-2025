import React from "react";
import { IconMoodPuzzled, IconPicnicTable } from "@tabler/icons-react";

function LoadingLayout() {
  return (
    <div className="animate-in flex min-h-svh flex-col items-center justify-center text-center">
      <IconMoodPuzzled
        className="size-32 animate-bounce"
        aria-label="Loading..."
      />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold">iMood</h1>
        <p className="font-mono">Your emotional journal, made beautiful</p>
      </div>
    </div>
  );
}

export default LoadingLayout;
