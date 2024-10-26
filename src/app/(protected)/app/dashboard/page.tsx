import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "./_components/dashboard-charts";
import db from "@/drizzle";
import { pendaftaranTable, pesertaTable, userTable } from "@/drizzle/schema";
import { count } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function getDashboardStats() {
  const [totalPendaftar, totalPeserta, totalUsers, pendaftaranPerBulan] =
    await Promise.all([
      db.select({ count: count() }).from(pendaftaranTable),
      db.select({ count: count() }).from(pesertaTable),
      db.select({ count: count() }).from(userTable),
      db.execute(sql`
        WITH all_months AS (
          SELECT TO_CHAR(DATE_TRUNC('month', d), 'Mon') AS bulan
          FROM GENERATE_SERIES(
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '9 months',
            DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
            INTERVAL '1 month'
          ) d
        )
        SELECT 
          am.bulan, 
          COALESCE(COUNT(DISTINCT p.id), 0) AS pendaftaran,
          COALESCE(SUM(CASE WHEN ps.id IS NOT NULL THEN 1 ELSE 0 END), 0) AS peserta
        FROM all_months am
        LEFT JOIN ${pendaftaranTable} p ON TO_CHAR(DATE_TRUNC('month', p."createdAt"), 'Mon') = am.bulan
        LEFT JOIN ${pesertaTable} ps ON p.id = ps."pendaftaranId" AND TO_CHAR(DATE_TRUNC('month', p."createdAt"), 'Mon') = am.bulan
        GROUP BY am.bulan
        ORDER BY TO_DATE(am.bulan, 'Mon')
      `),
    ]);

  return {
    totalPendaftar: totalPendaftar[0].count,
    totalPeserta: totalPeserta[0].count,
    totalUsers: totalUsers[0].count,
    pendaftaranPerBulan,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const chartData = stats.pendaftaranPerBulan.map((item: any) => ({
    bulan: item.bulan,
    pendaftaran: Number(item.pendaftaran),
    peserta: Number(item.peserta),
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Pendaftar" value={stats.totalPendaftar} />
        <StatCard title="Total Peserta" value={stats.totalPeserta} />
        <StatCard title="Total Pengguna" value={stats.totalUsers} />
      </div>
      <div className="mt-6">
        <DashboardCharts data={chartData} />
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
