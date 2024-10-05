"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";
import { signIn } from "@/actions/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SigninInput, SignInSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/submit-button";

export function SignInForm() {
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

  const form = useForm<SigninInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SigninInput) {
    const state = await signIn(values);
    setFormState(state);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex flex-wrap justify-between">
          <Link href={"/signup"}>
            <span className="p-0 text-xs font-medium underline-offset-4 hover:underline">
              Not signed up? Sign up now.
            </span>
          </Link>
        </div>

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

        <SubmitButton
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          Sign in
        </SubmitButton>
      </form>
    </Form>
  );
}
