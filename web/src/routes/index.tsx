//Libs
import { createFileRoute } from "@tanstack/react-router";
import { EnterButton } from "../components/button.tsx";
import { FormInput } from "../components/form.tsx";

// ------------------------------------------
//Styling
import "../css/index.css";
import { Footer } from "../components/footer.tsx";

// ------------------------------------------
//Route
export const Route = createFileRoute("/")({
  component: Index,
});

// ------------------------------------------
//Types

//#########################################################################
//Local Components
//#########################################################################
function HospitalIcon() {
  return <div>Profile Picture</div>;
}

function UserInputFields() {
  return (
    <div>
      <FormInput label="Test" type="text" placeholder="test" value="a" />
      <FormInput label="Test" type="text" placeholder="test" value="a" />
    </div>
  );
}

function SendLoginRequest() {
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
            <SendLoginRequest />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
