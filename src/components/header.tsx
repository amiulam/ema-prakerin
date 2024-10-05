"use client";

import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth";
import { ExitIcon } from "@radix-ui/react-icons";
import { useSession } from "@/context/session-context-provider";

export default function Header() {
  const { user } = useSession();
  const pathname = usePathname();
  const pages = pathname.split("/").filter(Boolean);
  pages.shift();

  return (
    <header className="flex items-start justify-between border-b border-b-zinc-300">
      <h1 className="text-xl font-medium">{capitalizeFirstLetter(pages[0])}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Profile Dropdown">
          <Avatar className="size-8">
            <AvatarImage
              src={
                user && user.role === "ADMIN"
                  ? "https://github.com/shadcn.png"
                  : "/images/dipper.jpeg"
              }
              alt="@shadcn"
            />
            <AvatarFallback className="bg-slate-200">CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Hi, {user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => signOut()}
          >
            <ExitIcon className="mr-2 size-4" />
            <p>Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
