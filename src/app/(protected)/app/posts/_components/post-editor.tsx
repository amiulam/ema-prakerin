"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import TiptapEditor from "@/components/tiptap";
import { z } from "zod";
import { PostSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPost } from "@/actions/post";

type TPostSchema = z.infer<typeof PostSchema>;

export default function PostEditor() {
  const form = useForm<TPostSchema>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      category: undefined,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none",
      },
    },
    content: "<p>Tuliskan sesuatu di sini...</p>",
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: TPostSchema) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);

    toast.loading("Creating post...", { id: "create-post" });
    const result = await createPost(
      formData,
      editor.getHTML(),
      editor.getText().slice(0, 200),
    );
    toast.dismiss("create-post");
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Post created successfully");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl p-3"
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="mb-2.5 space-y-1">
              <FormLabel htmlFor="title">Title*</FormLabel>
              <FormControl className="col-span-3">
                <Input
                  id="title"
                  {...field}
                  className="bg-white"
                  placeholder="Agenda Sekolah"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem className="mb-2.5 space-y-1">
              <FormLabel>Kategori*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="col-span-3">
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                  <SelectItem value="Agenda">Agenda</SelectItem>
                  <SelectItem value="Berita">Berita</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <TiptapEditor editor={editor} />
        <Button type="submit" className="text-right" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
