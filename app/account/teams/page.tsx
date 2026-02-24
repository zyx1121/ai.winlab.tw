"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Team } from "@/lib/supabase/types";
import { ArrowLeft, Loader2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AccountTeamsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data: members } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id);
    const ids = (members || []).map((m) => m.team_id);
    if (ids.length === 0) {
      setTeams([]);
      setIsLoading(false);
      return;
    }
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .in("id", ids);
    setTeams((teamsData as Team[]) || []);
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchTeams();
  }, [authLoading, user, router, fetchTeams]);

  const handleCreateTeam = async () => {
    if (!user) return;
    setIsCreating(true);
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: "新隊伍",
        description: null,
        leader_id: user.id,
      })
      .select()
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      setIsCreating(false);
      return;
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "leader",
    });

    if (memberError) {
      console.error("Error adding member:", memberError);
      setIsCreating(false);
      return;
    }

    router.push(`/account/teams/${team.id}`);
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/account">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            返回帳號
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          我的隊伍
        </h1>
        <Button onClick={handleCreateTeam} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          建立隊伍
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      ) : teams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>尚無隊伍</CardTitle>
            <CardDescription>
              建立隊伍後可邀請隊員，並以組長身分新增團隊成果。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateTeam} disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              建立第一支隊伍
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {teams.map((t) => (
            <li key={t.id}>
              <Link href={`/account/teams/${t.id}`}>
                <Card className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <CardHeader>
                    <CardTitle>{t.name}</CardTitle>
                    {t.description && (
                      <CardDescription>{t.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
