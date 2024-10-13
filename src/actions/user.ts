"use server";

import db from "@/drizzle";
import { userTable } from "@/drizzle/schema";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { generateId, Scrypt } from "lucia";
import { revalidatePath } from "next/cache";

export const createUser = async (values: unknown) => {
  const validatedFields = CreateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password, role } = validatedFields.data;

  const checkExistingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  if (checkExistingUser) {
    return { error: "Email sudah terdaftar" };
  }

  const userId = generateId(21);

  try {
    const hashedPassword = await new Scrypt().hash(password);

    await db.insert(userTable).values({
      id: userId,
      name,
      email: email.toLowerCase(),
      hashedPassword,
      role,
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
};

export const updateUser = async (values: unknown, userId?: string) => {
  if (!userId) {
    return { error: "Please provide user id" };
  }

  const validatedFields = UpdateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  if (!existingUser) {
    return { error: "User not found" };
  }

  let hashedPassword;

  if (password) {
    hashedPassword = await new Scrypt().hash(password);
  }

  try {
    await db
      .update(userTable)
      .set({
        name,
        email,
        hashedPassword: hashedPassword ?? existingUser?.hashedPassword,
      })
      .where(eq(userTable.id, userId));
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/app", "layout");
};

export const deleteUser = async (userId?: string) => {
  if (!userId) {
    return { error: "Please provide user id" };
  }

  try {
    await db.delete(userTable).where(eq(userTable.id, userId));
  } catch (error) {
    console.log(error);

    return {
      error: "Fail to delete data",
    };
  }

  revalidatePath("/app", "layout");
};
