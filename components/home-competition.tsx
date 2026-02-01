"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Competition } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeCompetition() {
  const supabase = createClient();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("date", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching competitions:", error);
      } else {
        setCompetitions(data || []);
      }
      setIsLoading(false);
    };

    fetchCompetitions();
  }, [supabase]);

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">競賽資訊</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          目前沒有競賽資訊
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {competitions.map((item) => (
            <Link
              href={item.link || "#"}
              key={item.id}
              target={item.link ? "_blank" : undefined}
              rel={item.link ? "noopener noreferrer" : undefined}
            >
              <Card className="py-0 hover:scale-102 transition-all duration-200">
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized={isExternalUrl(item.image)}
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-right">
                    {item.date || "—"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <Link href="/competition">
          <Button variant="secondary" size="lg" className="px-12 text-lg">
            探索更多
          </Button>
        </Link>
      </div>
    </div>
  );
}

function isExternalUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  return src.startsWith("http://") || src.startsWith("https://");
}
