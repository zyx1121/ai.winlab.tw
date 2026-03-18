import { SettingsMenu } from "@/components/settings-menu";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { FileText, Image, Users } from "lucide-react";
import { redirect } from "next/navigation";

const items = [
  {
    href: "/carousel",
    icon: Image,
    label: "首頁橫幅",
    description: "管理首頁輪播圖片、標題與連結",
  },
  {
    href: "/settings/users",
    icon: Users,
    label: "用戶管理",
    description: "查看所有已註冊用戶及其角色",
  },
  {
    href: "/privacy/edit",
    icon: FileText,
    label: "隱私權政策",
    description: "編輯隱私權政策內容，支援版本紀錄",
  },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <PageShell className="block">
      <h1 className="text-3xl font-bold mb-8">系統設定</h1>
      <SettingsMenu items={items} />
    </PageShell>
  );
}
