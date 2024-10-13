import { PendaftaranWithPeserta } from "@/drizzle/schema";
import { create } from "zustand";

type Store = {
  pendaftaran: PendaftaranWithPeserta | null;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  onDeleteClick: (data: PendaftaranWithPeserta) => void;
};

export const usePendaftaranStore = create<Store>((set, get) => ({
  pendaftaran: null,
  isAlertOpen: false,
  setIsAlertOpen: (open: boolean) => set({ isAlertOpen: open }),
  onDeleteClick: (data: PendaftaranWithPeserta) => {
    set({ pendaftaran: data });
    get().setIsAlertOpen(true);
  },
}));
