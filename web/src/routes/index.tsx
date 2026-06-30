//Libs
import { createFileRoute } from "@tanstack/react-router";
import { EnterButton } from "../components/button.tsx";
import { FormInput } from "../components/form.tsx";

// ------------------------------------------
//Styling
import "../css/index.css";

// ------------------------------------------
//Route
export const Route = createFileRoute("/")({
  component: Index,
});

// ------------------------------------------
//Types

// ------------------------------------------
//Local Components
function HospitalIcon() {
  return <div>Profile Picture</div>;
}

function Index() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      <div>
        <div>
          <HospitalIcon />
        </div>

        <div>
          <FormInput
            label="Form Input"
            type="text"
            placeholder="John Doe"
            value="userInput"
            // onChange={}
          />
        </div>

        <div>
          <EnterButton buttonName="Hello" />
        </div>
      </div>
    </div>
  );
}
