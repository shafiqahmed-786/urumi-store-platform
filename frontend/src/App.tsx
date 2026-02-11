import { useEffect, useState, useCallback } from "react";

import { DashboardHeader } from "./components/dashboard/DashboardHeader";
import { StoreCard } from "./components/dashboard/StoreCard";
import { EmptyState } from "./components/dashboard/EmptyState";
import { ErrorState } from "./components/dashboard/ErrorState";
import { StoreListSkeleton } from "./components/dashboard/StoreListSkeleton";

import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";

import { storeApi } from "./services/api";
import type { Store } from "./types/store";

function App() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storeApi.getStores();
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleCreateStore = async () => {
    try {
      setIsCreating(true);
      const newStore = await storeApi.createStore();
      setStores((prev) => [newStore, ...prev]);

      toast({
        title: "Store created",
        description: `Store ${newStore.id} is provisioning`,
      });
    } catch (err) {
      toast({
        title: "Creation failed",
        description:
          err instanceof Error ? err.message : "Failed to create store",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await storeApi.deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));

      toast({
        title: "Store deleted",
        description: `Store ${id} removed`,
      });
    } catch (err) {
      toast({
        title: "Deletion failed",
        description:
          err instanceof Error ? err.message : "Failed to delete store",
        variant: "destructive",
      });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <DashboardHeader
          onCreateStore={handleCreateStore}
          isCreating={isCreating}
        />

        <div className="mt-8">
          {isLoading ? (
            <StoreListSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchStores} />
          ) : stores.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onDelete={handleDeleteStore}
                  isDeleting={deletingIds.has(store.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Dashboard />
      </main>
    </div>
  );
}

