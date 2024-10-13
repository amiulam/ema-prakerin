"use server";

import db from "@/drizzle";
import { settingsTable } from "@/drizzle/schema";
import { SettingSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createOrUpdateSettings = async (values: unknown) => {
  const validatedFields = SettingSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error);

    return {
      error: "Invalid Fields",
    };
  }

  try {
    await db.transaction(async (tx) => {
      const findedSettings = await tx.query.settingsTable.findFirst({
        where: eq(settingsTable.id, 1),
      });

      if (findedSettings) {
        await tx
          .update(settingsTable)
          .set({
            ...validatedFields.data,
          })
          .where(eq(settingsTable.id, 1));
      } else {
        await tx.insert(settingsTable).values({
          ...validatedFields.data,
        });
      }
    });
  } catch (error) {
    console.log(error);

    return { error: "Fail to update/create, something wen't wrong" };
  }

  revalidatePath("/app");
  redirect("/app/settings");
};
