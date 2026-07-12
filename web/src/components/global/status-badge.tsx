import { Badge } from "../ui/badge";

type Status = "kritiek" | "laag" | "goed" | "voltooid" | "spoed";

type StatusBadgeProps = {
  status: Status;
};

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  kritiek: { label: "Kritiek", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  laag: { label: "Laag", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
  goed: { label: "Goed", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  voltooid: { label: "Voltooid", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  spoed: { label: "Spoed", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_STYLES[status];

  return <Badge className={className}>{label}</Badge>;
}