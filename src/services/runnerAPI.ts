import { request } from "./api";
import { AUTH_SERVICE, LEADERBOARD_SERVICE, WORKOUTS_SERVICE } from "@/config/api";
import { Leaderboard } from "@/shared/types/leaderboard";
import { Workout } from "@/shared/types/workout";

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
export const getRecentWorkouts = async (limit: number = 50): Promise<Workout[]> =>
  await request<Workout[]>(`${WORKOUTS_SERVICE}/recent`, {
    method: "GET",
    params: {
      limit: String(limit),
    },
  });

export const getCurrentWeekWorkouts = async (): Promise<Workout[]> =>
  await request<Workout[]>(`${WORKOUTS_SERVICE}/current-week`, {
    method: "GET",
  });

export const getUserWorkouts = async (
  fid: number,
  limit: number = 20
): Promise<Workout[]> =>
  await request<Workout[]>(`${WORKOUTS_SERVICE}/user`, {
    method: "GET",
    params: {
      fid: String(fid),
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