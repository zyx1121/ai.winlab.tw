"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { Result, Team, TeamInvitation } from "@/lib/supabase/types";
import { Loader2, Plus, Trash2, Users, Trophy, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AccountPage() {
  const { user, profile, refreshProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Profile fields
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Teams
  const [teams, setTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  // Results
  const [results, setResults] = useState<Result[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setPhone(profile.phone ?? "");
      setSocialLinks(profile.social_links ?? []);
    }
  }, [profile]);

  const fetchMyTeams = useCallback(async () => {
    if (!user) return;
    setIsLoadingTeams(true);
    const { data: members } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id);
    const ids = (members || []).map((m) => m.team_id);
    if (ids.length === 0) {
      setTeams([]);
      setIsLoadingTeams(false);
      return;
    }
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .in("id", ids);
    setTeams((teamsData as Team[]) || []);
    setIsLoadingTeams(false);
  }, [supabase, user]);

  const fetchInvitations = useCallback(async () => {
    if (!user?.email) return;
    const { data } = await supabase
      .from("team_invitations")
      .select("*")
      .eq("email", user.email)
      .eq("status", "pending");
    setInvitations((data as TeamInvitation[]) || []);
  }, [supabase, user?.email]);

  const fetchMyResults = useCallback(async () => {
    if (!user) return;
    setIsLoadingResults(true);

    // Get all team IDs the user belongs to
    const { data: memberRows } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id);
    const teamIds = (memberRows || []).map((m) => m.team_id);

    // Fetch results authored by user OR linked to user's teams
    let query = supabase
      .from("results")
      .select("*")
      .order("date", { ascending: false });

    if (teamIds.length > 0) {
      query = query.or(
        `author_id.eq.${user.id},team_id.in.(${teamIds.join(",")})`
      );
    } else {
      query = query.eq("author_id", user.id);
    }

    const { data } = await query;
    setResults((data as Result[]) || []);
    setIsLoadingResults(false);
  }, [supabase, user]);

  useEffect(() => {
    if (user) {
      fetchMyTeams();
      fetchInvitations();
      fetchMyResults();
    }
  }, [user, fetchMyTeams, fetchInvitations, fetchMyResults]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        phone: phone || null,
        social_links: socialLinks.filter((l) => l.trim() !== ""),
      })
      .eq("id", user.id);
    await refreshProfile();
    setIsSaving(false);
  };

  const handleAcceptInvite = async (invitationId: string, teamId: string) => {
    if (!user) return;
    await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: user.id,
      role: "member",
    });
    await supabase
      .from("team_invitations")
      .update({ status: "accepted" })
      .eq("id", invitationId);
    fetchInvitations();
    fetchMyTeams();
  };

  const handleRejectInvite = async (invitationId: string) => {
    await supabase
      .from("team_invitations")
      .update({ status: "rejected" })
      .eq("id", invitationId);
    fetchInvitations();
  };

  const addSocialLink = () => setSocialLinks((prev) => [...prev, ""]);
  const updateSocialLink = (idx: number, val: string) =>
    setSocialLinks((prev) => prev.map((l, i) => (i === idx ? val : l)));
  const removeSocialLink = (idx: number) =>
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx));

  const isExternalImage = (src: string | null | undefined) =>
    !!(src && (src.startsWith("http://") || src.startsWith("https://")));

  if (authLoading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">帳號設定</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
          <CardDescription>編輯您的個人資訊</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>姓名</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="請輸入姓名"
              />
            </div>
            <div className="grid gap-2">
              <Label>電子信箱</Label>
              <Input value={user.email ?? ""} disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>手機號碼</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="請輸入手機號碼"
                type="tel"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <Link2 className="w-4 h-4" />
                社群連結
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSocialLink}
              >
                <Plus className="w-4 h-4" />
                新增連結
              </Button>
            </div>
            {socialLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">尚未新增社群連結</p>
            )}
            {socialLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(e) => updateSocialLink(idx, e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(idx)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full sm:w-auto self-start">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            儲存變更
          </Button>
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>待處理邀請</CardTitle>
            <CardDescription>您已被邀請加入以下隊伍</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {invitations.map((inv) => (
              <InvitationRow
                key={inv.id}
                invitationId={inv.id}
                teamId={inv.team_id}
                onAccept={handleAcceptInvite}
                onReject={handleRejectInvite}
                supabase={supabase}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            我的隊伍
          </CardTitle>
          <CardDescription>您所屬的隊伍列表</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoadingTeams ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">您尚未加入任何隊伍</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teams.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/account/teams/${t.id}`}
                    className="block rounded-lg border p-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm"
                  >
                    <span className="font-medium">{t.name}</span>
                    {t.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/account/teams">
            <Button variant="secondary" className="w-full sm:w-auto">
              管理隊伍 / 建立新隊伍
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            我的活動成果
          </CardTitle>
          <CardDescription>您參與或所屬隊伍的活動成果</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingResults ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無活動成果紀錄</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/result/${item.id}/edit`}
                  className="group block rounded-lg border overflow-hidden transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm"
                >
                  <div className="relative w-full aspect-video bg-muted">
                    <Image
                      src={item.header_image || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={isExternalImage(item.header_image)}
                    />
                    <span
                      className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status === "published" ? "已發佈" : "草稿"}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-medium line-clamp-2 text-sm">
                      {item.title || "(無標題)"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.date || "—"} · {item.type === "personal" ? "個人" : "團隊"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link href="/result">
              <Button variant="secondary" className="w-full sm:w-auto">
                前往活動成果頁面
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvitationRow({
  invitationId,
  teamId,
  onAccept,
  onReject,
  supabase,
}: {
  invitationId: string;
  teamId: string;
  onAccept: (invId: string, teamId: string) => void;
  onReject: (invId: string) => void;
  supabase: ReturnType<typeof createClient>;
}) {
  const [teamName, setTeamName] = useState<string>("");
  useEffect(() => {
    supabase
      .from("teams")
      .select("name")
      .eq("id", teamId)
      .single()
      .then(({ data }) =>
        setTeamName((data as { name: string } | null)?.name ?? "")
      );
  }, [supabase, teamId]);
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <span>{teamName || "…"}</span>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onAccept(invitationId, teamId)}>
          接受
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onReject(invitationId)}
        >
          拒絕
        </Button>
      </div>
    </div>
  );
}
