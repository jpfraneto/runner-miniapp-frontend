// Dependencies
import { useQuery } from "@tanstack/react-query";
import { request } from "@/services/api";
import { TRAINING_SERVICE } from "@/config/api";

// Types
export interface UserRanking {
  category: 'distance' | 'runs' | 'time' | 'pace';
  rank: number;
  percentile: number; // 0-100
  value: number | string;
  totalUsers: number;
}

export interface CommunityBenchmark {
  avgDistance: number;
  avgRuns: number;
  avgTime: number;
  avgPace: string;
  medianDistance: number;
  medianRuns: number;
}

export interface SimilarRunner {
  fid: number;
  username: string;
  pfpUrl: string;
  totalDistance: number;
  totalRuns: number;
  averagePace: string;
  similarityScore: number; // 0-1
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'distance' | 'frequency' | 'pace' | 'streak';
  percentile: number; // What percentile this achievement represents
  earned: boolean;
  earnedDate?: string;
  icon: string;
}

export interface CommunityContextResponse {
  success: boolean;
  data: {
    userRankings: UserRanking[];
    communityBenchmark: CommunityBenchmark;
    similarRunners: SimilarRunner[];
    achievementBadges: AchievementBadge[];
  };
  message: string;
}

const getCommunityContext = async (fid: number): Promise<CommunityContextResponse> => {
  return await request<CommunityContextResponse>(`${TRAINING_SERVICE}/user/${fid}/community-context`, {
    method: "GET",
  });
};

export const useCommunityContext = (fid: number) => {
  return useQuery({
    queryKey: ["communityContext", fid],
    queryFn: () => getCommunityContext(fid),
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!fid,
  });
};