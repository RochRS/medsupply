import { useEffect, useMemo, useState } from "react";
import { FormInput } from "../components/global/form-input";
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

type StockLevel = "kritiek" | "laag" | "goed";

type InventoryItem = {
  itemId: number;
  itemName: string;
  description: string | null;
  remainingAmount: number;
  categoryName: string | null;
  stockLevel: StockLevel;
};

type InventorySummary = {
  totalItems: number;
  totalStock: number;
  criticalStock: number;
  lowStock: number;
};

type InventoryResponse = {
  items: InventoryItem[];
  summary: InventorySummary;
};

// Load inventory from the API (shared by stats + table)
function useInventory(search: string) {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const query = search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : "";
        const result = (await apiClient(`/inventory${query}`)) as InventoryResponse;
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Voorraad kon niet worden geladen.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return { data, loading, error };
}

export function InventoryOverviewStats({
  summary,
  loading,
}: {
  summary?: InventorySummary;
  loading: boolean;
}) {
  const cards = [
    { label: "Totaal items", value: summary?.totalItems ?? "—" },
    { label: "Totale voorraad", value: summary?.totalStock ?? "—" },
    { label: "Kritiek", value: summary?.criticalStock ?? "—" },
    { label: "Laag", value: summary?.lowStock ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border rounded-lg p-4 bg-white text-left"
        >
          <p className="text-xs text-gray-500">{card.label}</p>
          <p className="text-2xl font-semibold">
            {loading ? "..." : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function InventorySearchbar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormInput
      label="Zoeken"
      name="inventory-search"
      value={value}
      onChange={onChange}
      placeholder="Zoek op naam of categorie"
    />
  );
}

export function InventoryTable({
  items,
  loading,
  error,
}: {
  items: InventoryItem[];
  loading: boolean;
  error: string;
}) {
  if (loading) {
    return <p className="text-sm text-gray-500">Voorraad laden...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Geen items gevonden.</p>;
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead>Voorraad</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.itemId}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{item.itemName}</span>
                  {item.description && (
                    <span className="text-gray-500 text-xs">
                      {item.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.categoryName ?? "—"}</TableCell>
              <TableCell>{item.remainingAmount}</TableCell>
              <TableCell>
                <StatusBadge status={item.stockLevel} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Page container that owns search + fetch state
export function InventoryPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useInventory(search);

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-teal-800">Totale Voorraad</h1>
        <p className="text-sm text-gray-500">
          Overzicht van de totale voorraad in het magazijn.
        </p>
      </div>

      <InventoryOverviewStats 
        summary={data?.summary}
        loading={loading && !data}
      />

      <InventorySearchbar value={search} onChange={setSearch} />

      <InventoryTable
        items={items}
        loading={loading && !data}
        error={error}
      />
    </div>
  );
}
