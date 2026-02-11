import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { StatusBadge } from "./StatusBadge";
import type { Store } from "../../types/store";
import { ExternalLink, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StoreCardProps {
  store: Store;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function StoreCard({ store, onDelete, isDeleting }: StoreCardProps) {
  // ✅ BULLETPROOF DATE HANDLING (do not simplify)
  const created = store.createdAt || store.created_at;

  const formattedTime = created
    ? formatDistanceToNow(new Date(created), { addSuffix: true })
    : "Unknown";

  const isReady = store.status === "Ready";
  const isLocal = window.location.hostname === "localhost";

const storeUrl = isReady
  ? isLocal
    ? `http://${store.id}.localhost`
    : `https://${store.id}.example.com`
  : null;


  return (
    <Card className="border border-slate-200 bg-white transition hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium tracking-tight">{store.id}</CardTitle>
            <CardDescription className="text-xs">
              Created {formattedTime}
            </CardDescription>
          </div>
          <StatusBadge status={store.status} />
        </div>
      </CardHeader>

      <CardContent>
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="text-xs text-slate-500 truncate">
        Namespace: {store.namespace}
      </p>
    </div>

    <div className="flex gap-2 ml-4">
      {/* Open Store */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={!storeUrl}
              onClick={() => storeUrl && window.open(storeUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          {!storeUrl && (
            <TooltipContent>
              <p className="text-xs">
                Store must be ready before opening
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Delete Store */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(store.id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              Delete store and Kubernetes resources
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</CardContent>
    </Card>
  );
}
