import { TUser } from "@/drizzle/schema";
import { create } from "zustand";

type Store = {
  user: TUser | null;
  isDialogOpen: boolean;
  isAlertOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setIsAlertOpen: (open: boolean) => void;
  onEditClick: (data: TUser) => void;
  onDeleteClick: (data: TUser) => void;
};

export const useUserStore = create<Store>((set, get) => ({
  user: null,
  isDialogOpen: false,
  isAlertOpen: false,
  setIsDialogOpen: (open: boolean) => set({ isDialogOpen: open }),
  setIsAlertOpen: (open: boolean) => set({ isAlertOpen: open }),
  onEditClick: (data: TUser) => {
    set({ user: data });
    get().setIsDialogOpen(true);
  },
  onDeleteClick: (data: TUser) => {
    set({ user: data });
    get().setIsAlertOpen(true);
  },
}));
