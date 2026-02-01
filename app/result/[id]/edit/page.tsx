"use client";

import { useAuth } from "@/components/auth-provider";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Result } from "@/lib/supabase/types";
import { uploadResultImage } from "@/lib/upload-image";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ResultEditPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [result, setResult] = useState<Result | null>(null);
  const [savedResult, setSavedResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    result && savedResult
      ? result.title !== savedResult.title ||
      result.date !== savedResult.date ||
      result.summary !== savedResult.summary ||
      (result.header_image ?? "") !== (savedResult.header_image ?? "") ||
      JSON.stringify(result.content) !== JSON.stringify(savedResult.content)
      : false;

  const fetchResult = useCallback(async () => {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching result:", error);
      router.push("/result");
      return;
    }

    setResult(data);
    setSavedResult(data);
    setIsLoading(false);
  }, [supabase, id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchResult();
    }
  }, [user, authLoading, fetchResult, router]);

  const handleSave = async () => {
    if (!result) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("results")
      .update({
        title: result.title,
        date: result.date,
        summary: result.summary,
        header_image: result.header_image ?? null,
        content: result.content,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving result:", error);
    } else {
      setSavedResult({ ...result });
    }
    setIsSaving(false);
  };

  const handlePublish = async () => {
    if (!result) return;

    setIsPublishing(true);
    const newStatus: "draft" | "published" =
      result.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("results")
      .update({
        title: result.title,
        date: result.date,
        summary: result.summary,
        header_image: result.header_image ?? null,
        content: result.content,
        status: newStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("Error publishing result:", error);
    } else {
      const updated: Result = { ...result, status: newStatus };
      setResult(updated);
      setSavedResult(updated);
    }
    setIsPublishing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !result) return;

    setIsUploadingImage(true);
    const uploadResult = await uploadResultImage(file);
    e.target.value = "";

    if ("error" in uploadResult) {
      console.error(uploadResult.error);
      alert(uploadResult.error);
    } else {
      setResult({ ...result, header_image: uploadResult.url });
    }
    setIsUploadingImage(false);
  };

  const handleDelete = async () => {
    if (!confirm("確定要刪除這則成果嗎？")) return;

    setIsDeleting(true);
    const { error } = await supabase.from("results").delete().eq("id", id);

    if (error) {
      console.error("Error deleting result:", error);
      setIsDeleting(false);
      return;
    }

    router.push("/result");
  };

  if (isLoading || authLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 flex flex-col mt-8 pb-16">
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/result")}
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
          <div className="flex gap-2">
            <Button
              variant={hasChanges ? "outline" : "ghost"}
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hasChanges ? (
                <Save className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4 text-green-600" />
              )}
              {hasChanges ? "儲存" : "已儲存"}
            </Button>
            <Button
              variant={result.status === "published" ? "secondary" : "default"}
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {result.status === "published" ? "取消發布" : "發布"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              刪除
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-sm mx-2">封面圖片</Label>
            <div className="flex items-start gap-4">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={result.header_image || "/placeholder.png"}
                  alt={result.title}
                  fill
                  className="object-cover"
                  unoptimized={
                    !!(
                      result.header_image &&
                      (result.header_image.startsWith("http://") ||
                        result.header_image.startsWith("https://"))
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImagePlus className="w-4 h-4" />
                  )}
                  {isUploadingImage ? "上傳中…" : "上傳圖片"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPEG、PNG、GIF、WebP，最大 5MB
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="title" className="text-sm mx-2">
                標題
              </Label>
              <Input
                id="title"
                value={result.title}
                onChange={(e) =>
                  setResult({ ...result, title: e.target.value })
                }
                placeholder="請輸入成果標題"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="date" className="text-sm mx-2">
                日期
              </Label>
              <Input
                id="date"
                type="date"
                value={result.date}
                onChange={(e) =>
                  setResult({ ...result, date: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="summary" className="text-sm mx-2">
              摘要（卡片預覽用，選填）
            </Label>
            <Input
              id="summary"
              value={result.summary}
              onChange={(e) =>
                setResult({ ...result, summary: e.target.value })
              }
              placeholder="簡短描述，顯示於列表卡片"
            />
          </div>
        </div>
      </div>

      <TiptapEditor
        content={result.content}
        onChange={(content) => setResult({ ...result, content })}
      />
    </div>
  );
}
