import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PendaftaranForm from "../_components/form";

export default function AddPendaftaranPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg">Form Pendaftaran</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[calc(100vh-200px)] overflow-auto p-0.5 lg:max-h-[calc(100vh-200px)]">
          <PendaftaranForm type="Add" />
        </div>
      </CardContent>
    </Card>
  );
}
