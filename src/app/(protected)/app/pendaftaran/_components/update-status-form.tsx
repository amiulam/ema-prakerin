"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UpdateStatusPendaftaranSchema,
  UpdateStatusPendaftaranValues,
} from "@/schemas";
import { updateStatusPendaftaran } from "@/actions/pendaftaran";
import { PendaftaranWithPeserta } from "@/drizzle/schema";

export default function UpdatePendaftaranStatusForm({
  dataPendaftaran,
  onFormSubmission,
}: {
  dataPendaftaran: PendaftaranWithPeserta;
  onFormSubmission: () => void;
}) {
  const form = useForm<UpdateStatusPendaftaranValues>({
    resolver: zodResolver(UpdateStatusPendaftaranSchema),
    defaultValues: {
      status: dataPendaftaran.statusId.toString(),
    },
  });

  const onSubmit = async (data: UpdateStatusPendaftaranValues) => {
    toast.loading("Updating...", { id: "update-status-pendaftaran" });
    const result = await updateStatusPendaftaran(data, dataPendaftaran.id);
    toast.dismiss("update-status-pendaftaran");

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Status berhasil diupdate");
      onFormSubmission();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {" "}
                    <SelectValue id="status" placeholder="Pilih Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">Proses</SelectItem>
                  <SelectItem value="3">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
