import { createModalHook } from "@/hooks/use-modal.tsx";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMood } from "@/contexts/mood-context";
import { useModalStore } from "@/store/modal.tsx";

interface MoodDeleteOverlayContentProps {
  id: string;
}

function MoodDeleteOverlayContent({ id }: MoodDeleteOverlayContentProps) {
  const { deleteEntry } = useMood();
  const { closeModal } = useModalStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEntry(id);

      closeModal("mood-delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p>
        Are you sure you want to delete this mood entry? This action cannot be
        undone.
      </p>
      <div className="flex justify-between space-x-4">
        <Button
          variant="destructive"
          className="w-full flex-1"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        <Button
          variant="outline"
          className="w-full flex-1"
          onClick={() => {
            document.getElementById("mood-delete-dialog-close-button")?.click();
          }}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

const useMoodDeleteOverlay = createModalHook(
  MoodDeleteOverlayContent,
  "mood-delete",
  "Delete Mood",
  "",
);

export { useMoodDeleteOverlay, MoodDeleteOverlayContent };
