import { Button } from "../components/ui/button";
import { FormInput } from "../components/global/form-input";
import { useState } from "react";

export function HospitalIcon() {
  return (
    <div>
      <div>
        <img />
      </div>

      <div>
        <h1>MedSupply</h1>
        <p>Voorraadbeheer Systeem voor Medische Supplies</p>
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
    console.log("Hellow");
  };

  return (
    <Button onClick={sendMessage} disabled={false}>
      Login
    </Button>
  );
}
