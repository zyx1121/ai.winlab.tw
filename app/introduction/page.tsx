"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Introduction } from "@/lib/supabase/types";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntroductionPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntroduction = async () => {
      const { data, error } = await supabase.from("introduction").select("*").single();
      if (error) console.error("Error fetching introduction:", error);
      else setIntroduction(data);
      setIsLoading(false);
    };
    fetchIntroduction();
  }, [supabase]);

  const contentHtml =
    introduction?.content && Object.keys(introduction.content).length > 0
      ? generateHTML(introduction.content, [StarterKit])
      : "";

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {introduction?.title || "國立陽明交通大學 人工智慧專責辦公室"}
        </h1>
        {isAdmin && (
          <Button variant="secondary" onClick={() => router.push("/introduction/edit")}>
            <Pencil className="w-4 h-4" />
            編輯
          </Button>
        )}
      </div>

      {contentHtml && (
        <div
          className="prose prose-sm sm:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </div>
  );
}
