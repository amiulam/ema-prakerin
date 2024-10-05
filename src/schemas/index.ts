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
