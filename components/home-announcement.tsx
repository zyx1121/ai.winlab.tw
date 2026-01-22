"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

const announcementData = [
  {
    id: 1,
    date: "2025-11-10",
    category: "教發中心",
    title: "【招募】114-2 ideaNCU創意社群熱血開跑嚕！課程提出自主學習計劃，補助最高1萬元～",
  },
  {
    id: 2,
    date: "2025-10-22",
    category: "教發中心",
    title: "【公告】114-1 ideaNCU創意社群期初審查結果出爐嚕！",
  },
  {
    id: 3,
    date: "2025-10-15",
    category: "教發中心",
    title: "【公告】114-1 ideaNCU創意社群期初審查結果出爐嚕！",
  },
  {
    id: 4,
    date: "2025-10-10",
    category: "教發中心",
    title: "【公告】114-1 ideaNCU創意社群期初審查結果出爐嚕！",
  },
  {
    id: 5,
    date: "2025-10-05",
    category: "教發中心",
    title: "【公告】114-1 ideaNCU創意社群期初審查結果出爐嚕！",
  },
];

export function HomeAnnouncement() {
  const router = useRouter();

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">最新公告</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted h-12">
            <TableHead className="text-base font-bold">公告日期</TableHead>
            <TableHead className="text-base font-bold">類別</TableHead>
            <TableHead className="text-base font-bold">標題</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcementData.slice(0, 5).map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer h-12"
              onClick={() => router.push(`/announcement/${item.id}`)}
            >
              <TableCell className="text-base">{item.date}</TableCell>
              <TableCell className="text-base">{item.category}</TableCell>
              <TableCell className="text-base">{item.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Link href="/announcement">
          <Button size="lg" className="px-12 text-lg">探索更多</Button>
        </Link>
      </div>
    </div>
  );
}