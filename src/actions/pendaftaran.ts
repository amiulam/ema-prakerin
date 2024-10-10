"use server";

import db from "@/drizzle";
import { pendaftaranTable, pesertaTable } from "@/drizzle/schema";
import { getAuthenticatedUser } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { PendaftaranSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitPendaftaran(data: unknown) {
  const user = await getAuthenticatedUser();

  const validatedFields = PendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { lokasiPrakerin, peserta } = validatedFields.data;

  try {
    await sleep(2000);
    await db.transaction(async (tx) => {
      const insertedPendaftaran = await tx
        .insert(pendaftaranTable)
        .values({
          lokasiPrakerin,
        })
        .returning({ insertId: pendaftaranTable.id });

      for (let i = 0; i < peserta.length; i++) {
        const { id, ...element } = peserta[i];
        await tx.insert(pesertaTable).values({
          ...element,
          pendaftaranId: insertedPendaftaran[0].insertId,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
  redirect('/app/pendaftaran');
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

  const { lokasiPrakerin, peserta } = validatedFields.data;

  try {
    await sleep(2000);
    await db.transaction(async (tx) => {
      await tx
        .update(pendaftaranTable)
        .set({
          lokasiPrakerin,
        })
        .where(eq(pendaftaranTable.id, pendaftaranId))
        .returning({ insertId: pendaftaranTable.id });

      // Ambil data peserta yang sudah ada di database berdasarkan pendaftaranId
      const existingPeserta = await tx
        .select()
        .from(pesertaTable)
        .where(eq(pesertaTable.pendaftaranId, pendaftaranId));

      // Buat set untuk menyimpan pesertaId yang baru dan lama untuk membandingkan
      const submittedPesertaIds = new Set(peserta.map((p) => p.id));
      const existingPesertaIds = new Set(existingPeserta.map((p) => p.id));

      // Tambah peserta baru (peserta yang ada di submitted data, tapi tidak di existing data)
      for (const element of peserta) {
        if (!existingPesertaIds.has(+element.id!)) {
          const { id, ...rest } = element;
          await tx.insert(pesertaTable).values({
            ...rest,
            pendaftaranId,
          });
        }
      }

      // Hapus peserta lama (peserta yang ada di existing data, tapi tidak di submitted data)
      for (const element of existingPeserta) {
        if (!submittedPesertaIds.has(element.id.toString())) {
          await tx.delete(pesertaTable).where(eq(pesertaTable.id, element.id));
        }
      }
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
  redirect('/app/pendaftaran');
}
