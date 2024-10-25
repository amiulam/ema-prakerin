"use server";

import db from "@/drizzle";
import { postTable } from "@/drizzle/schema";
import { validateRequest } from "@/lib/lucia";
import { slugify } from "@/lib/utils";
import { PostSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createPost = async (
  formData: FormData,
  body: string,
  excerpt: string,
) => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const validatedFields = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      error: "Data tidak valid",
    };
  }

  const { title, category } = validatedFields.data;
  const slug = slugify(title);

  try {
    await db.insert(postTable).values({
      title,
      body,
      slug,
      excerpt,
      userId: user.id,
      category,
    });
  } catch (error) {
    console.error("Kesalahan saat membuat post:", error);
    return { error: "Post gagal dibuat" };
  }

  revalidatePath("/app/posts");
  redirect("/app/posts");
};

export const updatePost = async (
  formData: FormData,
  body: string,
  excerpt: string,
  postId: number,
) => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const validatedFields = PostSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    console.log(validatedFields.error);

    return {
      error: "Invalid Fields",
    };
  }

  const existingPost = await db.query.postTable.findFirst({
    where: eq(postTable.id, postId),
  });

  if (!existingPost) {
    return { error: "Post not found" };
  }

  const { title, category } = validatedFields.data;
  const slug = slugify(title);

  try {
    await db
      .update(postTable)
      .set({
        title,
        body,
        slug,
        excerpt,
        category,
      })
      .where(eq(postTable.id, postId));
  } catch (error) {
    console.log(error);

    return { error: "Post gagal diubah" };
  }

  revalidatePath("/app/posts");
  redirect("/app/posts");
};

export const deletePost = async (postId?: number) => {
  if (!postId) {
    return { error: "Please provide post id" };
  }

  try {
    await db.transaction(async (tx) => {
      const existingPost = await tx.query.postTable.findFirst({
        where: eq(postTable.id, postId),
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      await tx.delete(postTable).where(eq(postTable.id, postId));
    });

    revalidatePath("/app/posts");
  } catch (error) {
    console.error("Kesalahan saat menghapus post:", error);
    return { error: "Gagal menghapus post" };
  }
};
