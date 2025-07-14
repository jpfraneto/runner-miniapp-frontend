// Dependencies
import { useQuery } from "@tanstack/react-query";
import { request } from "@/services/api";
import { TRAINING_SERVICE } from "@/config/api";

// Types
export interface WeeklyStory {
  title: string;
  summary: string;
  highlights: string[];
  improvement: {
    metric: string;
    change: number;
    isPositive: boolean;
  } | null;
}

export interface PatternInsight {
  type: 'best_day' | 'preferred_time' | 'distance_preference' | 'consistency';
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: string;
}

export interface ImprovementOpportunity {
  category: 'pace' | 'distance' | 'frequency' | 'consistency';
  title: string;
  description: string;
  suggestion: string;
  potentialImprovement: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GoalProgress {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: 'distance' | 'runs' | 'time' | 'streak';
  deadline?: string;
  progress: number; // 0-100
  onTrack: boolean;
  daysRemaining?: number;
}

export interface ProgressInsightsResponse {
  success: boolean;
  data: {
    weeklyStory: WeeklyStory;
    patternInsights: PatternInsight[];
    improvementOpportunities: ImprovementOpportunity[];
    goalProgress: GoalProgress[];
  };
  message: string;
}

const getProgressInsights = async (fid: number): Promise<ProgressInsightsResponse> => {
  return await request<ProgressInsightsResponse>(`${TRAINING_SERVICE}/user/${fid}/insights`, {
    method: "GET",
  });
};

export const useProgressInsights = (fid: number) => {
  return useQuery({
    queryKey: ["progressInsights", fid],
    queryFn: () => getProgressInsights(fid),
    staleTime: 15 * 60 * 1000, // Consider data fresh for 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!fid,
  });
};