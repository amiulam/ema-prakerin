import "server-only";

import { pesertaTable, userTable } from "@/drizzle/schema";
import { count, inArray, sql } from "drizzle-orm";
import db from "@/drizzle";
import { ITEMS_PER_PAGE } from "@/lib/constant";
import { getAuthenticatedUser } from "@/lib/server-utils";
import { eq } from "drizzle-orm";
import { pendaftaranTable } from "@/drizzle/schema";
import { User } from "lucia";

export const getDataPeserta = async (currentPage: number) => {
  const user = await getAuthenticatedUser();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const condition =
    user.role === "USER" ? eq(pendaftaranTable.userId, user.id) : undefined;

  const pendaftaranIds =
    user.role === "USER"
      ? await db
          .select({ id: pendaftaranTable.id })
          .from(pendaftaranTable)
          .where(condition)
      : [];

  const mappedIds = pendaftaranIds.map((data) => data.id);

  const datas = await db.query.pesertaTable.findMany({
    where:
      user.role === "USER"
        ? inArray(pesertaTable.pendaftaranId, mappedIds)
        : undefined,
    with: {
      pendaftaran: {
        columns: {
          instansi: true,
        },
      },
    },
    limit: ITEMS_PER_PAGE,
    offset: offset,
  });

  return datas;
};

export const getDashboardStats = async (user: User) => {
  const [totalUsers, pendaftaranPerBulan] = await Promise.all([
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

  const totalPendaftar = await db
    .select({ count: count() })
    .from(pendaftaranTable)
    .where(
      user.role == "USER" ? eq(pendaftaranTable.userId, user.id) : undefined,
    );

  const totalPeserta =
    user.role === "ADMIN"
      ? (await db.select({ count: count() }).from(pesertaTable))[0].count
      : ((
          await db.execute(sql`
        SELECT COUNT(*) FROM ${pesertaTable} ps
        JOIN ${pendaftaranTable} p ON ps."pendaftaranId" = p.id
        WHERE p."user_id" = ${user.id}
      `)
        )[0].count as number);

  return {
    totalPendaftar: totalPendaftar[0].count,
    totalPeserta,
    totalUsers: totalUsers[0].count,
    pendaftaranPerBulan,
  };
};
