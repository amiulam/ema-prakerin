import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "./_components/dashboard-charts";
import { Suspense } from "react";
import DashboardPendaftarTable from "./_components/dashboard-pendaftar-table";
import { getAuthenticatedUser } from "@/lib/server-utils";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { ITEMS_PER_PAGE } from "@/lib/constant";
import { getDashboardStats } from "@/data/dashboard";

type UsersPageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function DashboardPage({ searchParams }: UsersPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const user = await getAuthenticatedUser();
  const stats = await getDashboardStats(user);

  const chartData = stats.pendaftaranPerBulan.map((item: any) => ({
    bulan: item.bulan,
    pendaftaran: Number(item.pendaftaran),
    peserta: Number(item.peserta),
  }));

  return (
    <>
      <div
        className={cn("grid gap-6 md:grid-cols-3", {
          "md:grid-cols-2": user.role === "USER",
        })}
      >
        <StatCard title="Total Peserta" value={stats.totalPeserta} />
        <StatCard title="Total Pendaftaran" value={stats.totalPendaftar} />
        {user.role === "ADMIN" && (
          <>
            <StatCard title="Total Pengguna" value={stats.totalUsers} />
          </>
        )}
      </div>
      <div className="mt-6 grid gap-x-6 md:grid-cols-3">
        {user.role === "ADMIN" && (
          <div>
            <DashboardCharts data={chartData} />
          </div>
        )}
        <div
          className={cn("md:col-span-2", {
            "md:col-span-3": user.role === "USER",
          })}
        >
          <Suspense
            key={"daftar-table"}
            fallback={<p className="p-2 text-center">Loading...</p>}
          >
            <DashboardPendaftarTable currentPage={currentPage} />
          </Suspense>
          {Math.ceil(Number(stats.totalPeserta) / ITEMS_PER_PAGE) >= 1 && (
            <div className="mt-4 flex w-full justify-center">
              <Pagination
                totalPages={Math.ceil(
                  Number(stats.totalPeserta) / ITEMS_PER_PAGE,
                )}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
