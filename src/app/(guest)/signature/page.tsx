import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/drizzle";
import Image from "next/image";

export default async function SignaturePage() {
  const settingsData = await db.query.settingsTable.findFirst({});

  if (!settingsData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Settings not found</p>
      </div>
    );
  }

  if (!settingsData.signatureFileUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No signature found</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Tertanda</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("id-ID")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={settingsData.signatureFileUrl}
            alt="Signature"
            width={500}
            height={500}
            className="my-5"
          />
          <h3 className="font-bold">{settingsData?.kepalaSekolah}</h3>
          <p className="text-muted-foreground">
            {settingsData?.nipKepalaSekolah}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
