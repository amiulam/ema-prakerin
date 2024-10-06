import db from "@/drizzle";
import AddPendaftaranDialog from "./_components/add-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PendaftaranActionButton from "./_components/buttons";
import EditPendaftaranDialog from "./_components/edit-dialog";

export default async function PendaftaranPage() {
  const dataPendaftaran = await db.query.pendaftaranTable.findMany({
    with: {
      user: {
        columns: {
          hashedPassword: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    },
  });

  return (
    <>
      <AddPendaftaranDialog />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dataPendaftaran.length === 0 && <p>Belum ada data pendaftaran</p>}
        {dataPendaftaran.map((pendaftaran) => (
          <Card key={pendaftaran.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-2xl">{pendaftaran.nama}</CardTitle>
                  <CardDescription>
                    {pendaftaran.user.nis || "Admin"} | {pendaftaran.jurusan}
                  </CardDescription>
                </div>
                <PendaftaranActionButton pendaftaran={pendaftaran} />
              </div>
            </CardHeader>
            <CardContent className="flex items-center gap-x-2">
              <p>{pendaftaran.lokasiPrakerin}</p>
              <Badge variant="outline">Submit</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <EditPendaftaranDialog />
    </>
  );
}
