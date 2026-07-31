import { useEffect, useState } from "react";
import { StatusBadge } from "../components/global/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { apiClient } from "../config/api";

type HistoryActivity = {
  id: string;
  type: "aanvraag" | "levering";
  itemName: string | null;
  amount: number;
  isUrgent: boolean | null;
  isCompleted: boolean | null;
  supplierName: string | null;
  createdAt: string | null;
  status: string;
};

type HistoryResponse = {
  activities: HistoryActivity[];
  summary: {
    total: number;
    aanvragen: number;
    leveringen: number;
  };
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function statusForBadge(
  status: string,
): "kritiek" | "laag" | "goed" | "voltooid" | "spoed" {
  if (status === "spoed") return "spoed";
  if (status === "voltooid") return "voltooid";
  if (status === "open") return "laag";
  return "goed";
}

export function HistoryDisplay() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "aanvraag" | "levering">("all");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const query = filter === "all" ? "" : `?type=${filter}`;
        const result = (await apiClient(`/history${query}`)) as HistoryResponse;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Geschiedenis kon niet worden geladen.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4">
          <p className="text-xs text-gray-500">Totaal</p>
          <p className="text-xl font-semibold">{data?.summary.total ?? "—"}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4">
          <p className="text-xs text-gray-500">Aanvragen</p>
          <p className="text-xl font-semibold">
            {data?.summary.aanvragen ?? "—"}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4">
          <p className="text-xs text-gray-500">Leveringen</p>
          <p className="text-xl font-semibold">
            {data?.summary.leveringen ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["all", "Alles"],
            ["aanvraag", "Aanvragen"],
            ["levering", "Leveringen"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-sm border rounded-md ${
              filter === value
                ? "bg-rkz-teal text-white border-rkz-teal"
                : "bg-white  text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-gray-500">Geschiedenis laden...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (data?.activities.length ?? 0) === 0 && (
        <p className="text-sm text-gray-500">Nog geen activiteiten.</p>
      )}

      {!loading && !error && data && data.activities.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Aantal / kost</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.createdAt)}</TableCell>
                  <TableCell className="capitalize">{activity.type}</TableCell>
                  <TableCell>{activity.itemName ?? "—"}</TableCell>
                  <TableCell>{activity.amount}</TableCell>
                  <TableCell>
                    {activity.type === "levering"
                      ? activity.supplierName ?? "—"
                      : activity.isUrgent
                        ? "Spoedaanvraag"
                        : "Reguliere aanvraag"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statusForBadge(activity.status)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
