import db from "@/drizzle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PendaftaranActionButton from "./_components/buttons";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DetailPendaftaranDialog from "./_components/detail-dialog";

export default async function PendaftaranPage() {
  const dataPendaftaran = await db.query.pendaftaranTable.findMany({
    with: {
      peserta: true,
    },
  });

  return (
    <>
      <Button size="icon" className="absolute bottom-5 right-5" asChild>
        <Link href="/app/pendaftaran/create">
          <PlusIcon className="size-5" />
        </Link>
      </Button>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dataPendaftaran.length === 0 && <p>Belum ada data pendaftaran</p>}
        {dataPendaftaran.map((pendaftaran) => (
          <Card key={pendaftaran.id} className="border-zinc-300">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {pendaftaran.lokasiPrakerin}
                  </CardTitle>
                  <CardDescription>
                    {new Date(pendaftaran.createdAt!).toLocaleDateString(
                      "id-ID",
                    )}
                  </CardDescription>
                </div>
                <PendaftaranActionButton pendaftaran={pendaftaran} />
              </div>
            </CardHeader>
            <CardContent className="flex items-center gap-x-2">
              <p>Peserta: {pendaftaran.peserta.length} orang</p>
              <Badge variant="outline">Submit</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <DetailPendaftaranDialog />
    </>
  );
}
