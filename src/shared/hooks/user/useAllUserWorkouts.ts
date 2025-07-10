// Dependencies
import { useQuery } from "@tanstack/react-query";
import { getAllUserWorkouts } from "@/services/user";

// Types
import { RunningSession } from "@/shared/types/running";

export interface AllUserWorkoutsResponse {
  success: boolean;
  data: RunningSession[];
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UseAllUserWorkoutsParams {
  page?: number;
  limit?: number;
}

export const useAllUserWorkouts = (params: UseAllUserWorkoutsParams = {}) => {
  const { page = 1, limit = 30 } = params;

  return useQuery({
    queryKey: ["allUserWorkouts", page, limit],
    queryFn: () => getAllUserWorkouts(page, limit),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
