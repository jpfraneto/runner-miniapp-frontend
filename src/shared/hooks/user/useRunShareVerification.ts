// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import {
  verifyRunShare,
  RunShareVerificationData,
  RunShareVerificationResponse,
} from "@/services/user";

/**
 * Hook for verifying shared run casts and awarding points.
 *
 * This hook handles the process of:
 * 1. Sending cast hash and optional run session ID to backend for verification
 * 2. Invalidating auth cache to refresh user points
 * 3. Providing loading and error states for UI feedback
 */
export const useRunShareVerification = () => {
  const queryClient = useQueryClient();

  return useMutation<RunShareVerificationResponse, Error, RunShareVerificationData>({
    mutationFn: verifyRunShare,
    onSuccess: (data) => {
      console.log("✅ [RunShareVerification] Run share verified successfully:", data);

      // Invalidate auth cache to refresh user points
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Invalidate user-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (error) => {
      console.error("❌ [RunShareVerification] Verification failed:", error);
    },
  });
};

// Export types for use in components
export type { RunShareVerificationData, RunShareVerificationResponse };