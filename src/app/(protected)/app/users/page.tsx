import { Suspense } from "react";
import UsersTable from "./_components/table";
import Pagination from "@/components/pagination";
import { UserIcon } from "@heroicons/react/24/outline";
import CreateUserDialog from "./_components/create-dialog";
import Search from "@/components/search";
import { getUserPages } from "@/data/user";

type UsersPageProps = {
  searchParams?: {
    page?: string;
    query?: string;
  };
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";
  const totalPages = await getUserPages(query, currentPage);

  return (
    <>
      <div className="relative overflow-x-auto rounded-xl border border-zinc-300 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-300 px-5 py-4">
          <div className="flex items-center gap-x-1">
            <UserIcon className="size-6 text-zinc-500" />
            <h1 className="text-xl">Users Data</h1>
          </div>
          <Search />
          <CreateUserDialog />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<p className="p-2 text-center">Loading...</p>}
        >
          <UsersTable query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      {totalPages >= 1 && (
        <div className="mt-4 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </>
  );
}
