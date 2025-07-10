// src/shared/hooks/user/useUploadWorkout.ts

// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadWorkoutScreenshots, verifyWorkoutData } from "@/services/user";

// Types
import { RunningSession } from "@/shared/types/running";

export interface UploadWorkoutData {
  screenshots: File[];
  plannedSessionId?: string;
  notes?: string;
}

// Legacy alias for backward compatibility
export type CompletedRun = RunningSession;

export interface Interval {
  intervalNumber?: number; // optional for warmup/cooldown
  type: "Run" | "Work" | "Fast" | "Recovery" | "Rest" | string;
  distance: number; // km
  duration: string; // formatted "mm:ss.s"
  pace: string; // e.g., "5:15/km"
  estimatedSpeed?: {
    min: number;
    max: number;
    avg: number;
  };
}

export interface PaceVariation {
  timePoint: string; // e.g., "16:19"
  estimatedPace: string; // "5:00/km"
  intensity: "high" | "medium" | "low" | "recovery" | string;
}

export interface HeartRateZone {
  timeRange: string; // "0:00-16:19"
  avgBPM: number;
  intensity: "zone 1" | "zone 2" | "zone 3" | "zone 4" | "zone 5" | string;
}

export interface Split {
  distance: number;
  time: string;
  pace: string;
}

export interface UploadWorkoutResponse {
  runningSession: RunningSession;
  extractedData: RunningSession;
  screenshotUrls: string[];
  isPersonalBest: boolean;
  personalBestType?: string;
}

export interface VerifyWorkoutResponse {
  success: boolean;
  data: RunningSession;
  message: string;
}

export const useUploadWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadWorkoutScreenshots,
    onSuccess: (data: UploadWorkoutResponse) => {
      console.log("IN HEREEEE THE DATA IS", JSON.stringify(data, null, 2));

      // Only invalidate queries and set data if this is actually a successful workout
      if (
        data.extractedData.isWorkoutImage &&
        (Number(data.extractedData.confidence) || 0) > 0
      ) {
        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["todaysMission"] });
        queryClient.invalidateQueries({ queryKey: ["userPerformance"] });
        queryClient.invalidateQueries({ queryKey: ["workoutSessions"] });
        queryClient.invalidateQueries({ queryKey: ["weeklyProgress"] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        queryClient.invalidateQueries({ queryKey: ["workoutHistory"] });

        // Set the completed run data for immediate access
        queryClient.setQueryData(
          ["runningSession", data.runningSession.id],
          data.runningSession
        );

        // Log confidence level
        const confidence = Number(data.extractedData.confidence) || 0;
        if (confidence >= 0.8) {
          console.log("🎉 High confidence extraction:", data.extractedData);
        } else {
          console.log(
            "⚠️ Low confidence - may need verification:",
            data.extractedData
          );
        }
      } else {
        console.log(
          "❌ Not a workout image or no valid data extracted:",
          data.extractedData
        );
      }

      // Set the completed run data for immediate access (moved outside the if block)
      queryClient.setQueryData(
        ["completedRun", data.runningSession.id],
        data.runningSession
      );
    },
    onError: (error: Error) => {
      console.error("Upload failed:", error.message);
    },
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useVerifyWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyWorkoutData,
    onSuccess: (data: VerifyWorkoutResponse) => {
      // Update the completed run data
      queryClient.setQueryData(["completedRun", data.data.id], data.data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["todaysMission"] });
      queryClient.invalidateQueries({ queryKey: ["userPerformance"] });
      queryClient.invalidateQueries({ queryKey: ["workoutSessions"] });
    },
    onError: (error: Error) => {
      console.error("Verification failed:", error.message);
    },
  });
};
