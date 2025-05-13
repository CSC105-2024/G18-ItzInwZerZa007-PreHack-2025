import { create } from 'zustand';
import type { ReactNode } from "react";

interface ModalData {
  isOpen: boolean;
  content: ReactNode;
  title: string;
  description?: string;
}

interface ModalStore {
  modals: Record<string, ModalData>;
  openModal: (
    id: string,
    content: ReactNode,
    title: string,
    description?: string
  ) => void;
  closeModal: (id: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: {},
  openModal: (id, content, title, description) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: true, content, title, description },
      },
    })),
  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { ...state.modals[id], isOpen: false } },
    })),
}));