"use client";

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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeResult() {
  const supabase = createClient();
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching results:", error);
      } else {
        setResults(data || []);
      }
      setIsLoading(false);
    };

    fetchResults();
  }, [supabase]);

  const isExternalImage = (src: string | null | undefined) =>
    !!(
      src &&
      (src.startsWith("http://") || src.startsWith("https://"))
    );

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">最新成果</h2>
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
          {results.map((item) => (
            <Link href={`/result/${item.id}`} key={item.id} className="h-full">
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
                    {item.title}
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
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <Link href="/result">
          <Button variant="secondary" size="lg" className="px-12 text-lg">
            探索更多
          </Button>
        </Link>
      </div>
    </div>
  );
}
