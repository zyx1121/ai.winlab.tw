"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Result } from "@/lib/supabase/types";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ResultPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    const query = supabase
      .from("results")
      .select("*")
      .order("date", { ascending: false });

    if (!user) {
      query.eq("status", "published");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching results:", error);
    } else {
      setResults(data || []);
    }
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleCreateResult = async () => {
    if (!user) return;

    setIsCreating(true);
    const { data, error } = await supabase
      .from("results")
      .insert({
        title: "新成果",
        date: new Date().toISOString().slice(0, 10),
        header_image: "/placeholder.png",
        summary: "",
        content: {},
        status: "draft",
        author_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating result:", error);
      setIsCreating(false);
      return;
    }

    router.push(`/result/${data.id}/edit`);
  };

  const isExternalImage = (src: string | null | undefined) =>
    !!(
      src &&
      (src.startsWith("http://") || src.startsWith("https://"))
    );

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-8 mt-8">
      <div className="z-10 relative">
        <h1 className="text-3xl font-bold w-full text-center">最新成果</h1>
        {user && (
          <Button
            variant="secondary"
            className="absolute right-0 top-0"
            onClick={handleCreateResult}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            新增成果
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          目前沒有成果
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {results.map((item) => {
            const card = (
              <Card className="py-0 h-full flex flex-col hover:scale-102 transition-all duration-200">
                <div className="relative w-full aspect-video shrink-0">
                  <Image
                    src={item.header_image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized={isExternalImage(item.header_image)}
                  />
                </div>
                <CardHeader className="shrink-0">
                  <CardTitle className="text-xl font-bold line-clamp-2">
                    {item.title || "(無標題)"}
                  </CardTitle>
                  <CardDescription className="text-right">
                    {item.date || "—"}
                  </CardDescription>
                  <Separator />
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-muted-foreground">
                    {item.summary || "（無摘要）"}
                  </p>
                </CardContent>
                <CardFooter />
              </Card>
            );
            return user ? (
              <button
                type="button"
                key={item.id}
                className="text-left w-full h-full"
                onClick={() => router.push(`/result/${item.id}/edit`)}
              >
                {card}
              </button>
            ) : (
              <Link href={`/result/${item.id}`} key={item.id} className="h-full">
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
