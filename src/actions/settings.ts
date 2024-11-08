"use server";

import db from "@/drizzle";
import { settingsTable } from "@/drizzle/schema";
import { SettingSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { del, put } from "@vercel/blob";

export const createOrUpdateSettings = async (formData: FormData) => {
  const validatedFields = SettingSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);

    return {
      error: "Invalid Fields",
    };
  }

  const findedSettings = await db.query.settingsTable.findFirst({});

  let signatureFileUrl = undefined;
  let signatureDownloadUrl = undefined;
  let qrFileUrl = undefined;
  let qrDownloadUrl = undefined;

  if (validatedFields.data.file) {
    if (findedSettings) {
      await del(findedSettings.signatureFileUrl!);
      await del(findedSettings.qrFileUrl!);
    }

    const uploadSignatureResult = await put(
      `signature-image`,
      validatedFields.data.file,
      {
        access: "public",
      },
    );

    if (!uploadSignatureResult) {
      return { error: "fail to upload signature" };
    }

    const uploadQrResult = await generateQRCode();

    if (!uploadQrResult) {
      return { error: "fail to create qr code" };
    }

    signatureDownloadUrl = uploadSignatureResult.downloadUrl;
    signatureFileUrl = uploadSignatureResult.url;
    qrFileUrl = uploadQrResult.url;
    qrDownloadUrl = uploadQrResult.downloadUrl;
  }

  try {
    await db.transaction(async (tx) => {
      const findedSettings = await tx.query.settingsTable.findFirst({});

      if (findedSettings) {
        await tx.update(settingsTable).set({
          kepalaSekolah: validatedFields.data.kepalaSekolah,
          nipKepalaSekolah: validatedFields.data.nipKepalaSekolah,
          signatureFileUrl,
          signatureDownloadUrl,
          qrFileUrl,
          qrDownloadUrl,
        });
      } else {
        await tx.insert(settingsTable).values({
          kepalaSekolah: validatedFields.data.kepalaSekolah,
          nipKepalaSekolah: validatedFields.data.nipKepalaSekolah,
          signatureFileUrl,
          signatureDownloadUrl,
          qrFileUrl,
          qrDownloadUrl,
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

const generateQRCode = async () => {
  const url = `${process.env.NEXT_PUBLIC_URL}/signature`;

  const qrResult = await QRCode.toDataURL(url, {
    width: 400,
  })
    .then((url) => {
      return url;
    })
    .catch((err) => {
      console.error(err);
    });

  if (qrResult) {
    const blob = dataURLtoBlob(qrResult);

    const data = await put(`signature-qr`, blob, {
      access: "public",
    });
    return data;
  }

  return null;
};

const dataURLtoBlob = (dataURL: string) => {
  const parts = dataURL.split(",");
  const byteString = atob(parts[1]); // Decode base64
  const mimeString = parts[0].split(":")[1].split(";")[0]; // Extract mime type

  const arrayBuffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};
