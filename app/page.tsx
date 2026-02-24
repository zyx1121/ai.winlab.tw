import { HomeAnnouncement } from "@/components/home-announcement";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeContacts } from "@/components/home-contacts";
import { HomeIntroduction } from "@/components/home-introduction";
import { HomeRecruitment } from "@/components/home-recruitment";
import { HomeResult } from "@/components/home-result";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HomeCarousel />
      <HomeIntroduction />
      {/* <HomeOrganization /> */}
      <HomeAnnouncement />
      <HomeResult />
      <HomeRecruitment />
      <HomeContacts />
    </main>
  );
}
