"use server";

import db from "@/drizzle";
import {
  pendaftaranTable,
  PendaftaranWithPeserta,
  pesertaTable,
  suratPengantarTable,
  suratPermohonanTable,
} from "@/drizzle/schema";
import { getAuthenticatedUser, getTemplateFile } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { del, put } from "@vercel/blob";
import {
  PendaftaranSchema,
  ProsesPendaftaranSchema,
  UpdateStatusPendaftaranSchema,
} from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const easy = require("easy-template-x");
import { format, setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";

setDefaultOptions({ locale: id });

export async function submitPendaftaran(data: unknown) {
  const user = await getAuthenticatedUser();

  const validatedFields = PendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { lokasiPrakerin, peserta, instansi } = validatedFields.data;

  try {
    await sleep(2000);
    await db.transaction(async (tx) => {
      const insertedPendaftaran = await tx
        .insert(pendaftaranTable)
        .values({
          instansi,
          lokasiPrakerin,
          statusId: 1,
          userId: user.id,
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
  redirect("/app/pendaftaran");
}

export async function editPendaftaran(data: unknown, pendaftaranId: number) {
  await getAuthenticatedUser();

  const validatedFields = PendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const existingPendaftaran = await db.query.pendaftaranTable.findFirst({
    where: eq(pendaftaranTable.id, pendaftaranId),
  });

  if (!existingPendaftaran) {
    return {
      error: "Data pendaftaran tidak ditemukan",
    };
  }

  const { lokasiPrakerin, peserta, instansi } = validatedFields.data;

  try {
    await sleep(2000);
    await db.transaction(async (tx) => {
      await tx
        .update(pendaftaranTable)
        .set({
          instansi,
          lokasiPrakerin,
        })
        .where(eq(pendaftaranTable.id, pendaftaranId));

      // Ambil data peserta yang sudah ada di database berdasarkan pendaftaranId
      const existingPeserta = await tx
        .select()
        .from(pesertaTable)
        .where(eq(pesertaTable.pendaftaranId, pendaftaranId));

      // Buat map berdasarkan id peserta untuk perbandingan dan akses cepat
      const existingPesertaMap = new Map(existingPeserta.map((p) => [p.id, p]));

      for (const element of peserta) {
        const { id, ...rest } = element;
        if (existingPesertaMap.has(+element.id!)) {
          // Jika peserta sudah ada, cek apakah datanya berubah
          const oldData = existingPesertaMap.get(+element.id!);
          // Bandingkan data peserta baru dan lama, update jika berbeda
          if (JSON.stringify(oldData) !== JSON.stringify(element)) {
            await tx
              .update(pesertaTable)
              .set({ ...rest })
              .where(eq(pesertaTable.id, +element.id!));
          }
        } else {
          // Jika peserta baru, insert ke database
          await tx.insert(pesertaTable).values({
            ...rest,
            pendaftaranId,
          });
        }
      }

      // Hapus peserta yang tidak ada dalam data yang di-submit
      const submittedPesertaIds = new Set(peserta.map((p) => p.id));
      for (const oldPeserta of existingPeserta) {
        if (!submittedPesertaIds.has(oldPeserta.id.toString())) {
          await tx
            .delete(pesertaTable)
            .where(eq(pesertaTable.id, oldPeserta.id));
        }
      }
    });

    // Get surat permohonan dan surat pengantar
    const [suratPermohonan, suratPengantar] = await Promise.all([
      await db.query.suratPermohonanTable.findFirst({
        where: eq(suratPermohonanTable.pendaftaranId, existingPendaftaran.id),
      }),
      await db.query.suratPengantarTable.findFirst({
        where: eq(suratPengantarTable.pendaftaranId, existingPendaftaran.id),
      }),
    ]);

    // cek apakah surat sudah ada
    if (suratPengantar?.fileUrl && suratPermohonan?.fileUrl) {
      await Promise.all([
        del(suratPengantar.fileUrl),
        del(suratPermohonan.fileUrl),
      ]);

      // ambil data pendaftaran yang telah diupdate
      const updatedPendaftaran = await db.query.pendaftaranTable.findFirst({
        where: eq(pendaftaranTable.id, pendaftaranId),
        with: {
          peserta: true,
          status: true,
        },
      });

      if (!updatedPendaftaran) {
        return {
          error: "Data pendaftaran tidak ditemukan",
        };
      }

      // format tanggal mulai dan selesai
      const mulai = format(updatedPendaftaran.tanggalMulai!, "dd MMMM yyyy");
      const selesai = format(
        updatedPendaftaran.tanggalSelesai!,
        "dd MMMM yyyy",
      );

      // generate & upload file
      const result = await handleAndUploadFile({
        ...updatedPendaftaran,
        tanggalMulai: mulai,
        tanggalSelesai: selesai,
      });

      // handle permohonan generate/upload error
      if ("error" in result) {
        return { error: result.error };
      }

      // udpate table surat_permohonan
      await db
        .update(suratPermohonanTable)
        .set({
          fileUrl: result.permohonan.url,
          downloadUrl: result.permohonan.downloadUrl,
        })
        .where(eq(suratPermohonanTable.pendaftaranId, updatedPendaftaran.id));

      // update table surat_pengantar
      await db
        .update(suratPengantarTable)
        .set({
          fileUrl: result.pengantar.url,
          downloadUrl: result.pengantar.url,
        })
        .where(eq(suratPengantarTable.pendaftaranId, updatedPendaftaran.id));
    }
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
  redirect("/app/pendaftaran");
}

export async function prosesPendaftaran(
  values: unknown,
  pendaftaranId: number,
) {
  const validatedFields = ProsesPendaftaranSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const dataPendaftaran = await db.query.pendaftaranTable.findFirst({
    where: eq(pendaftaranTable.id, pendaftaranId),
    with: {
      peserta: true,
      status: true,
    },
  });

  if (!dataPendaftaran) {
    return { error: "Data pendaftaran tidak ditemukan" };
  }

  const { tanggalMulai, tanggalSelesai, durasiPrakerin } = validatedFields.data;

  const mulai = format(validatedFields.data.tanggalMulai, "dd MMMM yyyy");
  const selesai = format(validatedFields.data.tanggalSelesai, "dd MMMM yyyy");

  try {
    // update tabel pendaftaran
    const updatedPendaftaran = await db
      .update(pendaftaranTable)
      .set({
        tanggalMulai: tanggalMulai.toISOString(),
        tanggalSelesai: tanggalSelesai.toISOString(),
        durasiPrakerin,
        statusId: 2,
      })
      .where(eq(pendaftaranTable.id, pendaftaranId))
      .returning({ insertId: pendaftaranTable.id });

    // Generate and upload surat
    const result = await handleAndUploadFile({
      ...dataPendaftaran,
      tanggalMulai: mulai,
      tanggalSelesai: selesai,
      durasiPrakerin,
    });

    // handle permohonan generate/upload error
    if ("error" in result) {
      return { error: result.error };
    }

    // insert ke table surat_permohonan
    await db.insert(suratPermohonanTable).values({
      fileUrl: result.permohonan.url,
      downloadUrl: result.permohonan.downloadUrl,
      pendaftaranId: updatedPendaftaran[0].insertId,
    });

    // insert ke table surat_pengantar
    await db.insert(suratPengantarTable).values({
      fileUrl: result.pengantar.url,
      downloadUrl: result.pengantar.url,
      pendaftaranId: updatedPendaftaran[0].insertId,
    });
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong, when processing 'pendaftaran'" };
  }

  revalidatePath("/app/pendaftaran");
}

export const updateStatusPendaftaran = async (
  data: unknown,
  pendaftaranId: number,
) => {
  const validatedFields = UpdateStatusPendaftaranSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error);

    return {
      error: "Invalid Fields",
    };
  }

  try {
    await db
      .update(pendaftaranTable)
      .set({
        statusId: +validatedFields.data.status,
      })
      .where(eq(pendaftaranTable.id, pendaftaranId));
  } catch (error) {
    console.log(error);

    return { error: "Fail to update, something wen't wrong" };
  }

  revalidatePath("/app");
  redirect("/app/pendaftaran");
};

export async function handleAndUploadFile(
  dataPendaftaran: PendaftaranWithPeserta,
) {
  // Get template surat in paralel
  const [suratPermohonanTemplate, suratPengantarTemplate] = await Promise.all([
    getTemplateFile("surat-permohonan"),
    getTemplateFile("surat-pengantar"),
  ]);

  const settingsData = await db.query.settingsTable.findFirst({});

  if (!settingsData) {
    return { error: "Isi data pada menu settings terlebih dahulu" };
  }

  if (!settingsData.qrFileUrl!) {
    return { error: "QR tidak ditemukan" };
  }

  const imageBuffer = await downloadImageAsBuffer(settingsData.qrFileUrl!);

  const handler = new easy.TemplateHandler();
  const data = {
    ...dataPendaftaran,
    kepalaSekolah: settingsData?.kepalaSekolah,
    nipKepalaSekolah: settingsData?.nipKepalaSekolah,
    tanggalBuat: format(dataPendaftaran.createdAt!, "dd MMMM yyyy"),
    qrSignature: {
      _type: "image",
      source: imageBuffer,
      format: "image/png",
      width: 60,
      height: 60,
    },
  };
  try {
    const suratPermohonan = await handler.process(
      suratPermohonanTemplate,
      data,
    );
    const permohonan = await put(
      `surat-permohonan-${dataPendaftaran.instansi
        .split(" ")
        .map((el) => el.toLowerCase())
        .join("-")}.docx`,
      suratPermohonan,
      {
        access: "public",
      },
    );

    const suratPengantar = await handler.process(suratPengantarTemplate, data);
    const pengantar = await put(
      `surat-pengantar-${dataPendaftaran.instansi
        .split(" ")
        .map((el) => el.toLowerCase())
        .join("-")}.docx`,
      suratPengantar,
      {
        access: "public",
      },
    );

    return { permohonan, pengantar };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, when try to generate/upload file" };
  }
}

const downloadImageAsBuffer = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
