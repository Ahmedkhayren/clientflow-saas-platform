export function WorkspaceContentSkeleton() {
  return (
    <div className="min-h-[calc(100vh-104px)] space-y-6" role="status" aria-live="polite" aria-label="Loading workspace content">
      <span className="sr-only">Loading workspace content</span>
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-24 rounded-full bg-[#DDE5D8]" />
        <div className="h-8 w-52 max-w-full rounded-lg bg-[#E3E5DF]" />
        <div className="h-4 w-full max-w-md rounded-full bg-[#EEF2EA]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="animate-pulse rounded-xl border border-[#E3E5DF] bg-white p-5 shadow-soft">
            <div className="size-9 rounded-lg bg-[#EEF2EA]" />
            <div className="mt-5 h-7 w-12 rounded-md bg-[#E3E5DF]" />
            <div className="mt-2 h-3 w-24 rounded-full bg-[#EEF2EA]" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <div className="animate-pulse rounded-xl border border-[#E3E5DF] bg-white p-5 shadow-soft">
          <div className="h-4 w-32 rounded-full bg-[#E3E5DF]" />
          <div className="mt-2 h-3 w-52 rounded-full bg-[#EEF2EA]" />
          <div className="mt-6 grid h-52 grid-cols-6 items-end gap-3">
            {[45, 70, 58, 86, 63, 92].map((height) => <span key={height} className="rounded-t-md bg-[#EEF2EA]" style={{ height: `${height}%` }} />)}
          </div>
        </div>
        <div className="animate-pulse rounded-xl border border-[#E3E5DF] bg-white p-5 shadow-soft">
          <div className="h-4 w-36 rounded-full bg-[#E3E5DF]" />
          <div className="mt-5 space-y-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3"><span className="size-9 rounded-lg bg-[#EEF2EA]" /><span className="h-3 flex-1 rounded-full bg-[#EEF2EA]" /></div>)}</div>
        </div>
      </div>
    </div>
  );
}
