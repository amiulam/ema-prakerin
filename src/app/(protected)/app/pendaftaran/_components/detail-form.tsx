"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PendaftaranWithPeserta, SuratPermohonan } from "@/drizzle/schema";
import ProsesPendaftaranDialog from "./proses-dialog";
import UpdateLetterStatusDialog from "./update-status-dialog";
import { useSession } from "@/context/session-context-provider";

export default function DetailPendaftaranForm({
  dataPendaftaran,
  suratPermohonan,
}: {
  dataPendaftaran: PendaftaranWithPeserta;
  suratPermohonan?: SuratPermohonan;
}) {
  const { user } = useSession();

  return (
    <>
      <p className="mb-1">
        Penempatan:{" "}
        <span className="font-medium">{dataPendaftaran.instansi}</span>
      </p>
      <p className="mb-1">
        Lokasi:{" "}
        <span className="font-medium">{dataPendaftaran.lokasiPrakerin}</span>
      </p>
      <div className="flex gap-x-2">
        <p>Status: </p>
        <Badge
          variant={
            ["done", "submit", "process", "rejected"].includes(
              dataPendaftaran.status.name,
            )
              ? dataPendaftaran.status.name
              : "default"
          }
        >
          {dataPendaftaran.status.name}
        </Badge>
      </div>

      {/* Divider */}
      <div className="my-3 flex items-center">
        <div className="flex-grow border-t border-zinc-200" />
        <div className="mx-2 text-sm">Peserta Prakerin</div>
        <div className="flex-grow border-t border-zinc-200" />
      </div>

      {dataPendaftaran.peserta.map((peserta) => (
        <div key={peserta.id} className="grid grid-cols-3 gap-x-4">
          <div className="mb-3 space-y-1">
            <Label htmlFor="nama" className="font-medium">
              Nama
            </Label>
            <Input id="nama" value={peserta.nama} readOnly />
          </div>
          <div className="mb-3 space-y-1">
            <Label htmlFor="jurusan" className="font-medium">
              Jurusan
            </Label>
            <Input id="jurusan" value={peserta.jurusan} readOnly />
          </div>
          <div className="mb-3 space-y-1">
            <Label htmlFor="gender" className="font-medium">
              Gender
            </Label>
            <Input id="gender" value={peserta.gender} readOnly />
          </div>
        </div>
      ))}
      {user?.role == "ADMIN" && (
        <div className="mt-3 flex justify-end gap-x-2">
          {!suratPermohonan?.downloadUrl ? (
            <ProsesPendaftaranDialog pendaftaranId={dataPendaftaran.id} />
          ) : (
            <UpdateLetterStatusDialog dataPendaftaran={dataPendaftaran} />
          )}
        </div>
      )}
    </>
  );
}
