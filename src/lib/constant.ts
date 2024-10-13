import {
  ClipboardDocumentListIcon,
  CommandLineIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { Route } from "./types";

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
    name: "Tables",
    Icon: TableCellsIcon,
    roles: ["ADMIN"],
    path: "/app/table",
  },
];
