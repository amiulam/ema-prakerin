import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeletePostAlert from "./delete-alert";
import PostActionButton from "./buttons";
import db from "@/drizzle";
import { desc } from "drizzle-orm";
import { postTable } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";

export default async function PostLists() {
  const postsData = await db.query.postTable.findMany({
    orderBy: [desc(postTable.id)],
  });

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {postsData.length == 0 && (
          <div className="col-span-3 text-center font-medium">No post yet.</div>
        )}
        {postsData.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <div className="flex items-center gap-x-2">
                    <Badge variant="outline">
                      {new Date(post.createdAt!).toLocaleDateString("id-ID")}
                    </Badge>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                </div>
                <PostActionButton post={post} />
              </div>
            </CardHeader>
            <CardContent>{post.excerpt.slice(0, 65) + "..."}</CardContent>
          </Card>
        ))}
      </div>
      <DeletePostAlert />
    </>
  );
}
