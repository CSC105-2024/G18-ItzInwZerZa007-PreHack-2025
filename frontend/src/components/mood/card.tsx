import React from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useMoodOverlay } from "@/overlay/mood";
import { Button } from "@/components/ui/button";
import { type MoodEntry } from "@/contexts/mood-context";
import { formatDistanceToNow, format } from "date-fns";
import { useMoodDeleteOverlay } from "@/overlay/mood/delete";


const MOOD_EMOJIS: Record<string, string> = {
  "Happy": "😊",
  "Sad": "😢",
  "Angry": "😠",
  "Shy": "😳",
  "Excited": "😃",
  "Neutral": "😐",
  "Romance": "❤️",
  "Calm": "😌",
  "Awkward": "😬",
  "Silly": "🤪"
};

interface MoodCardProps {
  entry: MoodEntry;
}

function MoodCard({ entry }: MoodCardProps) {
  const { open: openAddMoodOverlay } = useMoodOverlay();
  const { open: openDeleteMoodOverlay } = useMoodDeleteOverlay();

  const formattedDate = format(new Date(entry.createdAt), "yyyy-MM-dd '·' h:mm a");

  return (
    <div className="rounded-md bg-gray-50 p-7">
      <div className="flex items-center justify-center py-7">
        <span
          className="text-6xl"
          role="img"
          aria-label={entry.mood.name}
        >
          {MOOD_EMOJIS[entry.mood.name] || "😊"}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{entry.mood.name}</h3>
          <time dateTime={entry.createdAt} className="text-sm text-gray-500">
            {formattedDate}
          </time>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openAddMoodOverlay({ isEditMode: true, entry })}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteMoodOverlay({ id: entry.id })}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {entry.note && (
        <div className="mt-2 rounded bg-white p-3">
          <h4 className="font-semibold">Note</h4>
          <p className="whitespace-pre-wrap wrap-break-word text-sm">{entry.note}</p>
        </div>
      )}
    </div>
  );
}

export function EmptyMoodCard() {
  const { open: openAddMoodOverlay } = useMoodOverlay();

  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-md bg-gray-50 p-8 text-center">
      <span className="text-6xl mb-4">📝</span>
      <h3 className="text-xl font-semibold mb-2">No mood entries yet</h3>
      <p className="text-gray-500 mb-4">Track your first mood to see it here</p>
      <Button onClick={() => openAddMoodOverlay({ isEditMode: false })}>
        Record Your Mood
      </Button>
    </div>
  );
}

export { MoodCard };