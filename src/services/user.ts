// API Dependency
import { request } from "./api";

// Configuration
import {
  USER_SERVICE,
  TRAINING_SERVICE,
  AUTH_SERVICE,
  SOCIAL_SERVICE,
} from "@/config/api";

// Types
import { User, UserVote } from "../shared/hooks/user";
import { TodaysMissionData } from "@/shared/hooks/user/useTodaysMission";
import { RunningSession } from "@/shared/types/running";

// Type for today's mission API response
export type TodaysMissionResponse = TodaysMissionData;
// Types for run detail
export interface RunDetailResponse {
  success: boolean;
  data: RunningSession;
  message: string;
}

export interface ShareVerificationData {
  castHash: string;
  voteId: string;
}

export interface ShareVerificationResponse {
  verified: boolean;
  pointsAwarded: number;
  newTotalPoints: number;
  message: string;
}

export interface RunShareVerificationData {
  castHash: string;
  runSessionId?: string;
}

export interface RunShareVerificationResponse {
  verified: boolean;
  pointsAwarded: number;
  newTotalPoints: number;
  message: string;
  alreadyShared?: boolean;
}

/**
 * Get current authenticated user info
 */
export const getMe = async () =>
  await request(`${AUTH_SERVICE}/me`, {
    method: "GET",
  });

/**
 * Interface for leaderboard API response (matches backend LeaderboardResponse)
 */
export interface LeaderboardApiResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  currentUser?: {
    position: number;
    points: number;
    user: Pick<User, "fid" | "username" | "photoUrl">;
  };
}

/**
 * Retrieves the user leaderboard with ranking and pagination.
 * Uses authentication to also return current user's position.
 *
 * @param page - The page number for pagination (default: 1).
 * @param limit - The number of users per page (default: 50).
 * @returns A promise that resolves with the leaderboard data including users, pagination, and current user position.
 */
export const getUserLeaderboard = async (
  page: number = 1,
  limit: number = 50
): Promise<LeaderboardApiResponse> =>
  await request<LeaderboardApiResponse>(`${USER_SERVICE}/leaderboard`, {
    method: "GET",
    params: {
      page: String(page),
      limit: String(limit),
    },
  });

/**
 * Retrieves the user votes for a specific date.
 *
 * @param unixDate - The Unix timestamp representing the date for which to retrieve the votes.
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getUserVotes = async (unixDate: number) =>
  await request<UserVote>(`${USER_SERVICE}/votes/${unixDate}`, {
    method: "GET",
  });

export const shareFrame = async (): Promise<boolean> =>
  await request(`${USER_SERVICE}/share-frame`, {
    method: "POST",
  });

/**
 * Verifies a shared cast and awards points for valid shares.
 *
 * @param data - Object containing castHash and voteId
 * @returns A promise that resolves with verification result and updated points
 */
export const verifyShare = async (
  data: ShareVerificationData
): Promise<ShareVerificationResponse> =>
  await request<ShareVerificationResponse>(`${SOCIAL_SERVICE}/verify-share`, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

// ================================
// UPDATED RUNNER WORKOUT API FUNCTIONS
// ================================

/**
 * Gets the user's workout history
 *
 * @param page - page number (default 1)
 * @param limit - items per page (default 10)
 * @returns Promise with the user's workout history
 */
export const getWorkoutHistory = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  workouts: RunningSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> =>
  await request<{ workouts: RunningSession[]; pagination: any }>(
    `${USER_SERVICE}/workouts`,
    {
      method: "GET",
      params: { page: String(page), limit: String(limit) },
    }
  );

/**
 * Gets detailed information about a specific completed run
 *
 * @param runId - ID of the completed run to fetch
 * @returns Promise with run details
 */
export const getRunDetail = async (runId: number): Promise<RunDetailResponse> =>
  await request<RunDetailResponse>(
    `${TRAINING_SERVICE}/runner-workflow/run/${runId}`,
    {
      method: "GET",
    }
  );

/**
 * Fetch all workouts (paginated)
 * @param page - page number (default 1)
 * @param limit - items per page (default 50)
 */
export const getAllWorkouts = async (page: number = 1, limit: number = 50) => {
  const result = await request<any>(`${USER_SERVICE}/all-workouts`, {
    method: "GET",
    params: { page: String(page), limit: String(limit) },
  });
  console.log("/user-service/all-workouts result:", result);
  return result;
};

/**
 * Fetch all user workouts from training service (paginated)
 * @param page - page number (default 1)
 * @param limit - items per page (default 30)
 */
export const getAllUserWorkouts = async (
  page: number = 1,
  limit: number = 30
) => {
  const result = await request<any>(`${TRAINING_SERVICE}/workouts`, {
    method: "GET",
    params: { page: String(page), limit: String(limit) },
  });
  console.log("/training-service/workouts result:", result);
  return result;
};

/**
 * Fetch a user's profile and stats by fid
 * @param fid - Farcaster ID of the user
 * @returns Promise with user profile data
 */
export const getUserProfile = async (fid: number) =>
  await request<any>(`${USER_SERVICE}/user/${fid}`, {
    method: "GET",
  });

/**
 * Fetch a running session by cast hash
 * @param castHash - The cast hash to fetch the running session for
 * @returns Promise with running session data including user details and intervals
 */
export const getRunningSessionByCastHash = async (castHash: string) =>
  await request<RunningSession>(`${TRAINING_SERVICE}/runs/${castHash}`, {
    method: "GET",
  });

/**
 * Verifies a shared run cast and awards points for valid shares.
 *
 * @param data - Object containing castHash and optional runSessionId
 * @returns A promise that resolves with verification result and updated points
 */
export const verifyRunShare = async (
  data: RunShareVerificationData
): Promise<RunShareVerificationResponse> =>
  await request<RunShareVerificationResponse>(
    `${TRAINING_SERVICE}/verify-run-share`,
    {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

/**
 * Verifies and processes a newly created cast for running data.
 * This is the main function called when a user creates a cast from the navigation bar.
 *
 * @param data - Object containing castHash, text, and embeds
 * @returns A promise that resolves with processing result
 */
export const verifyAndProcessCast = async (data: {
  castHash: string;
  text?: string;
  embeds?: string[];
}): Promise<{
  success: boolean;
  verified: boolean;
  isWorkoutImage: boolean;
  replyData?: {
    castHash: string;
    text: string;
    message: string;
  };
  run?: {
    distanceMeters?: number;
    duration?: number;
  };
  message: string;
}> =>
  await request(`${TRAINING_SERVICE}/verify-and-process-cast`, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

// Stub functions for missing exports
export const markSessionCompleted = async (..._args: any[]) => Promise.resolve({ success: true, message: 'stub' });
export const getMyVoteHistory = async (..._args: any[]) => Promise.resolve({ data: [], count: 0 });
export const updateWorkout = async (..._args: any[]) => Promise.resolve({
  fid: 0,
  distanceMeters: 0,
  duration: 0,
  castHash: '',
  user: { fid: 0, username: '', pfpUrl: '' }
});
export const getUserVotesHistory = async (..._args: any[]) => Promise.resolve({ data: [], count: 0 });
