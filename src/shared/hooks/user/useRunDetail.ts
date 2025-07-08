// Dependencies
import { useQuery } from "@tanstack/react-query";

// Services
import { getRunDetail } from "@/services/user";

/**
 * Hook to fetch detailed information about a specific run
 *
 * @param runId - The ID of the run to fetch
 * @returns Query result with run details
 */
export const useRunDetail = (runId: number) => {
  return useQuery({
    queryKey: ["runDetail", runId],
    queryFn: async () => {
      const response = await getRunDetail(runId);
      return response.data; // Return the actual run data, not the wrapper
    },
    enabled: !!runId && runId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
