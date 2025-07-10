// src/shared/hooks/user/useTodaysMission.ts

import { useState, useEffect } from "react";
import { RunningSession } from "@/shared/types/running";

export type RunType = "fixed_time" | "fixed_distance" | "intervals";

// Legacy alias for backward compatibility
export type CompletedRun = RunningSession;

export interface PlannedSession {
  id: string;
  sessionType: RunType;
  targetDistance?: number;
  targetTime?: number;
  targetPace?: string;
  instructions: string;
  intervalStructure?: {
    warmup: number;
    intervals: Array<{
      distance: number;
      pace: string;
      rest: number;
      repetitions: number;
    }>;
    cooldown: number;
  };
}

export interface StreakData {
  current: number;
  needsTodaysRun: boolean;
  isAtRisk: boolean;
}

export interface WeeklyProgress {
  completed: number;
  planned: number;
  completionRate: number;
}

export interface TodaysMissionData {
  hasCompletedToday: boolean;
  runningSession?: RunningSession;
  plannedSession?: PlannedSession;
  isRestDay: boolean;
  streak: StreakData;
  weeklyProgress: WeeklyProgress;
}

export type WidgetStateType = "completed" | "pending" | "tomorrow" | "hidden";

// Fetch today's mission data
const fetchTodaysMission = async (): Promise<TodaysMissionData> => {
  try {
    const response = await fetch("/api/runner-workflow/today");
    if (!response.ok) {
      throw new Error("Failed to fetch today's mission");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching today's mission:", error);
    // Return safe defaults
    return {
      hasCompletedToday: false,
      isRestDay: false,
      streak: { current: 0, needsTodaysRun: false, isAtRisk: false },
      weeklyProgress: { completed: 0, planned: 0, completionRate: 0 },
    };
  }
};

export const useTodaysMission = () => {
  const [todaysMission, setTodaysMission] = useState<TodaysMissionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's mission data
  const loadTodaysMission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const missionData = await fetchTodaysMission();
      setTodaysMission(missionData);
    } catch (err) {
      setError("Failed to load today's mission");
      console.error("Error loading mission:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh mission data
  const refreshMission = () => {
    loadTodaysMission();
  };

  // Update mission data after completion
  const updateMissionAfterCompletion = (completedRun: CompletedRun) => {
    setTodaysMission((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hasCompletedToday: true,
        completedRun,
        isRestDay: false,
      };
    });
  };

  // Get widget state
  const getWidgetState = (): WidgetStateType => {
    if (!todaysMission) return "hidden";
    if (todaysMission.hasCompletedToday) return "completed";
    if (todaysMission.isRestDay) return "tomorrow";
    return "pending";
  };

  // Get mission description for planned sessions
  const getMissionDescription = (): string => {
    if (!todaysMission?.plannedSession)
      return "Upload your run to track your progress!";

    const session = todaysMission.plannedSession;
    switch (session.sessionType) {
      case "fixed_time":
        return `Run for ${session.targetTime} minutes${
          session.targetPace ? ` at ${session.targetPace}` : ""
        }`;
      case "fixed_distance":
        return `Run ${session.targetDistance}km${
          session.targetPace ? ` at ${session.targetPace}` : ""
        }`;
      case "intervals":
        if (session.intervalStructure) {
          const intervals = session.intervalStructure.intervals[0];
          return `${intervals.repetitions}x ${intervals.distance}m @ ${intervals.pace} (${intervals.rest}s rest)`;
        }
        return "Interval training session";
      default:
        return session.instructions;
    }
  };

  // Helper function to format duration from minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Load mission data on mount
  useEffect(() => {
    loadTodaysMission();
  }, []);

  return {
    todaysMission,
    isLoading,
    error,
    refreshMission,
    updateMissionAfterCompletion,
    getWidgetState,
    getMissionDescription,
    formatDuration,
  };
};
