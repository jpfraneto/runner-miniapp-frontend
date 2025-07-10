// Dependencies
import { useQuery } from "@tanstack/react-query";
import { getWorkoutHistory } from "@/services/user";

// Types

export interface UseWorkoutHistoryParams {
  page?: number;
  limit?: number;
}

export const useWorkoutHistory = (params: UseWorkoutHistoryParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["workoutHistory", page, limit],
    queryFn: () => getWorkoutHistory(page, limit),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
