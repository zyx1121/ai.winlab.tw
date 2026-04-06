import { EventAnnouncementEditClient } from "./client";
import { requireAdminServer } from "@/lib/supabase/require-admin-server";
import type { Announcement } from "@/lib/supabase/types";
import { redirect } from "next/navigation";

export default async function EventAnnouncementEditPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const { supabase } = await requireAdminServer();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    redirect(`/events/${slug}?tab=announcements`);
  }

  return (
    <EventAnnouncementEditClient
      id={id}
      slug={slug}
      initialAnnouncement={data as Announcement}
    />
  );
}
