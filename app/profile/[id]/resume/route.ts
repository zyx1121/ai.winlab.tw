import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("resume")
    .eq("id", id)
    .single();

  if (!data?.resume) {
    redirect(`/profile/${id}`);
  }

  redirect(data.resume);
}
