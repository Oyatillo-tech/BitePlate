export default function Loading() {
  return (
    <div className="page flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <p className="text-sm text-secondary">Loading...</p>
      </div>
    </div>
  );
}
