"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePostStore } from "@/stores/postStore";
import { useTransition } from "react";
import { deletePost } from "@/actions/post";
import { toast } from "sonner";

export default function DeletePostAlert() {
  const [processing, startTransition] = useTransition();
  const isAlertOpen = usePostStore((state) => state.isAlertOpen);
  const setIsAlertOpen = usePostStore((state) => state.setIsAlertOpen);
  const post = usePostStore((state) => state.post);

  const deleteHandler = async () => {
    startTransition(() => {
      toast.loading("Deleting data...", { id: post?.id });

      deletePost(post?.id)
        .then((data) => {
          toast.dismiss(post?.id);

          if (data?.error) {
            toast.error(data.error);
          } else {
            toast.success("Data deleted successfully");
          }

          // Tutup alert setelah proses sukses atau gagal
          setIsAlertOpen(false);
        })
        .catch(() => {
          toast.error("Something went wrong!");

          // Tetap tutup alert meskipun ada error
          setIsAlertOpen(false);
        });
    });
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-bold">{post?.title}</span> and remove data
            from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={processing}
            onClick={() => setIsAlertOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            disabled={processing}
            onClick={deleteHandler}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
