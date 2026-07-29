type ChartPlaceholderProps = {
  title: string;
  height?: string;
};

function ChartPlaceholder({ title, height = "h-64" }: ChartPlaceholderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3">
      <h3 className="font-bold text-rkz-navy">{title}</h3>
      <div className={`${height} border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center`}>
        <p className="text-sm text-slate-400">Grafiek komt hier</p>
      </div>
    </div>
  );
}

export function KeyStatistics() {
  const stats = [
    { label: "Gemiddeld dagelijks gebruik", value: "—" },
    { label: "Gemiddelde opslagtijd", value: "—" },
    { label: "Meest gebruikte categorie", value: "—" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-4 text-left">
          <p className="text-xs text-gray-500">{stat.label}</p>
          <p className="text-2xl font-bold text-rkz-navy">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export function StockStatusDistribution() {
  return <ChartPlaceholder title="Voorraad status verdeling" />;
}

export function CategoryDistribution() {
  return <ChartPlaceholder title="Categorie verdeling" />;
}

export function CurrentStockLevelsPerItem() {
  return <ChartPlaceholder title="Huidige voorraadniveaus (per item)" />;
}

export function DailyUsagePerItem() {
  return <ChartPlaceholder title="Dagelijks gebruik (laatste week)" />;
}

export function MonthlyUsagePerItem() {
  return <ChartPlaceholder title="Maandelijks gebruik (2025)" />;
}

export function YearlyUsagePerItem() {
  return <ChartPlaceholder title="Jaarlijkse vergelijking" />;
}

export function AverageStorageTimePerItem() {
  return <ChartPlaceholder title="Tijd in opslag (gemiddeld per item)" />;
}