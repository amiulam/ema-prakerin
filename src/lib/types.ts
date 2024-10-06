import { TUser } from "@/drizzle/schema";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type Route = {
  name: string;
  roles: TUser["role"][];
  Icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  path: string;
};
