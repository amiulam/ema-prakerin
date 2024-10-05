"use client";

import {
  CalendarIcon,
  CommandLineIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ROUTES = [
  {
    name: "Dashboard",
    Icon: CommandLineIcon,
    path: "/app/dashboard",
  },
  {
    name: "Tables",
    Icon: TableCellsIcon,
    path: "/app/table",
  },
];
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
      {/* <motion.nav
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
        }}
        whileHover={{
          width: 200,
        }}
        onMouseEnter={() => setNavHover(true)}
        onMouseLeave={() => setNavHover(false)}
        className="group absolute z-10 h-screen w-16 border-r border-zinc-200 bg-white"
      >
        <motion.img
          initial={{
            x: -20,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          src="/logo-ipsum.svg"
          className="mb-6 ml-4 mt-4 size-8"
        />
        <motion.ul
          initial={{
            x: -20,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          className="space-y-3 px-[0.70rem]"
        >
          {ROUTES.map(({ Icon, ...route }) => (
            <li
              key={route.name}
              className={cn(
                "relative flex cursor-pointer items-center rounded-lg border border-transparent p-2 transition-colors hover:bg-[#3248f2] hover:text-white",
                {
                  "bg-[#3248f2] text-white": pathname === route.path,
                },
              )}
              onClick={() => router.push(route.path)}
            >
              <Icon className="size-[1.4rem]" />
              <AnimatePresence>
                {navHover && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{
                      type: "spring",
                      duration: 0.4,
                    }}
                    className="absolute left-12 top-[9px] whitespace-nowrap text-[15px]"
                  >
                    {route.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </motion.ul>
      </motion.nav> */}
    </aside>
  );
}
