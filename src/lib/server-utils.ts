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

export const getTemplateFile = async (templateFileName: string) => {
  // Get file url
  const fileUrl = `${process.env.NEXT_PUBLIC_URL}/template/${templateFileName}.docx`;

  // fetch the url
  const response = await fetch(fileUrl);

  // conver to array buffer
  const arrBuffer = await response.arrayBuffer();

  // convert to buffer
  const templateFile = Buffer.from(arrBuffer);

  return templateFile;
};
