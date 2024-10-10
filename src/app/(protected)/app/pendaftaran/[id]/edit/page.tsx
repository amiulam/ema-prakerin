import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/drizzle";
import { pendaftaranTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import PendaftaranForm from "../../_components/form";

export default async function EditPendaftaranPage({
  params,
}: {
  params: { id: string };
}) {
  const dataPendaftaran = await db.query.pendaftaranTable.findFirst({
    where: eq(pendaftaranTable.id, +params.id),
    with: {
      peserta: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">Edit Form Pendaftaran</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[calc(100vh-200px)] overflow-auto p-0.5 lg:max-h-[calc(100vh-200px)]">
          <PendaftaranForm type="Edit" dataPendaftaran={dataPendaftaran} />
        </div>
      </CardContent>
    </Card>
  );
}
