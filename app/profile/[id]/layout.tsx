import { JsonLd } from "@/components/json-ld";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("display_name")
    .eq("id", id)
    .single();

  const name = data?.display_name ?? "個人頁面";
  return {
    title: `${name}｜人工智慧專責辦公室`,
    description: `${name} 的公開個人頁面，收錄成果展示、外部作品與相關連結。`,
    alternates: {
      canonical: `/profile/${id}`,
    },
    openGraph: {
      title: `${name}｜人工智慧專責辦公室`,
      description: `${name} 的公開個人頁面，收錄成果展示、外部作品與相關連結。`,
      url: `/profile/${id}`,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("display_name")
    .eq("id", id)
    .single();
  const name = data?.display_name ?? "個人頁面";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `https://ai.winlab.tw/profile/${id}`,
    mainEntityOfPage: `https://ai.winlab.tw/profile/${id}`,
    worksFor: {
      "@type": "Organization",
      name: "國立陽明交通大學 人工智慧專責辦公室",
      url: "https://ai.winlab.tw",
    },
  };

  return (
    <>
      <JsonLd data={structuredData} />
      {children}
    </>
  );
}
