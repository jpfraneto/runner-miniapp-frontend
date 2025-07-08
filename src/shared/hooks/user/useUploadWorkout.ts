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

export interface CompletedRun {
  id: string;
  isWorkoutImage: boolean;
  distance: number; // in km
  duration: number; // in minutes
  pace: string; // "min/km"
  calories: number;
  elevationGain: number;
  avgHeartRate: number;
  maxHeartRate: number | null;
  steps: number | null;
  startTime: string; // ISO
  endTime: string | null;
  route: {
    name: string;
    type: "outdoor" | "treadmill" | "track" | "indoor" | string;
  };
  intervals: {
    detected: boolean;
    workIntervals: Interval[];
    recoveryIntervals: Interval[];
    warmup: Interval;
    cooldown: Interval;
  };
  paceAnalysis: {
    chartDetected: boolean;
    paceVariations: PaceVariation[];
    fastestSegmentPace: string | null;
    pacingStrategy:
      | "negative split"
      | "positive split"
      | "even"
      | "intervals"
      | string;
  };
  heartRateAnalysis: {
    chartDetected: boolean;
    zones: HeartRateZone[];
  };
  splits: Split[];
  weather: {
    temperature: number; // Celsius
    conditions: string; // e.g., "cloudy", "rainy"
  };
  runningApp: string;
  confidence: number; // 0–1
  extractedText: string[];
  // Additional properties used in RunDetailPage
  actualDistance?: number; // in km
  actualTime?: number; // in minutes
  actualPace?: string; // "min/km"
  isPersonalBest?: boolean;
  personalBestType?: string;
  screenshotUrls?: string[];
  completedDate?: string; // ISO date string
  extractedData?: CompletedRun;
  verified?: boolean;
  notes?: string;
}

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
  completedRun: CompletedRun;
  extractedData: CompletedRun;
  screenshotUrls: string[];
  isPersonalBest: boolean;
  personalBestType?: string;
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
        data.extractedData.isWorkoutImage &&
        data.extractedData.confidence > 0
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
          ["completedRun", data.completedRun.id],
          data.completedRun
        );

        // Log confidence level
        if (data.extractedData.confidence >= 0.8) {
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
        ["completedRun", data.completedRun.id],
        data.completedRun
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
