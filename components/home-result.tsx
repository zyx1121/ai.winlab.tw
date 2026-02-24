"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Result } from "@/lib/supabase/types";
import { Loader2, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ResultWithMeta = Result & {
  author_name?: string | null;
  team_name?: string | null;
};

export function HomeResult() {
  const supabase = createClient();
  const [results, setResults] = useState<ResultWithMeta[]>([]);
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
        setIsLoading(false);
        return;
      }

      const rows = (data as Result[]) || [];

      const authorIds = [...new Set(rows.map((r) => r.author_id).filter(Boolean))] as string[];
      const teamIds = [...new Set(rows.map((r) => r.team_id).filter(Boolean))] as string[];

      const [profilesRes, teamsRes] = await Promise.all([
        authorIds.length
          ? supabase.from("profiles").select("id, display_name").in("id", authorIds)
          : Promise.resolve({ data: [] }),
        teamIds.length
          ? supabase.from("teams").select("id, name").in("id", teamIds)
          : Promise.resolve({ data: [] }),
      ]);

      const profileMap = Object.fromEntries(
        ((profilesRes.data || []) as { id: string; display_name: string | null }[]).map((p) => [
          p.id,
          p.display_name,
        ])
      );
      const teamMap = Object.fromEntries(
        ((teamsRes.data || []) as { id: string; name: string }[]).map((t) => [t.id, t.name])
      );

      setResults(
        rows.map((r) => ({
          ...r,
          author_name: r.author_id ? profileMap[r.author_id] : null,
          team_name: r.team_id ? teamMap[r.team_id] : null,
        }))
      );
      setIsLoading(false);
    };

    fetchResults();
  }, [supabase]);

  const isExternalImage = (src: string | null | undefined) =>
    !!(src && (src.startsWith("http://") || src.startsWith("https://")));

  return (
    <div className="container max-w-6xl mx-auto py-16 px-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">最新成果</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">目前沒有成果</div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {results.map((item) => {
            const publisherName =
              item.type === "team"
                ? item.team_name || "未知隊伍"
                : item.author_name || "匿名";

            return (
              <Link href={`/result/${item.id}`} key={item.id} className="h-full">
                <Card className="py-0 h-full flex flex-col transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
                  <div className="relative w-full aspect-video shrink-0">
                    <Image
                      src={item.header_image || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={isExternalImage(item.header_image)}
                    />
                  </div>
                  <CardHeader className="shrink-0 pb-2">
                    <CardTitle className="text-xl font-bold line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="line-clamp-3 text-muted-foreground text-sm">
                      {item.summary || "（無摘要）"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <div className="flex items-center justify-between w-full gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {item.type === "team" ? (
                          <Users className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <User className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">{publisherName}</span>
                      </div>
                      <span className="shrink-0">{item.date || "—"}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
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
