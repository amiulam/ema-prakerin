import db from "@/drizzle";
import EditPostForm from "../../_components/edit-post-form";
import { notFound } from "next/navigation";
import { postTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await db.query.postTable.findFirst({
    where: eq(postTable.id, +params.id),
  });

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <EditPostForm post={post} />
    </div>
  );
}
