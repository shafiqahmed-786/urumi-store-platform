import { Badge } from "../ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type StoreStatus =
  | "Ready"
  | "Provisioning"
  | "Failed"
  | "Queued"
  | string;

interface StatusBadgeProps {
  status: StoreStatus;
}

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    className: string;
    iconClass?: string;
  }
> = {
  Ready: {
    icon: CheckCircle2,
    className:
      "bg-green-50 text-green-700 border border-green-200",
  },
  Provisioning: {
    icon: Loader2,
    className:
      "bg-blue-50 text-blue-700 border border-blue-200",
    iconClass: "animate-spin",
  },
  Queued: {
    icon: Clock,
    className:
      "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  Failed: {
    icon: XCircle,
    className:
      "bg-red-50 text-red-700 border border-red-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    STATUS_CONFIG[status] ?? {
      icon: Clock,
      className:
        "bg-slate-100 text-slate-600 border border-slate-200",
    };

  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${config.iconClass ?? ""}`}
      />
      {status}
    </Badge>
  );
}
