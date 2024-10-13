"use client";

import { Button } from "@/components/ui/button";
import {
  DotsVerticalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { type TUser } from "@/drizzle/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/stores/userStore";

export function UserActionButton({ user }: { user: TUser }) {
  const onEditClick = useUserStore((state) => state.onEditClick);
  const onDeleteClick = useUserStore((state) => state.onDeleteClick);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <DotsVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => onEditClick(user)}
        >
          <Pencil2Icon className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => onDeleteClick(user)}
        >
          <TrashIcon className="size-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
