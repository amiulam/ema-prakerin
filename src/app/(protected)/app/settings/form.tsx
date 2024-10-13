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
    },
  });

  const onSubmit = async (data: TSettingSchema) => {
    toast.loading("Inserting...", { id: "settings" });
    const result = await createOrUpdateSettings(data);
    toast.dismiss("settings");

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Setting berhasil di update");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
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
        </div>
        <div className="flex justify-end py-2">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
