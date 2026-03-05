import { ResultDetail, type PublisherInfo } from "@/components/result-detail";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/supabase/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("results").select("title, summary").eq("id", id).single();
  const title = data?.title ?? "成果";
  return {
    title: `${title}｜人工智慧專責辦公室`,
    description: data?.summary ?? undefined,
  };
}

export default async function EventResultDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !data) notFound();

  const result = data as Result;

  let publisherInfo: PublisherInfo = null;
  if (result.type === "team" && result.team_id) {
    const { data: team } = await supabase.from("teams").select("name").eq("id", result.team_id).single();
    if (team) publisherInfo = { name: team.name, href: `/team/${result.team_id}` };
  } else if (result.author_id) {
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", result.author_id).single();
    if (profile) publisherInfo = { name: profile.display_name || "未知使用者", href: `/profile/${result.author_id}` };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href={`/events/${slug}?tab=results`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        返回活動
      </Link>

      <ResultDetail result={result} publisherInfo={publisherInfo} />
    </div>
  );
}
