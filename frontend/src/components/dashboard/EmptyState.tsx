import { Package } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Package className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Get started by creating your first store instance. It will be provisioned and ready in moments.
      </p>
    </div>
  );
}
