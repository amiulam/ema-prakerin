import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/drizzle";
import {
  pendaftaranTable,
  suratPengantarTable,
  suratPermohonanTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import DetailPendaftaranForm from "../../_components/detail-form";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/server-utils";

export default async function DetailPendaftaranPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthenticatedUser();

  const pendaftaran = db.query.pendaftaranTable.findFirst({
    where: eq(pendaftaranTable.id, +params.id),
    with: {
      peserta: true,
      status: true,
    },
  });

  const permohonan = db.query.suratPermohonanTable.findFirst({
    where: eq(suratPermohonanTable.pendaftaranId, +params.id),
  });

  const pengantar = db.query.suratPengantarTable.findFirst({
    where: eq(suratPengantarTable.pendaftaranId, +params.id),
  });

  const [dataPendaftaran, suratPermohonan, suratPengantar] = await Promise.all([
    pendaftaran,
    permohonan,
    pengantar,
  ]);

  if (!dataPendaftaran) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">Detail Pendaftaran</CardTitle>
          {((user.role === "USER" &&
            dataPendaftaran.status.name !== "rejected") ||
            user.role === "ADMIN") &&
            suratPermohonan?.downloadUrl &&
            suratPengantar?.downloadUrl && (
              <div className="space-x-3">
                <Button asChild variant="outline">
                  <a
                    href={`${suratPermohonan.downloadUrl}`}
                    className="space-x-2"
                  >
                    <span>Surat Permohonan</span> <DownloadIcon />
                  </a>
                </Button>
                {((user.role === "USER" &&
                  dataPendaftaran.status.name === "done") ||
                  user.role === "ADMIN") && (
                  <Button asChild variant="outline">
                    <a
                      href={`${suratPengantar.downloadUrl}`}
                      className="space-x-2"
                    >
                      <span>Surat Pengantar</span> <DownloadIcon />
                    </a>
                  </Button>
                )}
              </div>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[calc(100vh-200px)] overflow-auto p-0.5 lg:max-h-[calc(100vh-200px)]">
          <DetailPendaftaranForm
            dataPendaftaran={dataPendaftaran}
            suratPermohonan={suratPermohonan}
          />
        </div>
      </CardContent>
    </Card>
  );
}
