"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Competition } from "@/lib/supabase/types";
import { uploadCompetitionImage } from "@/lib/upload-image";
import { ArrowLeft, Check, ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CompetitionEditPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [savedCompetition, setSavedCompetition] = useState<Competition | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    competition && savedCompetition
      ? competition.title !== savedCompetition.title ||
      competition.link !== savedCompetition.link ||
      (competition.image ?? "") !== (savedCompetition.image ?? "")
      : false;

  const fetchCompetition = useCallback(async () => {
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching competition:", error);
      router.push("/competition");
      return;
    }

    setCompetition(data);
    setSavedCompetition(data);
    setIsLoading(false);
  }, [supabase, id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchCompetition();
    }
  }, [user, authLoading, fetchCompetition, router]);

  const handleSave = async () => {
    if (!competition) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("competitions")
      .update({
        title: competition.title,
        link: competition.link,
        image: competition.image ?? null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving competition:", error);
    } else {
      setSavedCompetition({ ...competition });
    }
    setIsSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !competition) return;

    setIsUploadingImage(true);
    const result = await uploadCompetitionImage(file);
    e.target.value = "";

    if ("error" in result) {
      console.error(result.error);
      alert(result.error);
    } else {
      setCompetition({ ...competition, image: result.url });
    }
    setIsUploadingImage(false);
  };

  const handleDelete = async () => {
    if (!confirm("確定要刪除這則競賽嗎？")) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("competitions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting competition:", error);
      setIsDeleting(false);
      return;
    }

    router.push("/competition");
  };

  if (isLoading || authLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 flex flex-col mt-8 pb-16">
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/competition")}
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
                  src={competition.image || "/placeholder.png"}
                  alt={competition.title}
                  fill
                  className="object-cover"
                  unoptimized={
                    !!(
                      competition.image &&
                      (competition.image.startsWith("http://") ||
                        competition.image.startsWith("https://"))
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
              value={competition.title}
              onChange={(e) =>
                setCompetition({ ...competition, title: e.target.value })
              }
              placeholder="請輸入競賽標題"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="link" className="text-sm mx-2">
              連結
            </Label>
            <Input
              id="link"
              type="url"
              value={competition.link}
              onChange={(e) =>
                setCompetition({ ...competition, link: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
