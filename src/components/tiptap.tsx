"use client";

import { cn } from "@/lib/utils";
import { EditorContent, type Editor } from "@tiptap/react";

export default function TiptapEditor({ editor }: { editor: Editor }) {
  return (
    <div className="mx-auto my-5 w-full max-w-3xl">
      <div className="mb-4 flex space-x-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("bold"),
          })}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("italic"),
          })}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("underline"),
          })}
        >
          Underline
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("heading", { level: 1 }),
          })}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("heading", { level: 2 }),
          })}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("heading", { level: 3 }),
          })}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("bulletList"),
          })}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("rounded-md border bg-white px-3 py-1", {
            "bg-zinc-200": editor.isActive("orderedList"),
          })}
        >
          Ordered List
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-headings:leading-none prose-ul:list-disc prose-ul:pl-9 prose-ul:leading-none min-h-[200px] max-w-none rounded-md border bg-white p-6 focus:outline-none"
      />
    </div>
  );
}
