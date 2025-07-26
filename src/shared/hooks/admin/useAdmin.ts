import { useState } from "react";
import { makeDbReset, processCastHashApi } from "@/services/adminAPI";

export const useAdmin = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetDatabase = async (): Promise<boolean> => {
    setIsResetting(true);
    setError(null);

    try {
      await makeDbReset();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Database reset failed";
      setError(errorMessage);
      return false;
    } finally {
      setIsResetting(false);
    }
  };

  const processCastHash = async (castHash: string): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);
    console.log("Processing cast hash:", castHash);

    try {
      // Basic validation to check if it looks like a cast hash
      if (!castHash || castHash.trim().length === 0) {
        throw new Error("Cast hash is empty");
      }

      const trimmedCastHash = castHash.trim();
      if (!/^0x[a-fA-F0-9]{40,42}$/.test(trimmedCastHash)) {
        throw new Error("Invalid cast hash format");
      }
      console.log("Trimmed cast hash:", trimmedCastHash);
      // Send to API
      await processCastHashApi(trimmedCastHash);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Cast processing failed";
      setError(errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    resetDatabase,
    processCastHash,
    isResetting,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
};
