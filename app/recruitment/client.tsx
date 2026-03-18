"use client";

import { RecruitmentCard } from "@/components/recruitment-card";
import { RecruitmentDialog } from "@/components/recruitment-dialog";
import { Button } from "@/components/ui/button";
import type { Recruitment } from "@/lib/supabase/types";
import { Plus } from "lucide-react";
import { useState } from "react";

export function RecruitmentPageClient({
  recruitments,
  isAdmin,
}: {
  recruitments: Recruitment[];
  isAdmin: boolean;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null);

  const openCreateSheet = () => {
    setEditingRecruitment(null);
    setSheetOpen(true);
  };

  const openEditSheet = (recruitment: Recruitment) => {
    setEditingRecruitment(recruitment);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">企業徵才</h1>
        {isAdmin && (
          <Button variant="secondary" onClick={openCreateSheet}>
            <Plus className="w-4 h-4" />
            新增
          </Button>
        )}
      </div>

      {recruitments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">目前沒有企業徵才資訊</div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {recruitments.map((item) => (
            <RecruitmentCard
              key={item.id}
              item={item}
              href={`/recruitment/${item.id}`}
              onEdit={isAdmin ? () => openEditSheet(item) : undefined}
            />
          ))}
        </div>
      )}

      <RecruitmentDialog
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        recruitment={editingRecruitment}
        eventId={null}
      />
    </>
  );
}
