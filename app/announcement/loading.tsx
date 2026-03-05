export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-muted h-12" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 h-12 border-t border-border">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
