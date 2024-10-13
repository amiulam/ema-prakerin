"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ProsesPendaftaranForm } from "./proses-form";
import { flushSync } from "react-dom";

export default function ProsesPendaftaranDialog({
  pendaftaranId,
}: {
  pendaftaranId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Proses Pendaftaran</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Proses Pendaftaran</DialogTitle>
          <DialogDescription>
            Klik Proses untuk membuat surat permohonan dan pengantar.
          </DialogDescription>
        </DialogHeader>
        <ProsesPendaftaranForm
          pendaftaranId={pendaftaranId}
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
