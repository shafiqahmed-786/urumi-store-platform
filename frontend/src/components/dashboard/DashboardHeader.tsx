import { Button } from "../ui/button";
import { Plus, Loader2 } from "lucide-react";

interface DashboardHeaderProps {
  onCreateStore: () => void;
  isCreating: boolean;
}

export function DashboardHeader({
  onCreateStore,
  isCreating,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Store Provisioning
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Create, monitor, and manage isolated store environments powered by
          Kubernetes.
        </p>
      </div>

      <Button
        onClick={onCreateStore}
        disabled={isCreating}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating store…
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create store
          </>
        )}
      </Button>
    </div>
  );
}
