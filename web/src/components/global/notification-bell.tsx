import { useEffect, useState } from "react";
import { apiClient } from "../../config/api";

type InventoryItem = {
  itemId: number;
  itemName: string;
  stockLevel: "kritiek" | "laag" | "goed";
};

type InventoryResponse = {
  items: InventoryItem[];
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);

  useEffect(() => {
    apiClient("/inventory")
      .then((result) => {
        const data = result as InventoryResponse;
        const critical = data.items.filter(
          (item) => item.stockLevel === "kritiek" || item.stockLevel === "laag"
        );
        setAlerts(critical);
      })
      .catch(() => setAlerts([]));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white/80 hover:text-white text-lg leading-none"
        aria-label="Meldingen"
      >
        🔔
        {alerts.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-rkz-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-3 z-50">
          <h4 className="font-bold text-rkz-navy dark:text-white text-sm mb-2">Meldingen</h4>
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-400">Geen nieuwe meldingen</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {alerts.map((item) => (
                <li key={item.itemId} className="text-sm text-gray-700 dark:text-gray-300">
                  <span className={item.stockLevel === "kritiek" ? "text-rkz-red font-medium" : "text-orange-500 font-medium"}>
                    {item.stockLevel === "kritiek" ? "Kritiek" : "Laag"}:
                  </span>{" "}
                  {item.itemName}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}