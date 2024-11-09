import { Button } from "@/components/ui/button";
import { getDataPeserta } from "@/data/dashboard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { UpdateIcon } from "@radix-ui/react-icons";

export default async function DashboardPendaftarTable({
  currentPage,
}: {
  currentPage: number;
}) {
  const dataPeserta = await getDataPeserta(currentPage);

  return (
    <div className="relative overflow-x-auto rounded-xl border border-zinc-300 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-300 px-5 py-4">
        <div className="flex items-center gap-x-1">
          <UsersIcon className="size-6 text-zinc-500" />
          <h1 className="ml-2 text-xl">Peserta Prakerin</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg border-zinc-300"
          >
            <UpdateIcon className="size-5 text-zinc-600" />
          </Button>
        </div>
      </div>
      <table className="w-full text-left text-sm rtl:text-right">
        <thead className="border-b border-zinc-300 text-zinc-500">
          <tr>
            <th scope="col" className="px-5 py-3">
              Name
            </th>
            <th scope="col" className="px-2 py-3">
              Jurusan
            </th>
            <th scope="col" className="px-2 py-3">
              Jenis Kelamin
            </th>
            <th scope="col" className="px-2 py-3">
              Instansi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-300">
          {dataPeserta.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-5 py-4 text-center text-muted-foreground"
              >
                No data found
              </td>
            </tr>
          )}
          {dataPeserta.map((peserta) => (
            <tr key={peserta.id}>
              <th
                scope="row"
                className="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white"
              >
                {peserta.nama}
              </th>
              <td className="px-2 py-4">{peserta.jurusan}</td>
              <td className="px-2 py-4">{peserta.gender}</td>
              <td className="px-2 py-4">{peserta.pendaftaran.instansi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
