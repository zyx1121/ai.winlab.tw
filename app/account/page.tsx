"use client";

import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user) {
      router.replace(`/profile/${user.id}`);
    }
  }, [isLoading, user, router]);

  return (
    <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
}
