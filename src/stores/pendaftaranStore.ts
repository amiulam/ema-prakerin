import { PendaftaranWithPeserta } from "@/drizzle/schema";
import { create } from "zustand";

type Store = {
  pendaftaran: PendaftaranWithPeserta | null;
  isDetailDialogOpen: boolean;
  isAlertOpen: boolean;
  setIsDetailDialogOpen: (open: boolean) => void;
  setIsAlertOpen: (open: boolean) => void;
  onDetailClick: (data: PendaftaranWithPeserta) => void;
  onDeleteClick: (data: PendaftaranWithPeserta) => void;
};

export const usePendaftaranStore = create<Store>((set, get) => ({
  pendaftaran: null,
  isDetailDialogOpen: false,
  isAlertOpen: false,
  setIsDetailDialogOpen: (open: boolean) => set({ isDetailDialogOpen: open }),
  setIsAlertOpen: (open: boolean) => set({ isAlertOpen: open }),
  onDetailClick: (data: PendaftaranWithPeserta) => {
    set({ pendaftaran: data });
    get().setIsDetailDialogOpen(true);
  },
  onDeleteClick: (data: PendaftaranWithPeserta) => {
    set({ pendaftaran: data });
    get().setIsAlertOpen(true);
  },
}));
