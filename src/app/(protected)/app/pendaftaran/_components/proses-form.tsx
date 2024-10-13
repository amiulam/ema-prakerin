"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProsesPendaftaranSchema } from "@/schemas";
import { DatePicker } from "@/components/date-picker";
import { prosesPendaftaran } from "@/actions/pendaftaran";
import { toast } from "sonner";

// Define schema type
type ProsesPendaftaranFormValues = z.infer<typeof ProsesPendaftaranSchema>;

export function ProsesPendaftaranForm({
  pendaftaranId,
  onFormSubmission,
}: {
  pendaftaranId: number;
  onFormSubmission: () => void;
}) {
  const form = useForm<ProsesPendaftaranFormValues>({
    resolver: zodResolver(ProsesPendaftaranSchema),
    defaultValues: {
      tanggalSelesai: undefined,
      tanggalMulai: undefined,
      durasiPrakerin: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: ProsesPendaftaranFormValues) => {
    toast.loading("Processing data...", { id: pendaftaranId });
    const result = await prosesPendaftaran(values, pendaftaranId);
    toast.dismiss(pendaftaranId);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Surat berhasil dibuat");
      onFormSubmission();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="tanggalMulai"
          render={({ field }) => (
            <FormItem className="mb-4 flex flex-col gap-y-1">
              <FormLabel>Tanggal Mulai</FormLabel>
              <DatePicker field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tanggalSelesai"
          render={({ field }) => (
            <FormItem className="mb-3 flex flex-col gap-y-1">
              <FormLabel>Tanggal Selesai</FormLabel>
              <DatePicker field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="durasiPrakerin"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel htmlFor="durasiPrakerin">Durasi Prakerin ±</FormLabel>
              <FormControl>
                <Input
                  id="durasiPrakerin"
                  type="number"
                  placeholder="Durasi dalam bulan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex justify-end gap-x-2">
          <Button type="submit" disabled={isSubmitting}>
            Proses
          </Button>
        </div>
      </form>
    </Form>
  );
}
