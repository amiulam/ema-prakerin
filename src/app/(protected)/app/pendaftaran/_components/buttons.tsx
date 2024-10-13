"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PendaftaranWithPeserta } from "@/drizzle/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DotsVerticalIcon,
  EyeOpenIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { useSession } from "@/context/session-context-provider";

export function PendaftaranActionButton({
  pendaftaran,
}: {
  pendaftaran: PendaftaranWithPeserta;
}) {
  const { user } = useSession();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <DotsVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {((user?.role == "USER" && pendaftaran.status.name == "submit") ||
          user?.role == "ADMIN") && (
          <DropdownMenuItem className="flex items-center gap-x-2" asChild>
            <Link href={`/app/pendaftaran/${pendaftaran.id}/edit`}>
              <Pencil2Icon className="size-4" /> Edit
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex items-center gap-x-2" asChild>
          <Link href={`/app/pendaftaran/${pendaftaran.id}/detail`}>
            <EyeOpenIcon className="size-4" /> Detail
          </Link>
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => onDeleteClick(pendaftaran)}
        >
          <TrashIcon className="size-4" />
          Hapus
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
