"use client";

import { Button } from "@/components/ui/button";
import { usePostStore } from "@/stores/postStore";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TPost } from "@/drizzle/schema";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon, Pencil2Icon } from "@radix-ui/react-icons";

export default function PostActionButton({ post }: { post: TPost }) {
  const onDeleteClick = usePostStore((state) => state.onDeleteClick);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <DotsVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex items-center gap-x-2" asChild>
          <Link href={`/app/posts/${post.id}/edit`}>
            <Pencil2Icon className="size-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-x-2"
          onClick={() => onDeleteClick(post)}
        >
          <TrashIcon className="size-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
