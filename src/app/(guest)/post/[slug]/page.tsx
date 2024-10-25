import db from "@/drizzle";
import { postTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await db.query.postTable.findFirst({
    where: eq(postTable.slug, params.slug),
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto mt-12 max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold text-gray-800">{post.title}</h1>
      <div className="mb-6 flex items-center text-sm text-gray-600">
        <span className="mr-4 rounded-full bg-blue-100 px-3 py-1">
          Kategori: {post.category}
        </span>
        <span className="flex items-center">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(post.createdAt!).toLocaleDateString("id-ID")}
        </span>
      </div>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  );
}
