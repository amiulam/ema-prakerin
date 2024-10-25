import {
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  DocumentPlusIcon,
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
    name: "Informasi",
    Icon: DocumentPlusIcon,
    roles: ["USER"],
    path: "/app/posts",
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

export const RouteForCheck = ROUTES.map(({ Icon, ...rest }) => {
  return {
    ...rest,
  };
});
