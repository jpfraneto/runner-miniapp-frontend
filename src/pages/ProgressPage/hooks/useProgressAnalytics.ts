// Dependencies
import { useQuery } from "@tanstack/react-query";
import { request } from "@/services/api";
import { TRAINING_SERVICE } from "@/config/api";

// Types
export interface PersonalStats {
  totalRuns: number;
  totalDistance: number; // in km
  totalTime: number; // in minutes
  averagePace: string; // min/km format
  currentStreak: number; // days
  longestStreak: number; // days
  totalCalories: number;
  bestDistance: number;
  bestTime: number;
  bestPace: string;
}

export interface WeeklyStats {
  runsCompleted: number;
  weeklyDistance: number;
  weeklyTime: number;
  bestWeeklyRun: {
    distance: number;
    time: number;
    pace: string;
    date: string;
  } | null;
}

export interface TrendData {
  week: string;
  distance: number;
  time: number;
  averagePace: number; // seconds per km for calculations
  runs: number;
}

export interface ProgressAnalyticsResponse {
  success: boolean;
  data: {
    personalStats: PersonalStats;
    weeklyStats: WeeklyStats;
    monthlyTrends: TrendData[];
    recentRuns: Array<{
      id: string;
      date: string;
      distance: number;
      time: number;
      pace: string;
      calories: number;
    }>;
  };
  message: string;
}

const getProgressAnalytics = async (fid: number): Promise<ProgressAnalyticsResponse> => {
  return await request<ProgressAnalyticsResponse>(`${TRAINING_SERVICE}/user/${fid}/analytics`, {
    method: "GET",
  });
};

export const useProgressAnalytics = (fid: number) => {
  return useQuery({
    queryKey: ["progressAnalytics", fid],
    queryFn: () => getProgressAnalytics(fid),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!fid,
  });
};