import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    try {
      setRetrying(true);
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unable to fetch stores</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4 text-sm">{message}</p>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={retrying}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${retrying ? "animate-spin" : ""}`}
            />
            {retrying ? "Retrying..." : "Retry"}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
