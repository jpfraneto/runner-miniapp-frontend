import { RunningSession } from "@/shared/types/running";

export type WorkoutType =
  | "fixed_distance"
  | "fixed_time"
  | "intervals"
  | "unknown";

export interface WorkoutAnalysis {
  type: WorkoutType;
  confidence: number;
  reasoning: string;
}

/**
 * Analyzes a completed run to determine the workout type
 */
export const analyzeWorkoutType = (
  completedRun: RunningSession
): WorkoutAnalysis => {
  const { distance, duration, rawText } = completedRun;

  // Check for interval indicators in raw text
  const intervalKeywords = [
    "interval",
    "intervals",
    "repetition",
    "reps",
    "sets",
    "workout",
    "training",
    "speed work",
    "tempo",
    "fartlek",
    "recovery",
    "rest",
    "warmup",
    "cooldown",
  ];

  const hasIntervalKeywords = intervalKeywords.some((keyword) =>
    (rawText || "").toLowerCase().includes(keyword)
  );

  // Check for intervals data that might indicate interval training
  const hasIntervals =
    completedRun.intervals && completedRun.intervals.length > 0;

  // Analyze pace consistency (intervals usually have more pace variation)
  const paceVariation = analyzePaceConsistency(completedRun);

  // Determine workout type based on analysis
  if (hasIntervalKeywords || hasIntervals || paceVariation > 0.3) {
    return {
      type: "intervals",
      confidence: 0.8,
      reasoning: "Detected interval training indicators in workout data",
    };
  }

  // For fixed distance vs fixed time, we need to look at the planned session
  // Since we don't have that data in the completed run, we'll make an educated guess
  // based on common patterns

  // Long runs (>10km) are usually fixed distance
  if (distance && Number(distance) > 10) {
    return {
      type: "fixed_distance",
      confidence: 0.9,
      reasoning:
        "Long distance run (>10km) - typically fixed distance training",
    };
  }

  // Short runs with round time numbers might be fixed time
  if (duration && duration <= 60 && isRoundTime(duration)) {
    return {
      type: "fixed_time",
      confidence: 0.7,
      reasoning: "Short duration with round time - likely fixed time training",
    };
  }

  // Default to fixed distance for most runs
  return {
    type: "fixed_distance",
    confidence: 0.6,
    reasoning: "Standard run - assumed fixed distance training",
  };
};

/**
 * Analyzes pace consistency to detect intervals
 */
const analyzePaceConsistency = (_completedRun: RunningSession): number => {
  // For now, we'll use a simple heuristic
  // In a real implementation, you'd analyze splits data
  return 0.1; // Low variation by default
};

/**
 * Checks if a time value is "round" (ends in 0 or 5 minutes)
 */
const isRoundTime = (timeInMinutes: number): boolean => {
  const minutes = Math.floor(Number(timeInMinutes));
  return minutes % 5 === 0;
};

/**
 * Formats duration from minutes to HH:MM:SS
 */
export const formatDuration = (minutes: number): string => {
  const numMinutes = Number(minutes);
  const hours = Math.floor(numMinutes / 60);
  const mins = Math.floor(numMinutes % 60);
  const secs = Math.floor((numMinutes % 1) * 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Gets workout type icon
 */
export const getWorkoutTypeIcon = (type: WorkoutType): string => {
  switch (type) {
    case "fixed_distance":
      return "📏";
    case "fixed_time":
      return "⏱️";
    case "intervals":
      return "🏃‍♂️";
    default:
      return "🏃‍♀️";
  }
};

/**
 * Gets workout type label
 */
export const getWorkoutTypeLabel = (type: WorkoutType): string => {
  switch (type) {
    case "fixed_distance":
      return "Fixed Distance";
    case "fixed_time":
      return "Fixed Time";
    case "intervals":
      return "Interval Training";
    default:
      return "Running Session";
  }
};
