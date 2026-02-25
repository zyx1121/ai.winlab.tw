"use client";

import { AnnouncementTable } from "@/components/announcement-table";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Announcement } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomeAnnouncement() {
  const router = useRouter();
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching announcements:", error);
      } else {
        setAnnouncements(data || []);
      }
      setIsLoading(false);
    };

    fetchAnnouncements();
  }, [supabase]);

  return (
    <div className="container max-w-6xl mx-auto py-16 px-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">最新公告</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">目前沒有公告</div>
      ) : (
        <AnnouncementTable
          announcements={announcements}
          onRowClick={(item) => router.push(`/announcement/${item.id}`)}
        />
      )}
      <div className="flex justify-center">
        <Link href="/announcement">
          <Button variant="secondary" size="lg" className="px-12 text-lg">
            探索更多
          </Button>
        </Link>
      </div>
    </div>
  );
}
