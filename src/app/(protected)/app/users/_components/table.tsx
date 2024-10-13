import { UserActionButton } from "./buttons";
import EditUserDialog from "./edit-dialog";
import DeleteUserAlert from "./delete-alert";
import { Badge } from "@/components/ui/badge";
import { getUsers } from "@/data/user";

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await getUsers(query, currentPage);

  return (
    <>
      <table className="w-full text-left text-sm rtl:text-right">
        <thead className="border-b border-zinc-300 text-zinc-500">
          <tr>
            <th scope="col" className="px-5 py-3">
              Name
            </th>
            <th scope="col" className="px-2 py-3">
              Email
            </th>
            <th scope="col" className="px-2 py-3">
              Role
            </th>
            <th scope="col" className="px-2 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-300">
          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-5 py-4 text-center text-muted-foreground"
              >
                No data found
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <th
                scope="row"
                className="whitespace-nowrap px-5 py-4 font-medium text-gray-900 dark:text-white"
              >
                {user.name}
              </th>
              <td className="px-2 py-4">{user.email}</td>
              <td className="px-2 py-4">
                <Badge variant="outline">{user.role}</Badge>
              </td>
              <td className="px-2 py-4">
                <UserActionButton user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditUserDialog />
      <DeleteUserAlert />
    </>
  );
}
