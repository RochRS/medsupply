import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { apiClient } from "@/config/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type NurseNotification = {
  id: string;
  type: "ready_for_pickup";
  requestBatchId: number;
  title: string;
  message: string;
  productCount: number;
  totalUnits: number;
  productsSummary: string;
  isUrgent: boolean;
  createdAt: string;
};

const READ_KEY = "medsupply-read-notification-ids";
const POLL_MS = 12_000;

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

function formatWhen(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useNurseNotifications(enabled: boolean) {
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds());

  const query = useQuery({
    queryKey: ["nurse-notifications"],
    queryFn: async () => {
      const res = (await apiClient("/notifications")) as {
        notifications: NurseNotification[];
      };
      return res.notifications ?? [];
    },
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: true,
    enabled,
  });

  const notifications = query.data ?? [];
  const unread = notifications.filter((n) => !readIds.has(n.id));

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const n of notifications) {
        next.add(n.id);
      }
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  return {
    notifications,
    unread,
    unreadCount: unread.length,
    markRead,
    markAllRead,
    isLoading: query.isLoading,
  };
}

type NotificationBellProps = {
  className?: string;
  align?: "left" | "right";
};

export function NotificationBell({
  className,
  align = "right",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unread,
    unreadCount,
    markRead,
    markAllRead,
    isLoading,
  } = useNurseNotifications(true);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} nieuwe melding${unreadCount === 1 ? "" : "en"}`
            : "Meldingen"
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-sky-900 transition-colors",
          "hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
          open && "bg-sky-50",
        )}
      >
        <HugeiconsIcon
          icon={Notification01Icon}
          strokeWidth={2}
          className="size-5"
        />
        {unreadCount > 0 ? (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-rkz-red px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <div>
              <p className="text-sm font-bold text-rkz-navy dark:text-white">
                Meldingen
              </p>
              <p className="text-[11px] text-slate-500">
                Live · ververst elke {POLL_MS / 1000}s
              </p>
            </div>
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={() => markAllRead()}
              >
                Alles gelezen
              </Button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Meldingen laden...
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Geen open meldingen. Je ziet hier een bericht zodra de apotheek
                een aanvraag goedkeurt.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.map((n) => {
                  const isUnread = unread.some((u) => u.id === n.id);
                  return (
                    <li key={n.id}>
                      <Link
                        to="/mijn-aanvragen"
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "block px-4 py-3 transition-colors hover:bg-sky-50/80 dark:hover:bg-slate-900/50",
                          isUnread && "bg-sky-50/60 dark:bg-sky-950/20",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {isUnread ? (
                            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sky-600" />
                          ) : (
                            <HugeiconsIcon
                              icon={Tick02Icon}
                              strokeWidth={2}
                              className="mt-0.5 size-4 shrink-0 text-emerald-600"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-sm font-semibold text-rkz-navy dark:text-white">
                                {n.title}
                              </p>
                              {n.isUrgent ? (
                                <span className="rounded bg-rkz-red px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                                  Spoed
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                              {n.message}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-slate-400">
                              #{n.requestBatchId} · {formatWhen(n.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900/40">
            <Link
              to="/mijn-aanvragen"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300"
            >
              Alle mijn aanvragen →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
