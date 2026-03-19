"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
  Youtube as YoutubeIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function ToolbarButton({
  ariaLabel,
  className,
  ...props
}: ComponentProps<typeof Button> & { ariaLabel: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={ariaLabel}
      className={className}
      {...props}
    />
  );
}

type EditorCommand = {
  ariaLabel: string;
  icon: typeof Bold;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
  isDisabled?: (editor: Editor) => boolean;
};

export const textFormattingCommands: EditorCommand[] = [
  {
    ariaLabel: "粗體",
    icon: Bold,
    isActive: (editor) => editor.isActive("bold"),
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    ariaLabel: "斜體",
    icon: Italic,
    isActive: (editor) => editor.isActive("italic"),
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    ariaLabel: "刪除線",
    icon: Strikethrough,
    isActive: (editor) => editor.isActive("strike"),
    onClick: (editor) => editor.chain().focus().toggleStrike().run(),
  },
];

export const headingCommands: EditorCommand[] = [
  {
    ariaLabel: "標題一",
    icon: Heading1,
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    ariaLabel: "標題二",
    icon: Heading2,
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    ariaLabel: "標題三",
    icon: Heading3,
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    ariaLabel: "標題四",
    icon: Heading4,
    isActive: (editor) => editor.isActive("heading", { level: 4 }),
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
];

export const listCommands: EditorCommand[] = [
  {
    ariaLabel: "項目清單",
    icon: List,
    isActive: (editor) => editor.isActive("bulletList"),
    onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    ariaLabel: "編號清單",
    icon: ListOrdered,
    isActive: (editor) => editor.isActive("orderedList"),
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
];

export const alignmentCommands: EditorCommand[] = [
  {
    ariaLabel: "靠左對齊",
    icon: AlignLeft,
    isActive: (editor) => editor.isActive({ textAlign: "left" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
  },
  {
    ariaLabel: "置中對齊",
    icon: AlignCenter,
    isActive: (editor) => editor.isActive({ textAlign: "center" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("center").run(),
  },
  {
    ariaLabel: "靠右對齊",
    icon: AlignRight,
    isActive: (editor) => editor.isActive({ textAlign: "right" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("right").run(),
  },
];

export const historyCommands: EditorCommand[] = [
  {
    ariaLabel: "復原",
    icon: Undo,
    onClick: (editor) => editor.chain().focus().undo().run(),
    isDisabled: (editor) => !editor.can().undo(),
  },
  {
    ariaLabel: "重做",
    icon: Redo,
    onClick: (editor) => editor.chain().focus().redo().run(),
    isDisabled: (editor) => !editor.can().redo(),
  },
];

export const mediaCommands: EditorCommand[] = [
  {
    ariaLabel: "插入 YouTube 影片",
    icon: YoutubeIcon,
    onClick: (editor) => {
      const url = window.prompt("請輸入 YouTube 影片網址");
      if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
    },
  },
];
