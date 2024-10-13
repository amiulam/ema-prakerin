"use client";

import { useUserStore } from "@/stores/userStore";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateUser } from "@/actions/user";

type TUpdateUser = z.infer<typeof UpdateUserSchema>;

export default function EditUserForm({
  onFormSubmission,
}: {
  onFormSubmission: () => void;
}) {
  const user = useUserStore((state) => state.user);

  const form = useForm<TUpdateUser>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      confirmPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  const onSubmit = async (values: TUpdateUser) => {
    toast.loading("Updating data...", { id: user?.id });
    const result = await updateUser(values, user?.id);
    toast.dismiss(user?.id);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("User updated successfully");
      onFormSubmission();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-2.5 space-y-1">
              <FormLabel className="">Name</FormLabel>
              <FormControl className="col-span-3">
                <Input {...field} />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2.5 space-y-1">
              <FormLabel className="">Email</FormLabel>
              <FormControl className="col-span-3">
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2.5 space-y-1">
              <FormLabel className="">Password</FormLabel>
              <FormControl className="col-span-3">
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-5 space-y-1">
              <FormLabel className="">Confirm Password</FormLabel>
              <FormControl className="col-span-3">
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
