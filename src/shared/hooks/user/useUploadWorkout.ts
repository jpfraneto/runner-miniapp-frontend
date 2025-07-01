// src/shared/hooks/user/useUploadWorkout.ts

// Dependencies
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadWorkoutScreenshots, verifyWorkoutData } from "@/services/user";

// Types
export interface UploadWorkoutData {
  screenshots: File[];
  plannedSessionId?: string;
  notes?: string;
}

export interface ExtractedWorkoutData {
  distance: number;
  duration: number;
  pace: string;
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  elevationGain: number;
  steps: number;
  runningApp: string;
  confidence: number;
  weather: {
    temperature?: number;
    conditions?: string;
  };
  route: {
    name?: string;
    type?: string;
  };
  splits: Array<{
    distance: number;
    time: string;
    pace: string;
  }>;
  extractedText: string[];
  isWorkoutImage: boolean;
  errorMessage?: string;
}

export interface CompletedRun {
  id: number;
  userId: number;
  status: "completed";
  completedDate: string;
  actualDistance: number; // km
  actualTime: number; // minutes
  actualPace: string; // e.g., "5:30/km"
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  elevationGain: number; // meters
  steps: number;
  screenshotUrls: string[]; // DigitalOcean Spaces URLs
  extractedData: {
    runningApp: string;
    confidence: number;
    weather: {
      temperature?: number;
      conditions?: string;
    };
    route: {
      name?: string;
      type?: string;
    };
    splits: Array<{
      distance: number;
      time: string;
      pace: string;
    }>;
    rawText: string[];
  };
  verified: boolean;
  isPersonalBest: boolean;
  personalBestType?: string;
  notes?: string;
}

export interface UploadWorkoutResponse {
  success: boolean;
  data: {
    completedRun: CompletedRun;
    extractedData: ExtractedWorkoutData;
    screenshotUrls: string[];
    isPersonalBest: boolean;
    personalBestType?: string;
  };
  message: string;
}

export interface VerifyWorkoutResponse {
  success: boolean;
  data: CompletedRun;
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
        data.data.extractedData.isWorkoutImage &&
        data.data.extractedData.confidence > 0
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
          ["completedRun", data.data.completedRun.id],
          data.data.completedRun
        );

        // Log confidence level
        if (data.data.extractedData.confidence >= 0.8) {
          console.log(
            "🎉 High confidence extraction:",
            data.data.extractedData
          );
        } else {
          console.log(
            "⚠️ Low confidence - may need verification:",
            data.data.extractedData
          );
        }
      } else {
        console.log(
          "❌ Not a workout image or no valid data extracted:",
          data.data.extractedData
        );
      }
      queryClient.setQueryData(
        ["completedRun", data.data],
        data.data.completedRun
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
