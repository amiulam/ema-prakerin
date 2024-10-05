"use server";

import db from "@/drizzle";
import { userTable } from "@/drizzle/schema";
import { lucia, validateRequest } from "@/lib/lucia";
import { SignInSchema, SignUpSchema } from "@/schemas";
import { generateId, Scrypt } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (values: unknown) => {
  const parsed = SignInSchema.safeParse(values);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.userTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!existingUser || !existingUser?.hashedPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const validPassword = await new Scrypt().verify(
    existingUser.hashedPassword,
    password,
  );
  if (!validPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/app/dashboard");
};

export const signUp = async (values: unknown) => {
  const parsed = SignUpSchema.safeParse(values);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
        name: err.fieldErrors.name?.[0],
        nik: err.fieldErrors.name?.[0],
      },
    };
  }

  const { name, email, password, nis } = parsed.data;

  const existingUser = await db.query.userTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { email: true },
  });

  if (existingUser) {
    return {
      formError: "Cannot create account with that email",
    };
  }

  const userId = generateId(21);
  const hashedPassword = await new Scrypt().hash(password);

  await db.insert(userTable).values({
    id: userId,
    nis,
    name,
    email,
    hashedPassword,
  });

  return redirect("/signin");
};

export const signOut = async () => {
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "No session found",
    };
  }

  const result = await lucia.validateSession(session.id);

  await lucia.invalidateSession(result.session!.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
};
