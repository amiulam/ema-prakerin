import { TPendaftaran } from "@/drizzle/schema";
import { create } from "zustand";

type Store = {
  pendaftaran: TPendaftaran | null;
  isDialogOpen: boolean;
  isAlertOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setIsAlertOpen: (open: boolean) => void;
  onEditClick: (data: TPendaftaran) => void;
  onDeleteClick: (data: TPendaftaran) => void;
};

export const usePendaftaranStore = create<Store>((set, get) => ({
  pendaftaran: null,
  isDialogOpen: false,
  isAlertOpen: false,
  setIsDialogOpen: (open: boolean) => set({ isDialogOpen: open }),
  setIsAlertOpen: (open: boolean) => set({ isAlertOpen: open }),
  onEditClick: (data: TPendaftaran) => {
    set({ pendaftaran: data });
    get().setIsDialogOpen(true);
  },
  onDeleteClick: (data: TPendaftaran) => {
    set({ pendaftaran: data });
    get().setIsAlertOpen(true);
  },
}));
