import { useState } from "react";
import { FormInput } from "../components/global/form-input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";

type RequestFieldsProps = {
  supplyType: string;
  naam: string;
  aantal: string;
  afdeling: string;
  onSupplyTypeChange: (v: string) => void;
  onNaamChange: (v: string) => void;
  onAantalChange: (v: string) => void;
  onAfdelingChange: (v: string) => void;
};

export function RequestFields({
  supplyType,
  naam,
  aantal,
  afdeling,
  onSupplyTypeChange,
  onNaamChange,
  onAantalChange,
  onAfdelingChange,
}: RequestFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Zoek en/of select supply type"
        name="supplyType"
        value={supplyType}
        onChange={onSupplyTypeChange}
        placeholder="Voer supply type in"
      />
      <FormInput
        label="Naam van supplies"
        name="naam"
        value={naam}
        onChange={onNaamChange}
        placeholder="Voer/zoek op supply naam"
      />
      <FormInput
        label="Aantal"
        name="aantal"
        type="number"
        value={aantal}
        onChange={onAantalChange}
        placeholder="Voer aantal in"
      />
      <FormInput
        label="Afdeling"
        name="afdeling"
        value={afdeling}
        onChange={onAfdelingChange}
        placeholder="Voer afdelingsnaam in"
      />
    </div>
  );
}

const URGENTIE_OPTIES = [
  { value: "normaal", label: "Normaal (binnen 3-5 dagen)" },
  { value: "verhoogd", label: "Verhoogd (binnen 1-2 dagen)" },
  { value: "hoog", label: "Hoog (binnen 24 uur)" },
];

type UrgencySelectorProps = {
  urgentie: string;
  onChange: (v: string) => void;
};

export function UrgencySelector({ urgentie, onChange }: UrgencySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Urgentie</Label>
      <RadioGroup value={urgentie} onValueChange={onChange}>
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

type CommentsTextAreaProps = {
  opmerking: string;
  onChange: (v: string) => void;
};

export function CommentsTextArea({ opmerking, onChange }: CommentsTextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="opmerking">Opmerkingen (optioneel)</Label>
      <Textarea
        id="opmerking"
        value={opmerking}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Waarom is deze voorraad nodig?"
      />
    </div>
  );
}

export function RequestForm() {
  const [supplyType, setSupplyType] = useState("");
  const [naam, setNaam] = useState("");
  const [aantal, setAantal] = useState("");
  const [afdeling, setAfdeling] = useState("");
  const [urgentie, setUrgentie] = useState("normaal");
  const [opmerking, setOpmerking] = useState("");

  const fillDemoData = () => {
    setSupplyType("Medicatie");
    setNaam("Paracetamol 500mg");
    setAantal("50");
    setAfdeling("SEH");
    setUrgentie("verhoogd");
    setOpmerking("Voorraad bijna op, voor demo-doeleinden ingevuld.");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-10 flex flex-col gap-6 max-w-7xl w-full mx-auto">
      <RequestFields
        supplyType={supplyType}
        naam={naam}
        aantal={aantal}
        afdeling={afdeling}
        onSupplyTypeChange={setSupplyType}
        onNaamChange={setNaam}
        onAantalChange={setAantal}
        onAfdelingChange={setAfdeling}
      />
      <UrgencySelector urgentie={urgentie} onChange={setUrgentie} />
      <CommentsTextArea opmerking={opmerking} onChange={setOpmerking} />

      <button
        onClick={fillDemoData}
        type="button"
        className="text-xs text-slate-400 hover:text-slate-600 underline self-start"
      >
        Vul demo-gegevens in
      </button>

      <RequestFormButtons />
    </div>
  );
}

export function RequestFormButtons() {
  const handleVersturen = () => {
    console.log("Aanvraag versturen clicked");
  };

  const handleWissen = () => {
    console.log("Wissen clicked");
  };

  return (
    <div className="flex gap-3">
      <Button onClick={handleVersturen} className="bg-rkz-teal hover:bg-rkz-teal/90">
        Aanvraag versturen
      </Button>
      <Button onClick={handleWissen} variant="destructive">Wissen</Button>
    </div>
  );
}