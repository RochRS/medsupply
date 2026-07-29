import { useState } from "react";
import { FormInput } from "../components/global/form-input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../components/ui/select";

export function EmergencyRequest() {
  const [search, setSearch] = useState("");
  const [afdeling, setAfdeling] = useState("");
  const [noodsituatie, setNoodsituatie] = useState("");

  const handleSubmit = () => {
    console.log({ search, afdeling, noodsituatie });
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-t-4 border-t-rkz-red p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-rkz-red">Spoedaanvraag</h2>
        <span className="bg-rkz-red text-white text-[10px] font-bold px-2 py-0.5 rounded">SPOED</span>
      </div>
      <p className="text-xs text-gray-500 -mt-2">Hoogste prioriteit</p>

      <FormInput
        label="Zoek supplies"
        name="search"
        value={search}
        onChange={setSearch}
        placeholder="Zoek op naam of categorie"
      />

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

      <Button onClick={handleSubmit} className="bg-rkz-red hover:bg-rkz-red/90">
        Spoedaanvraag versturen
      </Button>
    </div>
  );
}

const VOORRAAD_NIVEAUS = [
  { value: "alle-niveaus", label: "Alle voorraadniveaus" },
  { value: "kritiek", label: "Kritiek" },
  { value: "laag", label: "Laag" },
  { value: "goed", label: "Goed" },
];

const CATEGORIEEN = [
  { value: "alle-categorieen", label: "Alle categorieën" },
  { value: "medicatie", label: "Medicatie" },
  { value: "gassen", label: "Gassen" },
];

export function CriticalInventoryOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3">
      <h2 className="font-bold text-rkz-navy">Kritiek Voorraadoverzicht</h2>

      <div className="flex gap-3">
        <Select items={VOORRAAD_NIVEAUS} defaultValue="alle-niveaus">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOORRAAD_NIVEAUS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={CATEGORIEEN} defaultValue="alle-categorieen">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIEEN.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-gray-400">Laden...</p>
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

export function Notifications() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-rkz-navy">Meldingen</h2>
        <span className="bg-rkz-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Type melding</Label>
        <Select items={MELDING_TYPES} defaultValue="alle-meldingen">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MELDING_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Sorteren</Label>
        <Select items={SORTEER_OPTIES} defaultValue="nieuwste">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTEER_OPTIES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">✓</div>
        <p className="text-sm text-gray-400">Geen nieuwe meldingen</p>
      </div>
    </div>
  );
}