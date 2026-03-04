"use client";

import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeEvents() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
        return;
      }

      setEvents((data as Event[]) || []);
      setIsLoading(false);
    };

    fetchEvents();
  }, [supabase]);

  return (
    <div className="container max-w-6xl mx-auto py-16 px-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">活動專區</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">目前沒有活動</div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {events.map((item) => (
            <Link href={`/events/${item.slug}`} key={item.id} className="h-full">
              <EventCard item={item} />
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <Link href="/events">
          <Button variant="secondary" size="lg" className="px-12 text-lg">
            探索更多
          </Button>
        </Link>
      </div>
    </div>
  );
}
