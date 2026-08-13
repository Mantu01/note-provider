import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import type { StatusType } from "@/lib/types";

type StatusBadgeProps = {
  type: StatusType;
  value?: string;
  status?: string;
  className?: string;
};

export function StatusBadge({ type, value, status, className }: StatusBadgeProps) {
  const targetValue = (value ?? status ?? "").toString();
  const config = STATUS_CONFIG[type]?.[targetValue] ?? {
    label: targetValue || "Unknown",
    className: "border-border bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={`${config.className} ${className ?? ""}`}>
      {config.label}
    </Badge>
  );
}
