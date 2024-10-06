import "server-only";

import { validateRequest } from "./lucia";
import { redirect } from "next/navigation";

export const getAuthenticatedUser = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/signin");
  }

  return user;
};
