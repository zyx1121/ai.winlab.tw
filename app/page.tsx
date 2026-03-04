import { HomeAnnouncement } from "@/components/home-announcement";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeContacts } from "@/components/home-contacts";
import { HomeEvents } from "@/components/home-events";
import { HomeIntroduction } from "@/components/home-introduction";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HomeCarousel />
      <HomeIntroduction />
      {/* <HomeOrganization /> */}
      <HomeAnnouncement />
      <HomeEvents />
      <HomeContacts />
    </main>
  );
}
