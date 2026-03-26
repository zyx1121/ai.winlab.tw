export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center gap-4">
      <h1 className="animate-pulse text-6xl md:text-7xl lg:text-8xl">
        404
      </h1>
      <p className="text-muted-foreground">找不到您要的頁面</p>
    </div>
  );
}
