"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";
import { PendaftaranWithPeserta } from "@/drizzle/schema";
import UpdatePendaftaranStatusForm from "./update-status-form";

export default function UpdateLetterStatusDialog({
  dataPendaftaran,
}: {
  dataPendaftaran: PendaftaranWithPeserta;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Status Pendaftaran</DialogTitle>
          <DialogDescription>
            Update status pendaftaran. Klik save jika selesai.
          </DialogDescription>
        </DialogHeader>
        <UpdatePendaftaranStatusForm
          dataPendaftaran={dataPendaftaran}
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
