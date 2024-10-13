import {
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Route } from "./types";

export const ITEMS_PER_PAGE = 7;

export const ROUTES: Route[] = [
  {
    name: "Dashboard",
    Icon: CommandLineIcon,
    roles: ["ADMIN", "USER"],
    path: "/app/dashboard",
  },
  {
    name: "Pendaftaran",
    Icon: ClipboardDocumentListIcon,
    roles: ["ADMIN", "USER"],
    path: "/app/pendaftaran",
  },
  {
    name: "Settings",
    Icon: Cog6ToothIcon,
    roles: ["ADMIN"],
    path: "/app/settings",
  },
  {
    name: "Users",
    Icon: UserGroupIcon,
    roles: ["ADMIN"],
    path: "/app/users",
  },
];
