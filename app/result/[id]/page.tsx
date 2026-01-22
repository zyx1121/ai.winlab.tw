import { Card } from "@/components/ui/card";

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container max-w-7xl mx-auto p-4 flex flex-col justify-center items-center gap-8 mt-8">
      <h1 className="text-3xl font-bold">成果詳情</h1>
      <Card className="w-full max-w-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">
          成果 #{id} 頁面開發中...
        </p>
      </Card>
    </div>
  );
}