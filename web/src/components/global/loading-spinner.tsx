export function LoadingSpinner({ label = "Laden..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-rkz-teal rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}