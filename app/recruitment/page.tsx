import { RecruitmentPageClient } from "./client";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import type { Recruitment } from "@/lib/supabase/types";

export default async function RecruitmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  const { data } = await supabase
    .from("competitions")
    .select("*")
    .is("event_id", null)
    .order("start_date", { ascending: false });

  const recruitments = (data as Recruitment[]) ?? [];

  return (
    <PageShell>
      <RecruitmentPageClient recruitments={recruitments} isAdmin={isAdmin} />
    </PageShell>
  );
}
