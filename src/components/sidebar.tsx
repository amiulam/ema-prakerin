"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ROUTES } from "@/lib/constant";
import { useSession } from "@/context/session-context-provider";

export default function Sidebar() {
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="p-5">
      <nav>
        <div className="mb-7 flex items-center gap-x-3">
          <Image
            src="/images/logo.png"
            alt="the-logo"
            height={100}
            width={100}
            className="size-8"
          />
          <h1 className="font-bold text-primary">SMK Kristen Seriti</h1>
        </div>
        <ul className="space-y-3">
          {ROUTES.filter((item) => user && item.roles.includes(user.role)).map(
            ({ Icon, ...route }) => (
              <li
                key={route.name}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-x-2.5 rounded-lg border border-transparent p-2 transition-colors hover:bg-gray-200/60",
                  {
                    "bg-gray-100 font-medium": pathname.includes(route.path),
                  },
                )}
                onClick={() => router.push(route.path)}
              >
                <Icon
                  className={cn(
                    "size-[1.4rem] transition-colors group-hover:text-[#007DFC]",
                    {
                      "text-[#007DFC]": pathname.includes(route.path),
                    },
                  )}
                />
                <p>{route.name}</p>
              </li>
            ),
          )}
        </ul>
      </nav>
    </aside>
  );
}
