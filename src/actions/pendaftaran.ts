"use server";

import db from "@/drizzle";
import { pendaftaranTable } from "@/drizzle/schema";
import { getAuthenticatedUser } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { PendaftaranSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitPendaftaran(data: unknown) {
  const user = await getAuthenticatedUser();

  const validatedFields = PendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { nama, jurusan, lokasiPrakerin, gender, kontak } =
    validatedFields.data;

  try {
    await sleep(2000);
    await db.insert(pendaftaranTable).values({
      nama,
      jurusan,
      lokasiPrakerin,
      gender,
      kontak,
      userId: user.id,
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
}

export async function editPendaftaran(data: unknown, pendaftaranId: number) {
  await getAuthenticatedUser();

  const validatedFields = PendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const existingData = await db.query.pendaftaranTable.findFirst({
    where: eq(pendaftaranTable.id, pendaftaranId),
  });

  if (!existingData) {
    return {
      error: "Data pendaftaran tidak ditemukan",
    };
  }

  const { nama, jurusan, lokasiPrakerin, gender, kontak } =
    validatedFields.data;

  try {
    await sleep(2000);
    await db
      .update(pendaftaranTable)
      .set({
        nama,
        jurusan,
        lokasiPrakerin,
        gender,
        kontak,
      })
      .where(eq(pendaftaranTable.id, pendaftaranId));
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
}
