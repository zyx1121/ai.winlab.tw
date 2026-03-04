"use client";

import { useAuth } from "@/components/auth-provider";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/supabase/types";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function EventsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const query = supabase
      .from("events")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!user) query.eq("status", "published");

    const { data, error } = await query;
    if (error) console.error("Error fetching events:", error);
    else setEvents((data as Event[]) || []);
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async () => {
    if (!user || !isAdmin) return;
    setIsCreating(true);
    const tempSlug = `event-${Date.now()}`;
    const { data, error } = await supabase
      .from("events")
      .insert({
        name: "新活動",
        slug: tempSlug,
        description: null,
        cover_image: null,
        status: "draft",
        pinned: false,
        sort_order: 0,
      })
      .select()
      .single();
    if (error) { setIsCreating(false); return; }
    router.push(`/events/${data.slug}/edit`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">活動專區</h1>
        {isAdmin && (
          <Button variant="secondary" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            新增活動
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">目前沒有活動</div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {events.map((item) => (
            <Link href={`/events/${item.slug}`} key={item.id} className="h-full">
              <EventCard item={item} isAdmin={isAdmin} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
