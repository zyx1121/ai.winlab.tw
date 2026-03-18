import EventResultEditPageClient from "./client";
import { type PublisherInfo } from "@/components/result-detail";
import { getViewer } from "@/lib/supabase/get-viewer";
import type { Result } from "@/lib/supabase/types";
import { redirect } from "next/navigation";

export default async function EventResultEditPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const { supabase, user, isAdmin } = await getViewer();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase.from("results").select("*").eq("id", id).single();
  if (!data) {
    redirect(`/events/${slug}?tab=results`);
  }

  let canEdit = isAdmin || data.author_id === user.id;
  if (!canEdit && data.type === "team" && data.team_id) {
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", data.team_id)
      .eq("user_id", user.id)
      .single();
    canEdit = membership?.role === "leader";
  }

  if (!canEdit) {
    redirect(`/events/${slug}?tab=results`);
  }

  const result = {
    ...data,
    type: (data as Result).type ?? "personal",
    team_id: (data as Result).team_id ?? null,
  } as Result;

  let publisherInfo: PublisherInfo = null;
  if (result.type === "team" && result.team_id) {
    const { data: teamData } = await supabase
      .from("teams")
      .select("name")
      .eq("id", result.team_id)
      .single();
    publisherInfo = {
      name: teamData?.name || "未知團隊",
      href: `/team/${result.team_id}`,
    };
  } else if (result.author_id) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", result.author_id)
      .single();
    publisherInfo = {
      name: profileData?.display_name || "未知使用者",
      href: `/profile/${result.author_id}`,
    };
  }

  return (
    <EventResultEditPageClient
      id={id}
      slug={slug}
      initialResult={result}
      initialPublisherInfo={publisherInfo}
    />
  );
}
