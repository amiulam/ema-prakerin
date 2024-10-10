"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePendaftaranStore } from "@/stores/pendaftaranStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DetailPendaftaranDialog() {
  const setIsDialogOpen = usePendaftaranStore(
    (state) => state.setIsDetailDialogOpen,
  );
  const isDialogOpen = usePendaftaranStore((state) => state.isDetailDialogOpen);
  const dataPendaftar = usePendaftaranStore((state) => state.pendaftaran);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent
        className="sm:max-w-[725px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Data Pendaftaran</DialogTitle>
          <DialogDescription>
            Detail data pendaftar di {dataPendaftar?.lokasiPrakerin}.
          </DialogDescription>
        </DialogHeader>
        <p>
          Penempatan:{" "}
          <span className="font-medium">{dataPendaftar?.lokasiPrakerin}</span>
        </p>
        <div className="flex">
          <p>Status: </p>
          <Badge variant="outline">Submit</Badge>
        </div>

        {/* Divider */}
        <div className="my-3 flex items-center">
          <div className="flex-grow border-t border-zinc-200" />
          <div className="mx-2 text-sm">Peserta Prakerin</div>
          <div className="flex-grow border-t border-zinc-200" />
        </div>

        {dataPendaftar?.peserta.map((peserta) => (
          <div key={peserta.id} className="grid grid-cols-3 gap-x-3">
            <div className="space-y-1">
              <Label htmlFor="nama" className="font-bold">
                Nama
              </Label>
              <Input id="nama" value={peserta.nama} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jurusan" className="font-bold">
                Jurusan
              </Label>
              <Input id="jurusan" value={peserta.jurusan} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gender" className="font-bold">
                Gender
              </Label>
              <Input id="gender" value={peserta.gender} readOnly />
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
