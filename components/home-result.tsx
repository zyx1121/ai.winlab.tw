import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

const resultData = [
  {
    id: 1,
    image: "/placeholder.png",
    title: "｛關係樣本｝影展—《金魚缸小姐》、《二號球衣》",
    date: "2025-08-01",
    description: "中大性別小彩坊此次邀請《二號球衣》、《金魚缸小姐》兩部短片及導演-巫虹儀至中央大學進行映後座談。《金魚缸小姐》直面女同志情慾，突破台灣影視",
  },
  {
    id: 2,
    image: "/placeholder.png",
    title: "跨性別互動講座",
    date: "2025-01-01",
    description: "跨越：自由之身 跨性別互動講座本次的互動講座我們邀請到北市大性／別研究社的社長",
  },
  {
    id: 3,
    image: "/placeholder.png",
    title: "Card Title",
    date: "2025-01-01",
    description: "Card Description",
  },
  {
    id: 4,
    image: "/placeholder.png",
    title: "Card Title",
    date: "2025-01-01",
    description: "Card Description",
  },
  {
    id: 5,
    image: "/placeholder.png",
    title: "Card Title",
    date: "2025-01-01",
    description: "Card Description",
  },
  {
    id: 6,
    image: "/placeholder.png",
    title: "Card Title",
    date: "2025-01-01",
    description: "Card Description",
  },
]

export function HomeResult() {
  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">最新成果</h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {resultData.map((item) => (
          <Link href={`/result/${item.id}`} key={item.id} target="_blank" className="h-full">
            <Card className="py-0 h-full flex flex-col hover:scale-102 transition-all duration-200">
              <div className="relative w-full aspect-video shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover rounded-t-lg" />
              </div>
              <CardHeader className="shrink-0">
                <CardTitle className="text-xl font-bold line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="text-right">{item.date}</CardDescription>
                <Separator />
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3">{item.description}</p>
              </CardContent>
              <CardFooter />
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Link href="/result">
          <Button size="lg" className="px-12 text-lg">探索更多</Button>
        </Link>
      </div>
    </div>
  )
}