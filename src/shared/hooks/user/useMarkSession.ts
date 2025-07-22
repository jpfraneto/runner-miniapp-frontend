// src/shared/hooks/user/useMarkSession.ts

// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markSessionCompleted } from "@/services/user";

// Types
interface MarkSessionData {
  sessionId: number;
  didComplete: boolean;
}

interface MarkSessionResponse {
  success: boolean;
  message: string;
}

export const useMarkSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, didComplete }: MarkSessionData) =>
      markSessionCompleted(sessionId, didComplete) as Promise<MarkSessionResponse>,

    onSuccess: (_data: MarkSessionResponse, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["todaysMission"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyProgress"] });

      // Show appropriate feedback
      if (variables.didComplete) {
        console.log("✅ Session marked as completed!");
      } else {
        console.log("⏭️ Session marked as skipped");
      }
    },

    onError: (error: Error) => {
      console.error("Failed to mark session:", error.message);
    },
  });
};
