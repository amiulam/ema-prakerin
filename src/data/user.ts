import "server-only";

import { unstable_noStore as no_store } from "next/cache";
import { userTable } from "@/drizzle/schema";
import { count, desc, ilike } from "drizzle-orm";
import db from "@/drizzle";
import { ITEMS_PER_PAGE } from "@/lib/constant";

export const getUsers = async (query: string, currentPage: number) => {
  no_store();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const users = await db.query.userTable.findMany({
    orderBy: [desc(userTable.role)],
    where: query ? ilike(userTable.name, `${"%" + query + "%"}`) : undefined,
    limit: ITEMS_PER_PAGE,
    offset: offset,
  });

  return users;
};

export const getUserPages = async (query: string, currentPage: number) => {
  no_store();

  const totalUsers = await db
    .select({ count: count() })
    .from(userTable)
    .where(query ? ilike(userTable.name, `${"%" + query + "%"}`) : undefined);

  const totalPages = Math.ceil(Number(totalUsers[0].count) / ITEMS_PER_PAGE);
  return totalPages;
};
