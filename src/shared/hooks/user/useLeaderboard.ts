// Dependencies
import { useQuery } from "@tanstack/react-query";
import { request } from "@/services/api";
import { TRAINING_SERVICE } from "@/config/api";

// Types
export interface LeaderboardUser {
  fid: number;
  username: string;
  pfpUrl: string;
  totalDistance: number;
  totalWorkouts: number;
  totalTime: number; // in minutes
  averagePace: string;
  bestDistance: number;
  bestTime: number;
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardUser[];
  message: string;
  totalUsers: number;
}

export type SortBy = "totalDistance" | "totalWorkouts" | "totalTime";

export interface UseLeaderboardParams {
  sortBy?: SortBy;
  limit?: number;
}

const getLeaderboard = async (
  sortBy: SortBy = "totalDistance",
  limit: number = 50
): Promise<LeaderboardResponse> => {
  return await request<LeaderboardResponse>(`${TRAINING_SERVICE}/leaderboard`, {
    method: "GET",
    params: {
      sortBy,
      limit: limit.toString(),
    },
  });
};

export const useLeaderboard = (params: UseLeaderboardParams = {}) => {
  const { sortBy = "totalDistance", limit = 50 } = params;

  return useQuery({
    queryKey: ["leaderboard", sortBy, limit],
    queryFn: () => getLeaderboard(sortBy, limit),
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
