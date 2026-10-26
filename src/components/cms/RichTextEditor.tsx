"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";
import { useState } from "react";

type MediaChoice = { url: string; alt: string; label: string };
const initialDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export default function RichTextEditor({ name, content, media = [] }: { name: string; content?: JSONContent; media?: MediaChoice[] }) {
  const [serialized, setSerialized] = useState(JSON.stringify(content?.type === "doc" ? content : initialDoc));
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true }), Image.configure({ allowBase64: false })],
    content: content?.type === "doc" ? content : initialDoc,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setSerialized(JSON.stringify(editor.getJSON())),
    editorProps: { attributes: { class: "prose-content min-h-56 max-w-none rounded-xl border border-forest/20 bg-white p-4 focus:outline-none" } },
  });
  return <div>
    <input type="hidden" name={name} value={serialized} />
    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-xl bg-mint-wash p-2">
      <button type="button" className="btn-secondary btn-sm" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
      <button type="button" className="btn-secondary btn-sm" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
      <button type="button" className="btn-secondary btn-sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading</button>
      <button type="button" className="btn-secondary btn-sm" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
      <button type="button" className="btn-secondary btn-sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered list</button>
      <button type="button" className="btn-secondary btn-sm" onClick={() => { const href = window.prompt("Link URL (use https:// or an internal path)"); if (href && (href.startsWith("https://") || href.startsWith("/"))) editor?.chain().focus().extendMarkRange("link").setLink({ href }).run(); }}>Add link</button>
      <select aria-label="Insert an image from the media library" className="field w-auto py-2 text-sm" defaultValue="" onChange={(event) => { const mediaItem = media.find((item) => item.url === event.target.value); if (mediaItem) editor?.chain().focus().setImage({ src: mediaItem.url, alt: mediaItem.alt }).run(); event.currentTarget.value = ""; }}>
        <option value="">Insert image from library</option>{media.map((item) => <option key={item.url} value={item.url}>{item.label}</option>)}
      </select>
    </div>
    <EditorContent editor={editor} />
  </div>;
}
