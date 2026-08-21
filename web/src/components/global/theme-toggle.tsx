import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-sky-900 transition-colors",
        "hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
        "dark:text-sky-100 dark:hover:bg-slate-800 dark:focus-visible:ring-sky-400/50",
        className,
      )}
      aria-label={isDark ? "Lichte modus inschakelen" : "Donkere modus inschakelen"}
      aria-pressed={isDark}
    >
      <span aria-hidden="true" className="text-xs font-bold">
        {isDark ? "\u2600" : "\u263D"}
      </span>
      <span className="hidden lg:inline">{isDark ? "Licht" : "Donker"}</span>
    </button>
  );
}
