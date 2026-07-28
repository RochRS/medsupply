import { useState } from "react";
import { FormInput } from "../components/global/form-input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { StatusBadge } from "../components/global/status-badge";
import { useUrgentItems, useCriticalItems, useLowStockItems } from "../hooks/use-items";
import { useSendUrgentRequest } from "../hooks/use-requests";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export function SpoedAanvraag() {
  const [itemId, setItemId] = useState("");
  const [afdeling, setAfdeling] = useState("");
  const [noodsituatie, setNoodsituatie] = useState("");
  const { data: urgentItems, isLoading } = useUrgentItems();
  const sendUrgent = useSendUrgentRequest();

  const handleSubmit = () => {
    if (!itemId) return;
    sendUrgent.mutate({
      itemId: Number(itemId),
      requestedAmount: 1,
      requestDescriptionField: noodsituatie || null,
    });
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-orange-700">Spoedaanvraag</h2>
        <p className="text-xs text-orange-600">Hoogste prioriteit</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Laden...</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label>Selecteer item met spoed</Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger>
              <SelectValue placeholder="Kies een item" />
            </SelectTrigger>
            <SelectContent>
              {urgentItems?.map((item) => (
                <SelectItem key={item.itemId} value={String(item.itemId)}>
                  {item.itemName} ({item.remainingAmount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <FormInput
        label="Afdeling"
        name="afdeling"
        value={afdeling}
        onChange={setAfdeling}
        placeholder="Bijv. SEH, Cardiologie"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="noodsituatie">Noodsituatie</Label>
        <Textarea
          id="noodsituatie"
          value={noodsituatie}
          onChange={(e) => setNoodsituatie(e.target.value)}
          placeholder="Beschrijf kort de noodsituatie"
        />
      </div>

      <Button onClick={handleSubmit} disabled={sendUrgent.isPending}>
        {sendUrgent.isPending ? "Bezig..." : "Spoedaanvraag versturen"}
      </Button>

      {sendUrgent.isSuccess && (
        <p className="text-sm text-green-600">Spoedaanvraag verstuurd!</p>
      )}
      {sendUrgent.isError && (
        <p className="text-sm text-red-600">Versturen mislukt.</p>
      )}
    </div>
  );
}

const VOORRAAD_NIVEAUS = [
  { value: "alle-niveaus", label: "Alle voorraadniveaus" },
  { value: "kritiek", label: "Kritiek" },
  { value: "laag", label: "Laag" },
  { value: "goed", label: "Goed" },
];

export function KritiekeVoorraadOverzicht() {
  const [niveauFilter, setNiveauFilter] = useState("alle-niveaus");
  const { data: criticalItems, isLoading: criticalLoading } = useCriticalItems();
  const { data: lowStockItems, isLoading: lowLoading } = useLowStockItems();

  const items =
    niveauFilter === "kritiek" ? criticalItems
    : niveauFilter === "laag" ? lowStockItems
    : [...(criticalItems ?? []), ...(lowStockItems ?? [])];

  const loading = criticalLoading || lowLoading;

  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-blue-700">Kritiek Voorraadoverzicht</h2>

      <div className="flex gap-3">
        <Select value={niveauFilter} onValueChange={setNiveauFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOORRAAD_NIVEAUS.map((niveau) => (
              <SelectItem key={niveau.value} value={niveau.value}>
                {niveau.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Laden...</p>
      ) : items && items.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.itemId} className="flex justify-between items-center border-b pb-1">
              <span className="text-sm">{item.itemName}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.remainingAmount}</span>
                <StatusBadge status={item.stockLevel === "critical" ? "kritiek" : "laag"} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Geen items met kritieke voorraad.</p>
      )}
    </div>
  );
}

const MELDING_TYPES = [
  { value: "alle-meldingen", label: "Alle meldingen" },
  { value: "waarschuwing", label: "Waarschuwing" },
  { value: "update", label: "Voorraad update" },
];

const SORTEER_OPTIES = [
  { value: "nieuwste", label: "Nieuwste eerst" },
  { value: "oudste", label: "Oudste eerst" },
];

export function KritikeMeldingen() {
  const [typeFilter, setTypeFilter] = useState("alle-meldingen");
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const data = await apiFetch("/history?limit=10");
      return data.activities ?? [];
    },
  });

  const badgeCount = activities?.filter((a: { isUrgent?: boolean | null }) => a.isUrgent).length ?? 0;

  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-blue-700">Meldingen</h2>
        {badgeCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Type melding</Label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MELDING_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Sorteren</Label>
        <Select defaultValue="nieuwste">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTEER_OPTIES.map((optie) => (
              <SelectItem key={optie.value} value={optie.value}>
                {optie.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Laden...</p>
      ) : activities && activities.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {activities.slice(0, 5).map((a: { id: string; itemName?: string | null; type: string; isUrgent?: boolean | null; status: string }) => (
            <div key={a.id} className="flex justify-between items-center border-b pb-1 text-sm">
              <span>{a.itemName ?? "Onbekend"}</span>
              <StatusBadge
                status={
                  a.isUrgent ? "spoed"
                  : a.status === "completed" ? "voltooid"
                  : a.status === "urgent" ? "spoed"
                  : "laag"
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Geen meldingen.</p>
      )}
    </div>
  );
}