import { createFileRoute } from "@tanstack/react-router";

import "../css/index.css";
import { Footer } from "../components/footer";

export const Route = createFileRoute("/statistieken")({
  component: RouteComponent,
});
//#########################################################################
//Local Components
//#########################################################################

function BelangrijkeStatistieken() {
  return <div></div>;
}

function VoorraadStatusVerdeling() {
  return <div></div>;
}

function CategorieVerdeling() {
  return <div></div>;
}

function HuidigeVoorraadNiveauPerItem() {
  return <div></div>;
}

function DagelijksVerbruikPerItem() {
  return <div></div>;
}

function MaandelijkseVerbruikPerItem() {
  return <div></div>;
}

function JaarlijkseVerbruikPerItem() {
  return <div></div>;
}

function GemiddeldOpslagTijdPerItem() {
  return <div></div>;
}

//#########################################################################
//Page
//#########################################################################

function RouteComponent() {
  return (
    <div>
      <div className="text-center">
        <div>
          <h1>Analyse & Statistieken</h1>
          <p>
            Gedetailleerde analyse en statistieken van voorraadgebruik en trends
          </p>
        </div>

        <div>
          <BelangrijkeStatistieken />
        </div>

        <div>
          <div>
            <VoorraadStatusVerdeling />
          </div>
          <div>
            <CategorieVerdeling />
          </div>
        </div>

        <div>
          <HuidigeVoorraadNiveauPerItem />
        </div>

        <div>
          <DagelijksVerbruikPerItem />
        </div>

        <div>
          <MaandelijkseVerbruikPerItem />
        </div>

        <div>
          <JaarlijkseVerbruikPerItem />
        </div>

        <div>
          <GemiddeldOpslagTijdPerItem />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
