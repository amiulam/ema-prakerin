"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PendaftaranInput, PendaftaranSchema } from "@/schemas";
import { editPendaftaran, submitPendaftaran } from "@/actions/pendaftaran";
import { toast } from "sonner";
import { usePendaftaranStore } from "@/stores/pendaftaranStore";

export default function PendaftaranForm({
  type,
  onFormSubmission,
}: {
  type: "Add" | "Edit";
  onFormSubmission: () => void;
}) {
  const dataPendaftaran = usePendaftaranStore((state) => state.pendaftaran);

  const form = useForm<PendaftaranInput>({
    resolver: zodResolver(PendaftaranSchema),
    defaultValues:
      type === "Add"
        ? {
            nama: "",
            jurusan: "",
            lokasiPrakerin: "",
            gender: undefined,
            kontak: "",
          }
        : {
            nama: dataPendaftaran?.nama,
            jurusan: dataPendaftaran?.jurusan,
            lokasiPrakerin: dataPendaftaran?.lokasiPrakerin,
            gender: dataPendaftaran?.gender,
            kontak: dataPendaftaran?.kontak,
          },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  const onSubmit = async (values: PendaftaranInput) => {
    let result;
    toast.loading("Processing...", { id: "form-pendaftaran" });
    if (type === "Add") {
      result = await submitPendaftaran(values);
    } else {
      result = await editPendaftaran(values, dataPendaftaran?.id!);
    }

    toast.dismiss("form-pendaftaran");

    if (result?.error) {
      toast.error(result.error);
    } else {
      if (type === "Add") {
        toast.success("Pendaftaran berhasil");
      } else {
        toast.success("Data pendaftaran berhasil diubah");
      }
      onFormSubmission();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            control={control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nama</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="jurusan"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="jurusan">Jurusan</FormLabel>
                <FormControl>
                  <Input
                    id="jurusan"
                    placeholder="Teknik Informatika"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lokasiPrakerin"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lokasiPrakerin">Lokasi Prakerin</FormLabel>
                <FormControl>
                  <Input
                    id="lokasiPrakerin"
                    placeholder="Nama Perusahaan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      {" "}
                      <SelectValue
                        id="jenis-kelamin"
                        placeholder="Pilih Gender"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="kontak"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="kontak">Kontak</FormLabel>
                <FormControl>
                  <Input
                    id="kontak"
                    type="number"
                    placeholder="082323423423"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
