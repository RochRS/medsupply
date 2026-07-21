import { useState } from "react";
import { FormInput } from "../components/global/form-input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";

export function SpoedAanvraag() {
  const [search, setSearch] = useState("");
  const [afdeling, setAfdeling] = useState("");
  const [noodsituatie, setNoodsituatie] = useState("");

  const handleSubmit = () => {
    console.log({ search, afdeling, noodsituatie });
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-orange-700">Spoedaanvraag</h2>
        <p className="text-xs text-orange-600">Hoogste prioriteit</p>
      </div>

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

      <Button onClick={handleSubmit}>Spoedaanvraag versturen</Button>
    </div>
  );
}

const VOORRAAD_NIVEAUS = [
  { value: "alle-niveaus", label: "Alle voorraadniveaus" },
  { value: "kritiek", label: "Kritiek" },
  { value: "laag", label: "Laag" },
  { value: "goed", label: "Goed" },
];

const CATEGORIEN_NIVEAUS = [
  { value: "alle-categorieen", label: "Alle categorieën" },
  { value: "medicatie", label: "Medicatie" },
  { value: "gassen", label: "Gassen" },
];

//kritiek
export function KritiekeVoorraadOverzicht() {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-bold text-blue-700">Kritiek Voorraadoverzicht</h2>

      <div className="flex gap-3">
        <Select defaultValue="alle-niveaus">
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

        <Select defaultValue="alle-categorieen">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIEN_NIVEAUS.map((categorie) => (
              <SelectItem key={categorie.value} value={categorie.value}>
                {categorie.label}
              </SelectItem>
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
  {value: "nieuwste", label: "Nieuwste eerst"},
  {value: "oudste", label: "Oudste eerst"},
]

export function KritikeMeldingen() {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-blue-700">Meldingen</h2>
        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Type melding</Label>
        <Select defaultValue="alle-meldingen">
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

      <p className="text-sm text-gray-400">Laden...</p>
    </div>
  );
}