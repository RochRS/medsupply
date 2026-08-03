import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ShoppingBagAddIcon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useState } from "react";
import { FormInput } from "../components/global/form-input";
import { LoadingSpinner } from "../components/global/loading-spinner";
import { StatusBadge } from "../components/global/status-badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { apiClient } from "../config/api";
import { useCart } from "../lib/cart";

type StockLevel = "kritiek" | "laag" | "goed";

type InventoryItem = {
  itemId: number;
  itemName: string;
  description: string | null;
  remainingAmount: number;
  categoryName: string | null;
  stockLevel: "critical" | "low" | "ok" | StockLevel;
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

function toUiStockLevel(level: InventoryItem["stockLevel"]): StockLevel {
  if (level === "critical" || level === "kritiek") return "kritiek";
  if (level === "low" || level === "laag") return "laag";
  return "goed";
}

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
        const result = (await apiClient(`/items${query}`)) as InventoryResponse;
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

export function TotaleVoorraadOverzichtStats({
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border rounded-lg p-4 bg-white text-left"
        >
          <p className="text-xs text-gray-500">{card.label}</p>
          <p className="text-2xl font-semibold">
            {loading ? (
              <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-rkz-teal rounded-full animate-spin" />
            ) : (
              card.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export function TotaleVoorraadSearchbar({
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
      className="rounded-xl"
      icon={
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
      }
    />
  );
}

export function TotaleVoorraadDisplayTable({
  items,
  loading,
  error,
}: {
  items: InventoryItem[];
  loading: boolean;
  error: string;
}) {
  const { addItem } = useCart();

  if (loading) {
    return <p className="text-sm text-gray-500">Voorraad laden...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Geen items gevonden.</p>;
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
            <TableHead className="text-right">Actie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.itemId}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{item.itemName}</span>
                  {item.description ? (
                    <span className="text-xs text-slate-500">
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>{item.categoryName ?? "—"}</TableCell>
              <TableCell>{item.remainingAmount}</TableCell>
              <TableCell>
                <StatusBadge status={toUiStockLevel(item.stockLevel)} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1 rounded-lg"
                  onClick={() =>
                    addItem({
                      itemId: item.itemId,
                      itemName: item.itemName,
                      remainingAmount: item.remainingAmount,
                    })
                  }
                >
                  <HugeiconsIcon
                    icon={ShoppingBagAddIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  Mand
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AddMedicineButton() {
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState("");
  const [categorie, setCategorie] = useState("");
  const [voorraad, setVoorraad] = useState("");
  const [locatie, setLocatie] = useState("");

  const handleSave = () => {
    console.log({ naam, categorie, voorraad, locatie });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-rkz-teal hover:bg-rkz-teal/90 text-white px-4 py-2 rounded-md text-sm font-medium">
        + Nieuw Item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuw item toevoegen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <FormInput
            label="Naam"
            name="naam"
            value={naam}
            onChange={setNaam}
            placeholder="Bijv. Paracetamol 500mg"
          />
          <FormInput
            label="Categorie"
            name="categorie"
            value={categorie}
            onChange={setCategorie}
            placeholder="Bijv. Medicatie, Gassen"
          />
          <FormInput
            label="Voorraad"
            name="voorraad"
            type="number"
            value={voorraad}
            onChange={setVoorraad}
            placeholder="Aantal"
          />
          <FormInput
            label="Locatie"
            name="locatie"
            value={locatie}
            onChange={setLocatie}
            placeholder="Bijv. Apotheek, Centrale voorraad"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-rkz-teal hover:bg-rkz-teal/90"
          >
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Page container that owns search + fetch state
export function TotaleVoorraadPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useInventory(search);
  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <AddMedicineButton />
      </div>

      <InventoryOverviewStats
        summary={data?.summary}
        loading={loading && !data}
      />

      <TotaleVoorraadSearchbar value={search} onChange={setSearch} />

      <InventoryTable items={items} loading={loading && !data} error={error} />
    </div>
  );
}
