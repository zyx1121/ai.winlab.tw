"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Recruitment } from "@/lib/supabase/types";
import { uploadRecruitmentImage } from "@/lib/upload-image";
import { ArrowLeft, Check, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RecruitmentEditPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [savedRecruitment, setSavedRecruitment] = useState<Recruitment | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    recruitment && savedRecruitment
      ? recruitment.title !== savedRecruitment.title ||
        recruitment.link !== savedRecruitment.link ||
        (recruitment.image ?? "") !== (savedRecruitment.image ?? "") ||
        (recruitment.description ?? "") !== (savedRecruitment.description ?? "")
      : false;

  const fetchRecruitment = useCallback(async () => {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching recruitment:", error);
      router.push("/recruitment");
      return;
    }

    setRecruitment(data);
    setSavedRecruitment(data);
    setIsLoading(false);
  }, [supabase, id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchRecruitment();
    }
  }, [user, authLoading, fetchRecruitment, router]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      router.push("/recruitment");
    }
  }, [authLoading, user, isAdmin, router]);

  const handleSave = async () => {
    if (!recruitment) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("competitions")
      .update({
        title: recruitment.title,
        link: recruitment.link,
        image: recruitment.image ?? null,
        description: recruitment.description ?? null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving recruitment:", error);
    } else {
      setSavedRecruitment({ ...recruitment });
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !recruitment) return;

    setIsUploadingImage(true);
    const result = await uploadRecruitmentImage(file);
    e.target.value = "";

    if ("error" in result) {
      console.error(result.error);
      alert(result.error);
    } else {
      setRecruitment({ ...recruitment, image: result.url });
    }
    setIsUploadingImage(false);
  };

  const handleDelete = async () => {
    if (!confirm("確定要刪除這則企業徵才資訊嗎？")) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("competitions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting recruitment:", error);
      setIsDeleting(false);
      return;
    }

    router.push("/recruitment");
  };

  if (isLoading || authLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recruitment) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 flex flex-col mt-8 pb-16">
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/recruitment")}
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
                  src={recruitment.image || "/placeholder.png"}
                  alt={recruitment.title}
                  fill
                  className="object-cover"
                  unoptimized={
                    !!(
                      recruitment.image &&
                      (recruitment.image.startsWith("http://") ||
                        recruitment.image.startsWith("https://"))
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
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-sm mx-2">
              標題
            </Label>
            <Input
              id="title"
              value={recruitment.title}
              onChange={(e) =>
                setRecruitment({ ...recruitment, title: e.target.value })
              }
              placeholder="請輸入標題"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="link" className="text-sm mx-2">
              連結
            </Label>
            <Input
              id="link"
              type="url"
              value={recruitment.link}
              onChange={(e) =>
                setRecruitment({ ...recruitment, link: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-sm mx-2">
              簡介
            </Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground resize-y"
              value={recruitment.description ?? ""}
              onChange={(e) =>
                setRecruitment({
                  ...recruitment,
                  description: e.target.value || null,
                })
              }
              placeholder="公司或職缺簡介（選填）"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
