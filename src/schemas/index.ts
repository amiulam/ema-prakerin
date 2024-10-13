import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(2, "Please provide a name"),
  nis: z.string().length(10, { message: "NISN minimal 10 digit" }),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be 8 characters minimum.")
    .max(255),
});

export type SignupInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be 8 characters minimum.")
    .max(255),
});

export type SigninInput = z.infer<typeof SignInSchema>;

const PesertaPrakerin = z.object({
  id: z.string().optional(),
  nama: z.string().min(1, { message: "Nama harus diisi" }),
  jurusan: z.string().min(1, { message: "Jurusan harus diisi" }),
  gender: z.enum(["Laki-laki", "Perempuan"], {
    message: "Gender harus diisi",
  }),
  keterangan: z.string().optional(),
});

export const PendaftaranSchema = z.object({
  instansi: z.string().min(1, { message: "Instansi harus diisi" }),
  lokasiPrakerin: z.string().min(1, { message: "Lokasi prakerin harus diisi" }),
  peserta: z.array(PesertaPrakerin),
});

export type PendaftaranInput = z.infer<typeof PendaftaranSchema>;

export const ProsesPendaftaranSchema = z.object({
  tanggalMulai: z.date({ message: "Tanggal mulai harus diisi" }),
  tanggalSelesai: z.date({ message: "Tanggal selesai harus diisi" }),
  durasiPrakerin: z.string().min(1, "Durasi prakerin harus diisi"),
});

export const UpdateStatusPendaftaranSchema = z.object({
  status: z.string({ message: "Please select a status" }),
});

export type UpdateStatusPendaftaranValues = z.infer<
  typeof UpdateStatusPendaftaranSchema
>;

const CreateUser = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 character minimum" }),
  confirmPassword: z.string({ message: "Please provide a password" }),
  role: z.optional(z.enum(["ADMIN", "USER"])),
});

export const CreateUserSchema = CreateUser.superRefine(
  ({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  },
);

const UpdateUser = CreateUser.omit({
  role: true,
  password: true,
  confirmPassword: true,
}).extend({
  password: z
    .string()
    .min(8, { message: "Password must be 8 character minimum" })
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().optional(),
});

export const UpdateUserSchema = UpdateUser.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const SettingSchema = z.object({
  kepalaSekolah: z.string().min(1),
  nipKepalaSekolah: z.string().min(1),
});
