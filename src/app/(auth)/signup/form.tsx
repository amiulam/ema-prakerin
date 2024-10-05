"use client";

import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import { signUp } from "@/actions/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInput, SignUpSchema } from "@/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const [formState, setFormState] = useState<
    | {
        formError?: undefined;
        fieldError: {
          email: string | undefined;
          password: string | undefined;
        };
      }
    | {
        formError: string;
        fieldError?: undefined;
      }
  >({ fieldError: undefined, formError: "" });

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      nis: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignupInput) {
    toast.loading("Processing...", { id: "sign-up-processing" });

    const state = await signUp(values);
    setFormState(state);

    toast.dismiss("sign-up-processing");

    if (!state?.fieldError && !state?.formError) {
      toast.success("Registrasi berhasil, silahkan login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="nis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NISN</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2024******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formState?.fieldError ? (
          <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {Object.values(formState.fieldError).map((err) => (
              <li className="ml-4" key={err}>
                {err}
              </li>
            ))}
          </ul>
        ) : formState?.formError ? (
          <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {formState?.formError}
          </p>
        ) : null}
        <div>
          <Link href={"/signin"}>
            <span className="p-0 text-xs font-medium underline-offset-4 hover:underline">
              Already signed up? Sign in instead.
            </span>
          </Link>
        </div>

        <SubmitButton
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          Sign up
        </SubmitButton>
      </form>
    </Form>
  );
}
