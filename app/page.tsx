import { HomeAnnouncement } from "@/components/home-announcement";
import { HomeCarousel } from "@/components/home-carousel";
import { HomeRecruitment } from "@/components/home-recruitment";
import { HomeContacts } from "@/components/home-contacts";
import { HomeIntroduction } from "@/components/home-introduction";
import { HomeOrganization } from "@/components/home-organization";
import { HomeResult } from "@/components/home-result";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HomeCarousel />
      <HomeIntroduction />
      <HomeOrganization />
      <HomeAnnouncement />
      <HomeResult />
      <HomeRecruitment />
      <HomeContacts />
    </main>
  );
}
