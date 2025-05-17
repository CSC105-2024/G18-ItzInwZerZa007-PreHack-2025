import React, { useState } from "react";
import { createModalHook } from "@/hooks/use-modal.tsx";
import { Button } from "@/components/ui/button.jsx";
import { useModalStore } from "@/store/modal.jsx";
import axiosInstance from "@/lib/axios.ts";
import { toast } from "sonner";

interface UserDeleteOverlayProps {
  onSuccess?: () => void;
}

function UserDeleteOverlayContent({ onSuccess }: UserDeleteOverlayProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { closeModal } = useModalStore();

  const userId = 0;

  async function onDelete() {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully");
      closeModal("user-delete");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Delete user error:", error);
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this user");
      } else {
        toast.error("Failed to delete user");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Your mood data and personal records will be permanently removed.
      </p>
      <div className="flex flex-col gap-4 md:flex-row">
        <Button
          onClick={onDelete}
          className="w-full flex-1"
          variant="destructive"
        >
          Yes, delete my account
        </Button>
        <Button
          onClick={() => closeModal("user-delete")}
          className="w-full flex-1"
          variant="secondary"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

const useUserDeleteOverlay = createModalHook(
  UserDeleteOverlayContent,
  "user-delete",
  "Are you sure you want to delete your account?",
  () => (
    <span className="text-red-500">
      This action is permanent and cannot be undone.
    </span>
  ),
);

export { useUserDeleteOverlay, UserDeleteOverlayContent };
