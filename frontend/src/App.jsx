import { useEffect, useState, useCallback } from "react";
import { DashboardHeader } from "./components/dashboard/DashboardHeader";
import { StoreCard } from "./components/dashboard/StoreCard";
import { EmptyState } from "./components/dashboard/EmptyState";
import { ErrorState } from "./components/dashboard/ErrorState";
import { StoreListSkeleton } from "./components/dashboard/StoreListSkeleton";
import { Toaster } from "./components/ui/toaster";
import { storeApi } from "./services/api";
import { useToast } from "./components/ui/use-toast";

function App() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storeApi.getStores();
      setStores(data);
    } catch (err) {
      setError("Failed to load stores");
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
        description: `${newStore.id} is provisioning`,
      });
    } catch {
      toast({
        title: "Creation failed",
        description: "Unable to create store",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await storeApi.deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Store deleted",
        description: `${id} removed`,
      });
    } catch {
      toast({
        title: "Deletion failed",
        description: "Unable to delete store",
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <div className="space-y-4">
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

export default App;
