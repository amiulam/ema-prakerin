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

export const PendaftaranSchema = z.object({
  nama: z.string().min(1, { message: "Nama harus diisi" }),
  jurusan: z.string().min(1, { message: "Jurusan harus diisi" }),
  lokasiPrakerin: z.string().min(1, { message: "Lokasi prakerin harus diisi" }),
  gender: z.enum(["Laki-laki", "Perempuan"], {
    message: "Gender harus diisi",
  }),
  kontak: z.string().min(1, { message: "Kontak harus diisi" }),
});

export type PendaftaranInput = z.infer<typeof PendaftaranSchema>;
