import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE_URL = "https://ai.winlab.tw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [announcementsRes, eventsRes, resultsRes, teamsRes] = await Promise.all([
    supabase
      .from("announcements")
      .select("id, date")
      .eq("status", "published")
      .is("event_id", null),
    supabase.from("events").select("slug, updated_at").eq("status", "published"),
    supabase.from("results").select("id, date").eq("status", "published"),
    supabase.from("teams").select("id"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1 },
    { url: `${BASE_URL}/introduction`, priority: 0.8 },
    { url: `${BASE_URL}/organization`, priority: 0.7 },
    { url: `${BASE_URL}/announcement`, priority: 0.8 },
    { url: `${BASE_URL}/events`, priority: 0.8 },
    { url: `${BASE_URL}/privacy`, priority: 0.3 },
  ];

  const announcementRoutes: MetadataRoute.Sitemap = (announcementsRes.data ?? []).map((a) => ({
    url: `${BASE_URL}/announcement/${a.id}`,
    lastModified: a.date ?? undefined,
    priority: 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = (eventsRes.data ?? []).map((e) => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: e.updated_at ?? undefined,
    priority: 0.7,
  }));

  const resultRoutes: MetadataRoute.Sitemap = (resultsRes.data ?? []).map((r) => ({
    url: `${BASE_URL}/result/${r.id}`,
    lastModified: r.date ?? undefined,
    priority: 0.6,
  }));

  const teamRoutes: MetadataRoute.Sitemap = (teamsRes.data ?? []).map((t) => ({
    url: `${BASE_URL}/team/${t.id}`,
    priority: 0.5,
  }));

  return [...staticRoutes, ...announcementRoutes, ...eventRoutes, ...resultRoutes, ...teamRoutes];
}
