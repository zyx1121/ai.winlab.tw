"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/supabase/types";
import Image from "next/image";

export function EventCard({
  item,
  isAdmin,
}: {
  item: Event;
  isAdmin?: boolean;
}) {
  const isExternalImage = (src: string | null | undefined) =>
    !!(src && (src.startsWith("http://") || src.startsWith("https://")));

  return (
    <Card className="py-0 h-full flex flex-col gap-4 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
      <div className="relative w-full aspect-video shrink-0">
        <Image
          src={item.cover_image || "/placeholder.png"}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized={isExternalImage(item.cover_image)}
        />
        {isAdmin && item.status === "draft" && (
          <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            草稿
          </div>
        )}
      </div>
      <CardHeader className="shrink-0 pb-0">
        <CardTitle className="text-xl font-bold line-clamp-2">
          {item.name || "(無標題)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-1 pb-4">
        <p className="line-clamp-3 text-muted-foreground text-sm">
          {item.description || "（無描述）"}
        </p>
      </CardContent>
    </Card>
  );
}
