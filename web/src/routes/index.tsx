import { createFileRoute } from "@tanstack/react-router";

import { EnterButton } from "../components/button.tsx";
import { FormInput } from "../components/form.tsx";
import { Footer } from "../components/footer.tsx";

// ------------------------------------------
//Styling
import "../css/index.css";

// ------------------------------------------
//Route
export const Route = createFileRoute("/")({
  component: Index,
});

//#########################################################################
//Local Components
//#########################################################################
function HospitalIcon() {
  return (
    <div>
      <div>
        <image
        // src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Hospital_icon.svg/1200px-Hospital_icon.svg.png"
        // alt="Hospital Icon"
        // width="100"
        // height="100"
        />
      </div>

      <div>
        <h1>MedSupply</h1>
        <p>Voorraadbeheer Systeem voor Medische Supplies</p>
      </div>
    </div>
  );
}

function UserInputFields() {
  return (
    <div>
      <FormInput label="Test" type="text" placeholder="test" value="a" />
      <FormInput label="Test" type="text" placeholder="test" value="a" />
    </div>
  );
}

function SubmitLoginRequestButton() {
  const sendMessage = () => {
    console.log("Hellow");
  };

  return (
    <EnterButton buttonName="Login" onClick={sendMessage} isDisabled={false} />
  );
}

//#########################################################################
//Page
//#########################################################################
function Index() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4 max-w-sm dark:bg-slate-800 p-6 rounded-lg text-center size-80">
          <div className="text-red-900">
            <HospitalIcon />
          </div>

          <div>
            <UserInputFields />
          </div>

          <div className="text-blue-600 ">
            <SubmitLoginRequestButton />
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
