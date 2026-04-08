import { OrganizationPageClient } from "./client";
import { IntroductionDetail } from "@/components/introduction-detail";
import { IntroductionEditButton } from "@/components/introduction-edit-button";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getViewer } from "@/lib/supabase/get-viewer";
import { renderRichTextHtml } from "@/lib/ui/rich-text";
import type { OrganizationMember, OrganizationMemberCategory } from "@/lib/supabase/types";
import type { Metadata } from "next";

const CATEGORIES: OrganizationMemberCategory[] = ["core", "legal_entity", "industry"];

export const metadata: Metadata = {
  title: "組織｜人工智慧專責辦公室",
  description: "認識國立陽明交通大學人工智慧專責辦公室的定位、任務與組織成員。",
  alternates: {
    canonical: "/introduction",
  },
  openGraph: {
    title: "組織｜人工智慧專責辦公室",
    description: "認識國立陽明交通大學人工智慧專責辦公室的定位、任務與組織成員。",
    url: "/introduction",
  },
};

export default async function OrganizationPage() {
  const { supabase, isAdmin } = await getViewer();

  const [{ data: introduction }, { data: allMembers }] = await Promise.all([
    supabase.from("introduction").select("*").single(),
    supabase
      .from("organization_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const contentHtml = renderRichTextHtml(introduction?.content) ?? "";

  const members = (allMembers as OrganizationMember[]) ?? [];
  const membersByCategory = Object.fromEntries(
    CATEGORIES.map((cat) => [cat, members.filter((m) => m.category === cat)])
  ) as Record<OrganizationMemberCategory, OrganizationMember[]>;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "組織｜人工智慧專責辦公室",
    description: "認識國立陽明交通大學人工智慧專責辦公室的定位、任務與組織成員。",
    url: "https://ai.winlab.tw/introduction",
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <PageShell>
        <IntroductionDetail
          title={introduction?.title || "國立陽明交通大學 人工智慧專責辦公室"}
          contentHtml={contentHtml}
          actions={isAdmin ? <IntroductionEditButton isAdmin={isAdmin} /> : undefined}
        />
      </PageShell>
      <OrganizationPageClient membersByCategory={membersByCategory} isAdmin={isAdmin} />
    </>
  );
}
