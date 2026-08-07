export default function AssistantLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex h-[calc(100dvh-10rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white sm:h-[calc(100vh-8rem)] dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="h-5 w-5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          <div className="h-16 w-2/3 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
          <div className="ml-auto h-12 w-1/2 animate-pulse rounded-xl bg-orange-100 dark:bg-orange-900/40" />
        </div>
      </div>
    </div>
  );
}