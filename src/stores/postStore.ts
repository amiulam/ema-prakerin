import { TPost } from "@/drizzle/schema";
import { create } from "zustand";

type Store = {
  post: TPost | null;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  onDeleteClick: (data: TPost) => void;
};

export const usePostStore = create<Store>((set, get) => ({
  post: null,
  isAlertOpen: false,
  setIsAlertOpen: (open: boolean) => set({ isAlertOpen: open }),
  onDeleteClick: (data: TPost) => {
    set({ post: data });
    get().setIsAlertOpen(true);
  },
}));
