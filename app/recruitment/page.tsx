"use client";

import { useAuth } from "@/components/auth-provider";
import { RecruitmentCard } from "@/components/recruitment-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Recruitment } from "@/lib/supabase/types";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RecruitmentPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchRecruitments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("competitions")
      .select("*")
      .is("event_id", null)
      .order("date", { ascending: false });
    if (error) console.error("Error fetching recruitments:", error);
    else setRecruitments(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRecruitments();
  }, [fetchRecruitments]);

  const handleCreate = async () => {
    if (!user) return;
    setIsCreating(true);
    const { data, error } = await supabase
      .from("competitions")
      .insert({ title: "新企業徵才", link: "", image: "/placeholder.png", date: new Date().toISOString().slice(0, 10), description: null, location: null, positions: null, event_id: null })
      .select()
      .single();
    if (error) { setIsCreating(false); return; }
    router.push(`/recruitment/${data.id}/edit`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">企業徵才</h1>
        {isAdmin && (
          <Button variant="secondary" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            新增
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : recruitments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">目前沒有企業徵才資訊</div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {recruitments.map((item) =>
            isAdmin ? (
              <div key={item.id} className="cursor-pointer h-full"
                onClick={() => router.push(`/recruitment/${item.id}/edit`)}>
                <RecruitmentCard item={item} />
              </div>
            ) : (
              <Link href={item.link || "#"} key={item.id} className="h-full" target="_blank" rel="noopener noreferrer">
                <RecruitmentCard item={item} />
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
