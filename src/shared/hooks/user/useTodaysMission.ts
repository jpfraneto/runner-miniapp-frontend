// src/shared/hooks/user/useTodaysMission.ts

// Dependencies
import { useQuery } from "@tanstack/react-query";
import { getTodaysMission } from "@/services/user";

// Types
export interface PlannedSession {
  id: number;
  sessionType:
    | "intervals"
    | "fixed_time"
    | "fixed_length"
    | "tempo"
    | "long_run"
    | "recovery";
  scheduledDate: string;
  targetDistance?: number;
  targetTime?: number;
  targetPace?: string;
  instructions: string;
  motivationalMessage?: string;
  priority: "easy" | "moderate" | "hard" | "key_workout";
  isCompleted: boolean;
  intervalStructure?: {
    warmup?: number;
    intervals?: Array<{
      distance?: number;
      time?: number;
      pace?: string;
      rest?: number;
      repetitions?: number;
    }>;
    cooldown?: number;
  };
}

export interface CompletedRun {
  isWorkoutImage: boolean;
  distance: number;
  duration: number;
  pace: string;
  calories: number;
  elevationGain: number;
  avgHeartRate: number;
  maxHeartRate: number | null;
  steps: number | null;
  startTime: string;
  endTime: string | null;
  route: {
    name: string;
    type: string;
  };
  intervals: {
    detected: boolean;
    workIntervals: any[];
    recoveryIntervals: any[];
    warmup: {
      distance: number;
      duration: string;
      pace: string;
    };
    cooldown: {
      distance: number;
      duration: string;
      pace: string;
    };
  };
  paceAnalysis: {
    chartDetected: boolean;
    paceVariations: any[];
    fastestSegmentPace: string | null;
    pacingStrategy: string;
  };
  heartRateAnalysis: {
    chartDetected: boolean;
    zones: any[];
  };
  splits: any[];
  weather: {
    temperature: number;
    conditions: string;
  };
  runningApp: string;
  confidence: number;
  extractedText: string[];
}

export interface TodaysMissionResponse {
  plannedSession: PlannedSession | null;
  completedRun: CompletedRun | null;
  hasCompletedToday: boolean;
  weeklyProgress: {
    completed: number;
    planned: number;
    completionRate: number;
  };
  streak: {
    current: number;
    needsTodaysRun: boolean;
    isAtRisk: boolean;
  };
}

export const useTodaysMission = () => {
  return useQuery({
    queryKey: ["todaysMission"],
    queryFn: getTodaysMission,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (mission status can change)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to app
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for streak monitoring
  });
};
