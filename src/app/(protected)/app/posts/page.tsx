import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import PostLists from "./_components/lists";

export default async function PostPage() {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link href="/app/posts/create">
            <PlusCircledIcon className="mr-2 size-4" />
            Create Post
          </Link>
        </Button>
      </div>
      <Suspense key={"post-page"} fallback={"Loading..."}>
        <PostLists />
      </Suspense>
    </>
  );
}
