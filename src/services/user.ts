// API Dependency
import { request } from "./api";

// Configuration
import { BRAND_SERVICE, USER_SERVICE, TRAINING_SERVICE } from "@/config/api";

// Types
import {
  User,
  UserVoteHistory,
  UserVote,
  UserBrand,
} from "../shared/hooks/user";
import {
  UploadWorkoutData,
  UploadWorkoutResponse,
  VerifyWorkoutResponse,
  CompletedRun,
} from "@/shared/hooks/user/useUploadWorkout";
import { TodaysMissionResponse } from "@/shared/hooks/user/useTodaysMission";
// Types for run detail
export interface RunDetailResponse {
  success: boolean;
  data: CompletedRun;
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

/**
 * Retrieves the vote history of a user from the user service.
 *
 * @param id - The ID of the user whose vote history is being retrieved.
 * @param pageId - The page number for paginated vote history.
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getUserVotesHistory = async (id: User["fid"], pageId: number) =>
  await request<{ count: number; data: Record<string, UserVoteHistory> }>(
    `${USER_SERVICE}/user/${id}/vote-history`,
    {
      method: "GET",
      params: {
        pageId: String(pageId),
        limit: String(3 * 10),
      },
    }
  );

/**
 * Retrieves the current user's vote history using authentication.
 * No user ID required - uses the auth token to identify the user.
 *
 * @param pageId - The page number for paginated vote history.
 * @param limit - Number of records per page (default: 15).
 * @returns A promise that resolves with an object containing the count of votes and the user's vote history data.
 */
export const getMyVoteHistory = async (
  pageId: number = 1,
  limit: number = 15
) =>
  await request<{ count: number; data: Record<string, UserVoteHistory> }>(
    `${USER_SERVICE}/my-vote-history`,
    {
      method: "GET",
      params: {
        pageId: String(pageId),
        limit: String(limit),
      },
    }
  );

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

export const getUserBrands = async () =>
  await request<UserBrand[]>(`${USER_SERVICE}/brands`, {
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
  await request<ShareVerificationResponse>(`${BRAND_SERVICE}/verify-share`, {
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
 * Gets today's planned session and completion status
 *
 * @returns Promise with today's mission data including planned session, completed runs, and progress
 */
export const getTodaysMission = async (): Promise<TodaysMissionResponse> =>
  await request<TodaysMissionResponse>(
    `${TRAINING_SERVICE}/runner-workflow/today`,
    {
      method: "GET",
    }
  );

/**
 * Gets the user's workout history
 *
 * @returns Promise with the user's workout history
 */
export const getWorkoutHistory = async (): Promise<{
  success: boolean;
  data: CompletedRun[];
  message: string;
}> =>
  await request<{ success: boolean; data: CompletedRun[]; message: string }>(
    `${USER_SERVICE}/workouts`,
    {
      method: "GET",
    }
  );

/**
 * Uploads workout screenshots and processes them with AI
 *
 * @param data - Object containing screenshots and optional metadata
 * @returns Promise with extracted workout data and completion details
 */
export const uploadWorkoutScreenshots = async (
  data: UploadWorkoutData
): Promise<UploadWorkoutResponse> => {
  console.log("TRAINING_SERVICE URL:", TRAINING_SERVICE);
  console.log("Starting workout upload with data:", data);

  const formData = new FormData();

  // Add screenshots to FormData
  console.log(
    "Adding screenshots to FormData:",
    data.screenshots.length,
    "files"
  );
  data.screenshots.forEach((file) => {
    formData.append("screenshots", file);
    console.log("Added screenshot:", file.name, file.size, "bytes");
  });

  // Add optional metadata
  if (data.plannedSessionId) {
    console.log("Adding planned session ID:", data.plannedSessionId);
    formData.append("plannedSessionId", data.plannedSessionId);
  }

  if (data.notes) {
    console.log("Adding notes:", data.notes);
    formData.append("notes", data.notes);
  }

  console.log(
    "Making API request to:",
    `${TRAINING_SERVICE}/runner-workflow/upload-run`
  );
  const response = await request<UploadWorkoutResponse>(
    `${TRAINING_SERVICE}/runner-workflow/upload-run`,
    {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header - browser will set it with boundary for FormData
    }
  );
  console.log("Upload response:", response);

  return response;
};

/**
 * Verifies workout data extracted from screenshots
 *
 * @param runId - The ID of the completed run to verify
 * @returns Promise with verification result
 */
export const verifyWorkoutData = async (
  runId: number
): Promise<VerifyWorkoutResponse> => {
  return await request<VerifyWorkoutResponse>(
    `${TRAINING_SERVICE}/runner-workflow/verify-run/${runId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/**
 * Gets user's performance analytics
 *
 * @returns Promise with user performance data
 */
export const getUserPerformance = async () =>
  await request(`${TRAINING_SERVICE}/runner-workflow/performance`, {
    method: "GET",
  });

/**
 * Marks a planned session as completed or skipped
 *
 * @param sessionId - ID of the planned session
 * @param didComplete - Whether user completed the session (true) or skipped it (false)
 * @returns Promise with success status and message
 */
export const markSessionCompleted = async (
  sessionId: number,
  didComplete: boolean
): Promise<{ success: boolean; message: string }> =>
  await request<{ success: boolean; message: string }>(
    `${TRAINING_SERVICE}/runner-workflow/complete-session/${sessionId}`,
    {
      method: "POST",
      body: { didComplete },
      headers: {
        "Content-Type": "application/json",
      },
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
 * Generates and shares workout achievement on Farcaster
 *
 * @param completedRunId - ID of the completed run to share
 * @returns Promise with share success status and cast hash
 */
export const shareWorkoutAchievement = async (
  completedRunId: number
): Promise<{ success: boolean; castHash?: string; shareImageUrl?: string }> =>
  await request<{
    success: boolean;
    castHash?: string;
    shareImageUrl?: string;
  }>(`${TRAINING_SERVICE}/runner-workflow/share-run/${completedRunId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

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
