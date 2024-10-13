import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PendaftaranWithPeserta, SuratPermohonan } from "@/drizzle/schema";
import ProsesPendaftaranDialog from "./proses-dialog";
import UpdateLetterStatusDialog from "./update-status-dialog";

export default function DetailPendaftaranForm({
  dataPendaftaran,
  suratPermohonan,
}: {
  dataPendaftaran: PendaftaranWithPeserta;
  suratPermohonan?: SuratPermohonan;
}) {
  return (
    <div>
      <p>
        Penempatan:{" "}
        <span className="font-medium">{dataPendaftaran.instansi}</span>
      </p>
      <p>
        Lokasi:{" "}
        <span className="font-medium">{dataPendaftaran.lokasiPrakerin}</span>
      </p>
      <div className="mt-1 flex gap-x-2">
        <p>Status: </p>
        <Badge variant="outline">{dataPendaftaran.status.name}</Badge>
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
      <div className="mt-3 flex justify-end gap-x-2">
        {!suratPermohonan?.downloadUrl ? (
          <ProsesPendaftaranDialog pendaftaranId={dataPendaftaran.id} />
        ) : (
          <UpdateLetterStatusDialog dataPendaftaran={dataPendaftaran} />
        )}
      </div>
    </div>
  );
}
