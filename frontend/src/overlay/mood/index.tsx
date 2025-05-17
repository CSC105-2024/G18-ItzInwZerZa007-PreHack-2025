import React, { useState, useEffect } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMood, type MoodEntry } from "@/contexts/mood-context";
import { createModalHook } from "@/hooks/use-modal.tsx";
import { toast } from "sonner";
import { useModalStore } from "@/store/modal.tsx";

const MOOD_EMOJIS: Record<string, string> = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Shy: "😳",
  Excited: "😃",
  Neutral: "😐",
  Romance: "❤️",
  Calm: "😌",
  Awkward: "😬",
  Silly: "🤪",
};

interface MoodOverlayEditMode {
  isEditMode: true;
  entry: MoodEntry;
}

interface OverlayCreateMode {
  isEditMode: false;
  entry?: never;
}

type MoodOverlayProps = MoodOverlayEditMode | OverlayCreateMode;

const FormSchema = z.object({
  note: z
    .string()
    .max(25000, {
      message: "Note must not be longer than 25000 characters.",
    })
    .optional(),
});

function MoodOverlayContent({ isEditMode = false, entry }: MoodOverlayProps) {
  const { moods, createEntry, updateEntry, fetchEntries } = useMood();
  const { closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentMoodIdx, setCurrentMoodIdx] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: isEditMode && entry ? entry.note || "" : "",
    },
  });

  useEffect(() => {
    if (isEditMode && entry && api && moods.length > 0) {
      const moodIndex = moods.findIndex((m) => m.id === entry.moodId);
      if (moodIndex !== -1) {
        api.scrollTo(moodIndex);
      }
    }
  }, [isEditMode, entry, api, moods]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setCurrentMoodIdx(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (moods.length === 0) {
      toast.error("No moods available. Please try again later.");
      return;
    }

    setIsLoading(true);
    try {
      const selectedMood = moods[currentMoodIdx];

      if (isEditMode && entry) {
        await updateEntry(entry.id, selectedMood.id, data.note || undefined);
      } else {
        await createEntry(selectedMood.id, data.note || undefined);
      }

      await fetchEntries();

      closeModal("mood");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="mx-auto">
            <Carousel
              opts={{ loop: true }}
              className="mx-auto w-full max-w-xs"
              setApi={setApi}
            >
              <CarouselContent>
                {moods.map((mood, index) => (
                  <CarouselItem key={mood.id}>
                    <div className="flex items-center justify-center p-6">
                      <span
                        className="text-6xl"
                        role="img"
                        aria-label={mood.name}
                      >
                        {MOOD_EMOJIS[mood.name] || "😊"}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="py-4 text-center">
                <CarouselPrevious type="button" />
                <span className="mx-4 font-semibold">
                  {moods[currentMoodIdx]?.name || "Select Mood"}
                </span>
                <CarouselNext type="button" />
              </div>
            </Carousel>
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Let's talk more about what happened?"
                        className="field-sizing-fixed min-h-32"
                        maxLength={25000}
                        {...field}
                        value={field.value || ""}
                      />
                      <span className="text-muted-foreground absolute right-2 bottom-2 text-xs">
                        {Math.max(
                          0,
                          field?.value ? 25000 - field.value.length : 25000,
                        )}{" "}
                        Characters Left
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditMode ? "Update Mood" : "Mood Time"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const useMoodOverlay = createModalHook(
  MoodOverlayContent,
  "mood",
  ({ isEditMode }) => (isEditMode ? "Edit Your Mood" : "Add Your Mood"),
  "",
);

export { useMoodOverlay, MoodOverlayContent };
