import { JsonLd } from "@/components/json-ld";
import { AnnouncementPageClient } from "./client";
import { getViewer } from "@/lib/supabase/get-viewer";
import type { Announcement } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "公告｜人工智慧專責辦公室",
  description: "查看國立陽明交通大學人工智慧專責辦公室的最新公告、招生資訊與系統公告。",
  alternates: {
    canonical: "/announcement",
  },
  openGraph: {
    title: "公告｜人工智慧專責辦公室",
    description: "查看國立陽明交通大學人工智慧專責辦公室的最新公告、招生資訊與系統公告。",
    url: "/announcement",
  },
};

export default async function AnnouncementPage() {
  const { supabase, user, isAdmin } = await getViewer();

  const query = supabase
    .from("announcements")
    .select("*")
    .is("event_id", null)
    .order("date", { ascending: false });
  if (!isAdmin) query.eq("status", "published");
  const { data: announcements } = await query;
  const announcementList = (announcements as Announcement[]) ?? [];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "人工智慧專責辦公室公告列表",
    itemListElement: announcementList.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://ai.winlab.tw/announcement/${item.id}`,
      name: item.title,
    })),
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <AnnouncementPageClient
        announcements={announcementList}
        isAdmin={isAdmin}
        userId={user?.id ?? null}
      />
    </>
  );
}
