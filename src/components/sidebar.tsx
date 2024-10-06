"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ROUTES } from "@/lib/constant";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="p-5">
      <nav>
        <Image
          src="/logo-ipsum.svg"
          alt="Inter Logo"
          height={50}
          width={50}
          className="mb-7 size-8"
        />
        <ul className="space-y-3">
          {ROUTES.map(({ Icon, ...route }) => (
            <li
              key={route.name}
              className={cn(
                "group relative flex cursor-pointer items-center gap-x-2.5 rounded-lg border border-transparent p-2 transition-colors hover:bg-gray-200/60",
                {
                  "bg-gray-100 font-medium": pathname === route.path,
                },
              )}
              onClick={() => router.push(route.path)}
            >
              <Icon
                className={cn(
                  "size-[1.4rem] transition-colors group-hover:text-[#007DFC]",
                  {
                    "text-[#007DFC]": pathname === route.path,
                  },
                )}
              />
              <p>{route.name}</p>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
