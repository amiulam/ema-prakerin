"use client";

import { Button } from "@/components/ui/button";
import { TPendaftaran } from "@/drizzle/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { usePendaftaranStore } from "@/stores/pendaftaranStore";

export default function PendaftaranActionButton({
  pendaftaran,
}: {
  pendaftaran: TPendaftaran;
}) {
  const onEditClick = usePendaftaranStore((state) => state.onEditClick);
  const onDeleteClick = usePendaftaranStore((state) => state.onDeleteClick);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <DotsVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => onEditClick(pendaftaran)}
        >
          <Pencil2Icon className="size-4" />
          Edit
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
