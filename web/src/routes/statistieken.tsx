import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../components/global/footer.tsx";

import {
  BelangrijkeStatistieken,
  VoorraadStatusVerdeling,
  CategorieVerdeling,
  HuidigeVoorraadNiveauPerItem,
  DagelijksVerbruikPerItem,
  MaandelijkseVerbruikPerItem,
  JaarlijkseVerbruikPerItem,
  GemiddeldOpslagTijdPerItem,
} from "../module/statistieken-module.tsx";

import "../css/statistieken.css";

export const Route = createFileRoute("/statistieken")({
  component: RouteComponent,
});

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
