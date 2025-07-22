import { request } from "./api";
import {
  AUTH_SERVICE,
  LEADERBOARD_SERVICE,
  TRAINING_SERVICE,
  USER_SERVICE,
} from "@/config/api";
import { Leaderboard } from "@/shared/types/leaderboard";
import { RunningSession } from "@/shared/types/running";

export interface WorkoutApiResponse {
  runs: RunningSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
}

// Authentication
export const getMe = async () =>
  await request(`${AUTH_SERVICE}/me`, {
    method: "GET",
  });

export const verifyAuth = async (token: string) =>
  await request(`${AUTH_SERVICE}/verify`, {
    method: "POST",
    body: { token },
    headers: {
      "Content-Type": "application/json",
    },
  });

// Leaderboards
export const getCurrentLeaderboard = async (): Promise<Leaderboard> =>
  await request<Leaderboard>(`${LEADERBOARD_SERVICE}/current`, {
    method: "GET",
  });

export const getWeeklyLeaderboard = async (
  weekNumber: number = 0,
  year: number = 2024
): Promise<Leaderboard> =>
  await request<Leaderboard>(`${LEADERBOARD_SERVICE}/week`, {
    method: "GET",
    params: {
      weekNumber: String(weekNumber),
      year: String(year),
    },
  });

// Workouts
export const getRecentWorkouts = async (
  limit: number = 50
): Promise<WorkoutApiResponse> =>
  await request<WorkoutApiResponse>(`${TRAINING_SERVICE}/recent`, {
    method: "GET",
    params: {
      limit: String(limit),
    },
  });

export const getCurrentWeekWorkouts = async (): Promise<WorkoutApiResponse> =>
  await request<WorkoutApiResponse>(`${TRAINING_SERVICE}/current-week`, {
    method: "GET",
  });

export const getUserWorkouts = async (
  fid: number,
  limit: number = 20
): Promise<WorkoutApiResponse> =>
  await request<WorkoutApiResponse>(`${USER_SERVICE}/${fid}`, {
    method: "GET",
    params: {
      limit: String(limit),
    },
  });

// Cast Processing
export const processNewCast = async (castHash: string) =>
  await request(`/process-new-cast`, {
    method: "GET",
    params: {
      castHash,
    },
  });

// Flag running session
export const flagRunningSession = async (castHash: string) =>
  await request(`${TRAINING_SERVICE}/flag-run`, {
    method: "POST",
    body: { castHash },
    headers: {
      "Content-Type": "application/json",
    },
  });
