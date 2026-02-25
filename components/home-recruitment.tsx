"use client";

import { Button } from "@/components/ui/button";
import { RecruitmentCard } from "@/components/recruitment-card";
import { createClient } from "@/lib/supabase/client";
import type { Recruitment } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeRecruitment() {
  const supabase = createClient();
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecruitments = async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("date", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching recruitments:", error);
      } else {
        setRecruitments(data || []);
      }
      setIsLoading(false);
    };

    fetchRecruitments();
  }, [supabase]);

  return (
    <div className="bg-muted/40 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">企業徵才</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : recruitments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            目前沒有企業徵才資訊
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {recruitments.map((item) => (
              <Link
                href={item.link || "#"}
                key={item.id}
                className="h-full"
                target={item.link ? "_blank" : undefined}
                rel={item.link ? "noopener noreferrer" : undefined}
              >
                <RecruitmentCard item={item} />
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <Link href="/recruitment">
            <Button variant="secondary" size="lg" className="px-12 text-lg">
              探索更多
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
