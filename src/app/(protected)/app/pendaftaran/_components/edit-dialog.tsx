"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PendaftaranForm from "./dialog-form";
import { flushSync } from "react-dom";
import { usePendaftaranStore } from "@/stores/pendaftaranStore";

export default function EditPendaftaranDialog() {
  const setIsDialogOpen = usePendaftaranStore((state) => state.setIsDialogOpen);
  const isDialogOpen = usePendaftaranStore((state) => state.isDialogOpen);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Pendaftaran</DialogTitle>
          <DialogDescription>
            Ubah data pendaftaran, klik save untuk menyimpan perubahan.
          </DialogDescription>
        </DialogHeader>
        <PendaftaranForm
          type="Edit"
          onFormSubmission={() => {
            flushSync(() => {
              setIsDialogOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
