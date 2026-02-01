"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Competition } from "@/lib/supabase/types";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function CompetitionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCompetitions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching competitions:", error);
    } else {
      setCompetitions(data || []);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleCreateCompetition = async () => {
    if (!user) return;

    setIsCreating(true);
    const { data, error } = await supabase
      .from("competitions")
      .insert({
        title: "新競賽",
        link: "",
        image: "/placeholder.png",
        date: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating competition:", error);
      setIsCreating(false);
      return;
    }

    router.push(`/competition/${data.id}/edit`);
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-8 mt-8">
      <div className="z-10 relative">
        <h1 className="text-3xl font-bold w-full text-center">競賽資訊</h1>
        {user && (
          <Button
            variant="secondary"
            className="absolute right-0 top-0"
            onClick={handleCreateCompetition}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            新增競賽
          </Button>
        )}
      </div>
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
          {competitions.map((item) => {
            const card = (
              <Card className="py-0 hover:scale-102 transition-all duration-200 h-full flex flex-col">
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized={
                      !!(
                        item.image &&
                        (item.image.startsWith("http://") ||
                          item.image.startsWith("https://"))
                      )
                    }
                  />
                </div>
                <CardHeader className="pb-4 flex-1">
                  <CardTitle className="text-xl font-bold">
                    {item.title || "(無標題)"}
                  </CardTitle>
                  <CardDescription className="text-right">
                    {item.date || "—"}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
            return user ? (
              <button
                type="button"
                key={item.id}
                className="text-left w-full"
                onClick={() => router.push(`/competition/${item.id}/edit`)}
              >
                {card}
              </button>
            ) : (
              <Link
                href={item.link || "#"}
                key={item.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
