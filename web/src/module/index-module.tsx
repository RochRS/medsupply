import { EnterButton } from "../components/button.tsx";
import { FormInput } from "../components/form.tsx";

export function HospitalIcon() {
  return (
    <div>
      <div>
        <image />
      </div>

      <div>
        <h1>MedSupply</h1>
        <p>Voorraadbeheer Systeem voor Medische Supplies</p>
      </div>
    </div>
  );
}

export function UserInputFields() {
  return (
    <div>
      <FormInput label="Test" type="text" placeholder="test" value="a" />
      <FormInput label="Test" type="text" placeholder="test" value="a" />
    </div>
  );
}

export function SubmitLoginRequestButton() {
  const sendMessage = () => {
    console.log("Hellow");
  };

  return (
    <EnterButton buttonName="Login" onClick={sendMessage} isDisabled={false} />
  );
}
