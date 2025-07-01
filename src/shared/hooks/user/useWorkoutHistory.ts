// Dependencies
import { useQuery } from "@tanstack/react-query";
import { getWorkoutHistory } from "@/services/user";

// Types
import { CompletedRun } from "./useUploadWorkout";

export interface WorkoutHistoryResponse {
  success: boolean;
  data: CompletedRun[];
  message: string;
}

export const useWorkoutHistory = () => {
  return useQuery({
    queryKey: ["workoutHistory"],
    queryFn: getWorkoutHistory,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
