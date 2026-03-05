export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8 animate-pulse">
      <div className="h-9 w-24 rounded-lg bg-muted" />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden flex flex-col">
            <div className="aspect-video bg-muted" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
