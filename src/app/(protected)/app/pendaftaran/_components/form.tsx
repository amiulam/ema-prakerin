"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import { MinusIcon } from "@radix-ui/react-icons";
import { PendaftaranWithPeserta } from "@/drizzle/schema";

export default function PendaftaranForm({
  type,
  dataPendaftaran,
}: {
  type: "Add" | "Edit";
  dataPendaftaran?: PendaftaranWithPeserta;
}) {
  const form = useForm<PendaftaranInput>({
    resolver: zodResolver(PendaftaranSchema),
    defaultValues:
      type == "Add"
        ? {
            lokasiPrakerin: "",
            peserta: [
              {
                gender: undefined,
                jurusan: "",
                keterangan: "",
                nama: "",
              },
            ],
          }
        : {
            lokasiPrakerin: dataPendaftaran?.lokasiPrakerin,
            peserta: dataPendaftaran?.peserta!.map((ps) => {
              return {
                id: ps.id.toString(),
                nama: ps.nama,
                gender: ps.gender,
                jurusan: ps.jurusan,
                keterangan: ps.keterangan!,
                test: ps.createdAt,
              };
            }),
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
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "peserta",
    control,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
          <div className="mb-5 mt-7 flex items-center">
            <div className="flex-grow border-t border-zinc-200" />
            <div className="mx-2 text-sm">Peserta Prakerin</div>
            <div className="flex-grow border-t border-zinc-200" />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-2.5 flex gap-3">
              <FormField
                control={control}
                name={`peserta.${index}.nama`}
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name={`peserta.${index}.jurusan`}
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name={`peserta.${index}.gender`}
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                name={`peserta.${index}.keterangan`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="keterangan">Keterangan</FormLabel>
                    <FormControl>
                      <Input id="keterangan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                size="icon"
                type="button"
                className="self-end"
                disabled={index === 0}
                onClick={() => {
                  remove(index);
                }}
              >
                <MinusIcon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end gap-x-2">
          <Button
            type="button"
            onClick={() => {
              append({
                nama: "",
                gender: "Laki-laki",
                jurusan: "",
                keterangan: "",
              });
            }}
          >
            Tambah Peserta
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {type === "Add" ? "Submit" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
