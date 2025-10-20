import { useState } from "react";
import { makeDbReset, processCastHashApi, deleteRun, banUser } from "@/services/adminAPI";
import { useAuth } from "@/shared/hooks/auth/useAuth";

export const useAdmin = () => {
  const { miniappContext } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeletingRun, setIsDeletingRun] = useState(false);
  const [isBanningUser, setIsBanningUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_FIDS = [16098, 473065, 7464, 248111];
  const isAdmin = ADMIN_FIDS.includes(miniappContext?.user.fid || 0);

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

  const deleteRunByHash = async (castHash: string): Promise<boolean> => {
    setIsDeletingRun(true);
    setError(null);

    try {
      await deleteRun(castHash);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete run";
      setError(errorMessage);
      return false;
    } finally {
      setIsDeletingRun(false);
    }
  };

  const banUserByFid = async (fid: number): Promise<boolean> => {
    setIsBanningUser(true);
    setError(null);

    try {
      await banUser(fid);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to ban user";
      setError(errorMessage);
      return false;
    } finally {
      setIsBanningUser(false);
    }
  };

  return {
    isAdmin,
    resetDatabase,
    processCastHash,
    deleteRunByHash,
    banUserByFid,
    isResetting,
    isProcessing,
    isDeletingRun,
    isBanningUser,
    error,
    clearError: () => setError(null),
  };
};
