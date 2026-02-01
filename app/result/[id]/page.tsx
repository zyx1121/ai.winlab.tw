import { createClient } from "@/lib/supabase/server";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft } from "lucide-react";
import ImageNext from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("results")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !result) {
    notFound();
  }

  const contentHtml =
    result.content && Object.keys(result.content).length > 0
      ? generateHTML(result.content, [
        StarterKit,
        Image.configure({
          HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
        }),
      ])
      : "<p>（無內容）</p>";

  const isExternalImage =
    result.header_image &&
    (result.header_image.startsWith("http://") ||
      result.header_image.startsWith("https://"));

  return (
    <div className="container max-w-5xl mx-auto p-4 flex flex-col gap-6 mt-8">
      <Link
        href="/result"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      <div className="flex flex-col gap-6">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <ImageNext
            src={result.header_image || "/placeholder.png"}
            alt={result.title}
            fill
            className="object-cover"
            unoptimized={!!isExternalImage}
            priority
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{result.date}</span>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mt-2 mb-4">
          {result.title}
        </h1>
        <div
          className="prose prose-sm sm:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
