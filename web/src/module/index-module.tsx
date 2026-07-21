import { Button } from "../components/ui/button";
import { FormInput } from "../components/global/form-input";
import { useState } from "react";
import logo from "../assets/rkz-whitebg.jpeg";

export function HospitalIcon() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="bg-indigo-800 rounded-2xl p-4">
        <img src={logo} alt="RKZ Logo" className="w-12 h-12" />
      </div>

      <div>
        <h1 className="text-white text-2xl font-bold">MedSupply</h1>
        <p className="text-slate-200 text-sm">Voorraadbeheer Systeem voor Medische Supplies</p>
      </div>
    </div>
  );
}

export function UserInputFields() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <FormInput label="Email" name="email" type="email" placeholder="jouw@rkz.com" value={email} onChange={setEmail} />
      <FormInput label="Wachtwoord" name="password" type="password" placeholder="" value={password} onChange={setPassword} />
    </div>
  );
}

export function SubmitLoginRequestButton() {
  const sendMessage = () => {
    console.log("Hello");
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <Button onClick={sendMessage} disabled={false}>Login</Button>
      <p className="text-sm text-red-500 text-center">
        Let op: Alleen medewerkers met een geldig ziekenhuis e-mailadres kunnen inloggen.
      </p>
    </div>

    

    
  );
}
