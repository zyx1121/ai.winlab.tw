import PrivacyEditPageClient, { type VersionRecord } from "./client";
import { requireAdminServer } from "@/lib/supabase/require-admin-server";

export default async function PrivacyEditPage() {
  const { supabase, user } = await requireAdminServer();
  const { data } = await supabase
    .from("privacy_policy")
    .select("id, version, content, note, created_at, profiles!created_by(display_name)")
    .order("version", { ascending: false });

  const versions = ((data ?? []) as unknown as VersionRecord[]).map((record) => ({
    ...record,
    content: record.content ?? {},
  }));

  return (
    <PrivacyEditPageClient
      initialUserId={user.id}
      initialVersions={versions}
    />
  );
}
