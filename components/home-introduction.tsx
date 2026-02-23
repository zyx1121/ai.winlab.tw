"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Introduction } from "@/lib/supabase/types";
import { generateText } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeIntroduction() {
  const supabase = createClient();
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntroduction = async () => {
      const { data, error } = await supabase
        .from("introduction")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching introduction:", error);
      } else {
        setIntroduction(data);
      }
      setIsLoading(false);
    };

    fetchIntroduction();
  }, [supabase]);

  const contentText =
    introduction?.content && Object.keys(introduction.content).length > 0
      ? generateText(introduction.content, [StarterKit])
      : "";

  const truncatedText = contentText.length > 150
    ? contentText.slice(0, 150) + "..."
    : contentText;

  if (isLoading) {
    return (
      <div className="bg-muted/40 py-20 px-4 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-muted/40 py-20 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold">
          {introduction?.title || "國立陽明交通大學人工智慧專責辦公室"}
        </h2>
        {truncatedText && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {truncatedText}
          </p>
        )}
        <Link href="/introduction">
          <Button variant="secondary" size="lg" className="px-12 text-lg mt-2">探索更多</Button>
        </Link>
      </div>
    </div>
  );
}
