// Dependencies
import { useQuery } from "@tanstack/react-query";
import { request } from "@/services/api";
import { TRAINING_SERVICE } from "@/config/api";

// Types
export interface WeeklyRun {
  id: string;
  date: string;
  distance: number;
  time: number;
  pace: string;
  calories: number;
  dayOfWeek: string;
}

export interface WeeklyComparison {
  metric: 'distance' | 'runs' | 'time' | 'pace';
  currentWeek: number | string;
  lastWeek: number | string;
  change: number; // percentage change
  isImprovement: boolean;
}

export interface StreakInfo {
  current: number;
  longest: number;
  thisWeek: number;
  status: 'active' | 'broken' | 'at_risk';
  nextRunByDate?: string; // to maintain streak
}

export interface WeeklySummaryResponse {
  success: boolean;
  data: {
    weeklyRuns: WeeklyRun[];
    weeklyStats: {
      totalRuns: number;
      totalDistance: number;
      totalTime: number;
      averagePace: string;
      bestRun: WeeklyRun | null;
    };
    comparisons: WeeklyComparison[];
    streakInfo: StreakInfo;
    weekStart: string;
    weekEnd: string;
  };
  message: string;
}

const getWeeklySummary = async (fid: number): Promise<WeeklySummaryResponse> => {
  return await request<WeeklySummaryResponse>(`${TRAINING_SERVICE}/user/${fid}/weekly-summary`, {
    method: "GET",
  });
};

export const useWeeklySummary = (fid: number) => {
  return useQuery({
    queryKey: ["weeklySummary", fid],
    queryFn: () => getWeeklySummary(fid),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!fid,
  });
};