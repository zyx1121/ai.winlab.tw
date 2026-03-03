import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Facebook,
  FileText,
  Github,
  Globe,
  Link2,
  Linkedin,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [profileRes, resultsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, bio, linkedin, facebook, github, website, resume, social_links")
      .eq("id", id)
      .single(),
    supabase
      .from("results")
      .select("*")
      .eq("author_id", id)
      .eq("status", "published")
      .eq("type", "personal")
      .order("date", { ascending: false }),
  ]);

  if (profileRes.error || !profileRes.data) notFound();

  const profile = profileRes.data;
  const results = (resultsRes.data as Result[]) || [];

  const displayName = profile.display_name || "未知使用者";
  const socialLinks = (profile.social_links as string[]) || [];

  const structuredLinks = [
    { key: "linkedin", label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
    { key: "facebook", label: "Facebook", href: profile.facebook, icon: Facebook },
    { key: "github", label: "GitHub", href: profile.github, icon: Github },
    { key: "website", label: "個人網站", href: profile.website, icon: Globe },
    { key: "resume", label: "履歷", href: profile.resume, icon: FileText },
  ].filter((l) => l.href);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/result"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {results.length} 篇個人成果
          </p>
        </div>
      </div>

      {/* Profile details */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>個人資訊</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Bio */}
          {profile.bio && (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* Structured social links */}
          {structuredLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {structuredLinks.map(({ key, label, href, icon: Icon }) => (
                <a
                  key={key}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </a>
              ))}
            </div>
          )}

          {/* Extra links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5" />
                額外連結
              </p>
              <div className="flex flex-col gap-1">
                {socialLinks.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline underline-offset-2 break-all hover:opacity-80"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!profile.bio && structuredLinks.length === 0 && socialLinks.length === 0 && (
            <p className="text-sm text-muted-foreground">尚未填寫個人資訊</p>
          )}
        </CardContent>
      </Card>

      {/* Results list */}
      <h2 className="text-lg font-semibold mb-4">個人成果</h2>
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
              <h3 className="text-xl font-semibold group-hover:underline underline-offset-2">
                {result.title}
              </h3>
              {result.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                  {result.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
