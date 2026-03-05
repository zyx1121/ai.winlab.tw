export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8 animate-pulse">
      <div className="h-10 w-2/3 rounded-lg bg-muted" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 rounded bg-muted ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
