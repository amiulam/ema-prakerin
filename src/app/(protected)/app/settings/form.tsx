"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingSchema } from "@/schemas";
import { toast } from "sonner";
import { createOrUpdateSettings } from "@/actions/settings";
import { TSettings } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TSettingSchema = z.infer<typeof SettingSchema>;

export default function SettingsForm({
  settingsData,
}: {
  settingsData: TSettings | undefined;
}) {
  const form = useForm<TSettingSchema>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      kepalaSekolah: settingsData?.kepalaSekolah,
      nipKepalaSekolah: settingsData?.nipKepalaSekolah,
      file: undefined,
    },
  });

  const onSubmit = async (data: TSettingSchema) => {
    const formData = new FormData();

    if (data.file) {
      formData.append("file", data.file);
    }
    formData.append("kepalaSekolah", data.kepalaSekolah);
    formData.append("nipKepalaSekolah", data.nipKepalaSekolah);

    toast.loading("Inserting...", { id: "settings" });
    const result = await createOrUpdateSettings(formData);
    toast.dismiss("settings");

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Setting berhasil di update");
      setValue("file", undefined);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    setValue,
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 grid gap-3">
          <FormField
            control={control}
            name="kepalaSekolah"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="kepalaDesa">Nama Kepala Desa</FormLabel>
                <FormControl>
                  <Input
                    id="kepalaDesa"
                    placeholder="Nama Kepala Desa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="nipKepalaSekolah"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="nipKepalaSekolah">NIP</FormLabel>
                <FormControl>
                  <Input
                    id="nipKepalaSekolah"
                    placeholder="19730304xxxxxx"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Upload Tanda Tangan</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn("flex justify-end py-2", {
            "justify-between": settingsData?.signatureFileUrl,
          })}
        >
          {settingsData?.signatureFileUrl && (
            <Image
              src={settingsData?.qrFileUrl!}
              height={100}
              width={100}
              alt="Signature QR"
            />
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="self-end"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
