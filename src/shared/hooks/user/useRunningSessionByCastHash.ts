// Dependencies
import { useQuery } from "@tanstack/react-query";

// Services
import { getRunningSessionByCastHash } from "@/services/user";

/**
 * Hook for fetching running session data by cast hash
 *
 * @param castHash - The cast hash to fetch the running session for
 * @returns Query object with running session data, loading state, and error handling
 */
export const useRunningSessionByCastHash = (castHash: string | undefined) => {
  return useQuery({
    queryKey: ["runningSession", castHash],
    queryFn: () => getRunningSessionByCastHash(castHash!),
    enabled: !!castHash, // Only fetch when castHash is provided
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
