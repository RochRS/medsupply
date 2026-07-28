import { useState } from "react";
import { FormInput } from "../components/global/form-input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { useAllItems } from "../hooks/use-items";
import { useCreateRequest } from "../hooks/use-requests";

export function NormaleAanvraagSelectors() {
  const [supplyType, setSupplyType] = useState("");
  const { data, isLoading } = useAllItems(supplyType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Zoek en/of select supply type"
        name="supplyType"
        value={supplyType}
        onChange={setSupplyType}
        placeholder="Voer supply type in"
      />
      <div className="flex flex-col gap-1.5">
        <Label>Selecteer supply</Label>
        {isLoading ? (
          <p className="text-sm text-gray-400">Laden...</p>
        ) : (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Kies een item" />
            </SelectTrigger>
            <SelectContent>
              {data?.items.map((item) => (
                <SelectItem key={item.itemId} value={String(item.itemId)}>
                  {item.itemName} ({item.remainingAmount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

const URGENTIE_OPTIES = [
  { value: "normaal", label: "Normaal (binnen 3-5 dagen)" },
  { value: "verhoogd", label: "Verhoogd (binnen 1-2 dagen)" },
  { value: "hoog", label: "Hoog (binnen 24 uur)" },
];

export function NormaleAanvraagUrgentieSelector() {
  const [urgentie, setUrgentie] = useState("normaal");

  return (
    <div className="flex flex-col gap-2">
      <Label>Urgentie</Label>
      <RadioGroup value={urgentie} onValueChange={setUrgentie}>
        {URGENTIE_OPTIES.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export function OpmerkingenTextArea() {
  const [opmerking, setOpmerking] = useState("");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="opmerking">Opmerkingen (optioneel)</Label>
      <Textarea
        id="opmerking"
        value={opmerking}
        onChange={(e) => setOpmerking(e.target.value)}
        placeholder="Waarom is deze voorraad nodig?"
      />
    </div>
  );
}

export function NormaleAanvraagFormulier() {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [aantal, setAantal] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [supplyType, setSupplyType] = useState("");
  const { data, isLoading } = useAllItems(supplyType);
  const createRequest = useCreateRequest();

  const handleVersturen = () => {
    if (!selectedItemId || !aantal) return;
    createRequest.mutate({
      itemId: Number(selectedItemId),
      requestedAmount: Number(aantal),
      requestDescriptionField: opmerking || null,
    });
  };

  return (
    <div className="bg-white border rounded-lg p-6 flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h2 className="font-bold text-lg">Normale aanvraag</h2>
        <p className="text-sm text-gray-500">Voor reguliere voorraadaanvragen zonder spoed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Zoek supply"
          name="supplyType"
          value={supplyType}
          onChange={setSupplyType}
          placeholder="Voer supply type in"
        />
        <div className="flex flex-col gap-1.5">
          <Label>Selecteer item</Label>
          {isLoading ? (
            <p className="text-sm text-gray-400">Laden...</p>
          ) : (
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Kies een item" />
              </SelectTrigger>
              <SelectContent>
                {data?.items.map((item) => (
                  <SelectItem key={item.itemId} value={String(item.itemId)}>
                    {item.itemName} ({item.remainingAmount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <FormInput
          label="Aantal"
          name="aantal"
          type="number"
          value={aantal}
          onChange={setAantal}
          placeholder="Voer aantal in"
        />
      </div>

      <NormaleAanvraagUrgentieSelector />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="opmerking">Opmerkingen (optioneel)</Label>
        <Textarea
          id="opmerking"
          value={opmerking}
          onChange={(e) => setOpmerking(e.target.value)}
          placeholder="Waarom is deze voorraad nodig?"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label>Gebruikers Info</Label>
        <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-600">
          Rol: &nbsp;&nbsp;Afdeling: aangeven
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleVersturen} disabled={createRequest.isPending}>
          {createRequest.isPending ? "Bezig..." : "Aanvraag versturen"}
        </Button>
        <Button onClick={() => { setSelectedItemId(""); setAantal(""); setOpmerking(""); }} variant="destructive">
          Wissen
        </Button>
      </div>

      {createRequest.isSuccess && (
        <p className="text-sm text-green-600">Aanvraag verstuurd!</p>
      )}
      {createRequest.isError && (
        <p className="text-sm text-red-600">Versturen mislukt.</p>
      )}
    </div>
  );
}