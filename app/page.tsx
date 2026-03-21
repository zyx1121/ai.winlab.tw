import { HomeAnnouncement } from "@/components/home-announcement";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeContacts } from "@/components/home-contacts";
import { HomeEvents } from "@/components/home-events";
import { HomeIntroduction } from "@/components/home-introduction";
import { getViewer } from "@/lib/supabase/get-viewer";

export default async function Home() {
  const { isAdmin } = await getViewer();

  return (
    <main className="flex flex-col">
      <HomeCarousel isAdmin={isAdmin} />
      <HomeIntroduction />
      {/* <HomeOrganization /> */}
      <HomeAnnouncement />
      <HomeEvents />
      <HomeContacts isAdmin={isAdmin} />
    </main>
  );
}
