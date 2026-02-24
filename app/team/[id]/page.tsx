import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/supabase/types";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [teamRes, resultsRes] = await Promise.all([
    supabase.from("teams").select("id, name, description").eq("id", id).single(),
    supabase.from("results").select("*").eq("team_id", id).eq("status", "published").eq("type", "team").order("date", { ascending: false }),
  ]);

  if (teamRes.error || !teamRes.data) notFound();

  const team = teamRes.data;
  const results = (resultsRes.data as Result[]) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/result"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* Team header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          {team.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{team.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-0.5">{results.length} 篇成果</p>
        </div>
      </div>

      <hr className="mb-10" />

      {/* Results list */}
      {results.length === 0 ? (
        <p className="text-muted-foreground">尚無已發布的成果。</p>
      ) : (
        <div className="flex flex-col divide-y">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/result/${result.id}`}
              className="py-6 group flex flex-col gap-1 hover:bg-muted/30 -mx-4 px-4 transition-colors rounded-lg"
            >
              <p className="text-sm text-muted-foreground">{result.date}</p>
              <h2 className="text-xl font-semibold group-hover:underline underline-offset-2">{result.title}</h2>
              {result.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{result.summary}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
