import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Components
import WorkoutUploadFlow from "../WorkoutUploadFlow";

// Hooks
// import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";

// Types
import { CompletedRun } from "@/shared/hooks/user/useUploadWorkout";

// Styles
import styles from "./RunnerWidget.module.scss";

export type RunType = "fixed_time" | "fixed_distance" | "intervals";
export type WidgetStateType = "completed" | "pending" | "tomorrow" | "hidden";

interface TodaysMissionData {
  hasCompletedToday: boolean;
  todaysCompletedRun?: CompletedRun;
  todaysPlannedSession?: {
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
  };
  isRestDay: boolean;
}

interface RunnerWidgetProps {
  isInsideMiniapp?: boolean;
  setIsInsideMiniapp?: (isInsideMiniapp: boolean) => void;
}

// Session symbols for different run types
const SessionSymbols = {
  fixed_time: (
    <svg viewBox="0 0 100 100" className={styles.sessionSymbol}>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <path d="M50 10 L55 20 L45 20 Z" fill="currentColor" />
      <path d="M90 50 L80 55 L80 45 Z" fill="currentColor" />
      <path d="M50 90 L45 80 L55 80 Z" fill="currentColor" />
      <path d="M10 50 L20 45 L20 55 Z" fill="currentColor" />
    </svg>
  ),

  fixed_distance: (
    <svg viewBox="0 0 100 100" className={styles.sessionSymbol}>
      <path
        d="M10 80 Q30 20 50 50 Q70 80 90 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="10" cy="80" r="6" fill="currentColor" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <circle cx="90" cy="20" r="6" fill="currentColor" />
      <path d="M85 15 L95 10 L95 20 L90 20 Z" fill="currentColor" />
      <rect x="8" y="77" width="4" height="6" fill="currentColor" />
      <rect x="48" y="47" width="4" height="6" fill="currentColor" />
    </svg>
  ),

  intervals: (
    <svg viewBox="0 0 100 100" className={styles.sessionSymbol}>
      <rect
        x="10"
        y="70"
        width="12"
        height="20"
        fill="currentColor"
        opacity="0.7"
      />
      <rect x="25" y="40" width="12" height="50" fill="currentColor" />
      <rect x="40" y="20" width="12" height="70" fill="currentColor" />
      <rect x="55" y="40" width="12" height="50" fill="currentColor" />
      <rect
        x="70"
        y="70"
        width="12"
        height="20"
        fill="currentColor"
        opacity="0.7"
      />
      <rect x="85" y="40" width="12" height="50" fill="currentColor" />
      <circle cx="16" cy="65" r="2" fill="white" />
      <circle cx="31" cy="35" r="2" fill="white" />
      <circle cx="46" cy="15" r="2" fill="white" />
      <circle cx="61" cy="35" r="2" fill="white" />
      <circle cx="76" cy="65" r="2" fill="white" />
      <circle cx="91" cy="35" r="2" fill="white" />
    </svg>
  ),

  tomorrow: (
    <svg viewBox="0 0 100 100" className={styles.sessionSymbol}>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M50 20 Q60 35 50 50 Q40 65 50 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  ),
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

// Get mission description for planned sessions
const getMissionDescription = (
  plannedSession: TodaysMissionData["todaysPlannedSession"]
): string => {
  if (!plannedSession) return "";

  switch (plannedSession.sessionType) {
    case "fixed_time":
      return `Run for ${plannedSession.targetTime} minutes${
        plannedSession.targetPace ? ` at ${plannedSession.targetPace}` : ""
      }`;
    case "fixed_distance":
      return `Run ${plannedSession.targetDistance}km${
        plannedSession.targetPace ? ` at ${plannedSession.targetPace}` : ""
      }`;
    case "intervals":
      if (plannedSession.intervalStructure) {
        const intervals = plannedSession.intervalStructure.intervals[0];
        return `${intervals.repetitions}x ${intervals.distance}m @ ${intervals.pace} (${intervals.rest}s rest)`;
      }
      return "Interval training session";
    default:
      return plannedSession.instructions;
  }
};

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
    };
  }
};

const RunnerWidget: React.FC<RunnerWidgetProps> = ({ setIsInsideMiniapp }) => {
  const [todaysMission, setTodaysMission] = useState<TodaysMissionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showCoachMessage, setShowCoachMessage] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Fetch today's mission data on component mount
  useEffect(() => {
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

    loadTodaysMission();
  }, []);

  // Show coach message with delay
  useEffect(() => {
    if (!todaysMission || isLoading) return;

    const timer = setTimeout(() => {
      setShowCoachMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [todaysMission, isLoading]);

  // Get coach message based on current state
  const getCoachMessage = (): string => {
    if (!todaysMission) return "";

    if (todaysMission.hasCompletedToday) {
      return "Amazing work today! 🔥 Keep that momentum going!";
    }

    if (todaysMission.isRestDay) {
      return "Rest day vibes! 😌 Recovery is just as important as training";
    }

    return "Ready to crush today's mission? 🏃‍♂️ Let's get moving!";
  };

  // Handle widget minimize/expand
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Handle session action (either upload or view details)
  const handleSessionAction = () => {
    if (todaysMission?.hasCompletedToday) {
      // If completed, navigate to details or miniapp
      if (setIsInsideMiniapp) {
        setIsInsideMiniapp(true);
      }
    } else {
      // If not completed, show upload flow
      setShowUploadFlow(true);
    }
  };

  // Handle upload completion
  const handleUploadComplete = (completedRun: CompletedRun) => {
    setShowUploadFlow(false);
    setTodaysMission((prev) => ({
      ...prev,
      hasCompletedToday: true,
      todaysCompletedRun: completedRun,
      isRestDay: false,
    }));
  };

  // Handle upload close
  const handleUploadClose = () => {
    setShowUploadFlow(false);
  };

  // Don't show widget in miniapp context
  if (location.pathname.startsWith("/miniapp")) {
    return null;
  }

  // Hidden/minimized state
  if (isMinimized) {
    return (
      <div className={styles.minimizedContainer}>
        <button
          className={styles.minimizedButton}
          onClick={handleToggleMinimize}
          aria-label="Expand runner widget"
        >
          🏃‍♂️
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.widgetContainer}>
        <div className={styles.loadingWidget}>
          <div className={styles.loadingSpinner} />
          <span>Loading your mission...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.widgetContainer}>
        <div className={styles.errorWidget}>
          <span>⚠️ {error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // No mission data
  if (!todaysMission) {
    return null;
  }

  // Determine widget state and symbol
  const getWidgetState = (): WidgetStateType => {
    if (todaysMission.hasCompletedToday) return "completed";
    if (todaysMission.isRestDay) return "tomorrow";
    return "pending";
  };

  const widgetState = getWidgetState();
  const currentSessionType =
    todaysMission.todaysPlannedSession?.sessionType || "fixed_distance";
  const currentSymbol =
    SessionSymbols[currentSessionType] || SessionSymbols.tomorrow;

  return (
    <>
      <div className={styles.widgetContainer}>
        {/* AI Coach Speech Bubble */}
        {showCoachMessage && getCoachMessage() && (
          <div className={styles.coachBubbleContainer}>
            <div
              className={`coach-bubble ${showCoachMessage ? "visible" : ""}`}
            >
              <div className="bubble-content">
                <p>{getCoachMessage()}</p>
                <button
                  onClick={() => setShowCoachMessage(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              <div className="bubble-tail"></div>
            </div>
          </div>
        )}

        {/* Main Widget */}
        <div className={`${styles.widget} ${styles[widgetState]}`}>
          {/* Hide button */}
          <button
            onClick={handleToggleMinimize}
            className={styles.minimizeButton}
            aria-label="Minimize widget"
          >
            ×
          </button>

          {/* Content based on state */}
          <div className={styles.content}>
            {/* COMPLETED STATE - User already finished today's workout */}
            {widgetState === "completed" &&
              todaysMission.todaysCompletedRun && (
                <div className={styles.stateContent}>
                  <div className={styles.symbolContainer}>{currentSymbol}</div>
                  <div className={styles.stateInfo}>
                    <h3>Session Complete ✅</h3>
                    <div className={styles.completionStats}>
                      <span className={styles.stat}>
                        {todaysMission.todaysCompletedRun.distance}km
                      </span>
                      <span className={styles.statSeparator}>•</span>
                      <span className={styles.stat}>
                        {formatDuration(
                          todaysMission.todaysCompletedRun.duration
                        )}
                      </span>
                      <span className={styles.statSeparator}>•</span>
                      <span className={styles.stat}>
                        {todaysMission.todaysCompletedRun.pace}
                      </span>
                    </div>

                    {/* Additional stats if available */}
                    {(todaysMission.todaysCompletedRun.calories ||
                      todaysMission.todaysCompletedRun.avgHeartRate) && (
                      <div className={styles.additionalStats}>
                        {todaysMission.todaysCompletedRun.avgHeartRate && (
                          <span className={styles.heartRate}>
                            ❤️ {todaysMission.todaysCompletedRun.avgHeartRate}{" "}
                            bpm
                          </span>
                        )}
                        {todaysMission.todaysCompletedRun.calories && (
                          <span className={styles.calories}>
                            🔥 {todaysMission.todaysCompletedRun.calories} cal
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSessionAction}
                    className={`${styles.actionButton} ${styles.completed}`}
                  >
                    View Details
                  </button>
                </div>
              )}

            {/* PENDING STATE - User needs to upload today's workout */}
            {widgetState === "pending" && (
              <div className={styles.stateContent}>
                <div className={styles.symbolContainer}>{currentSymbol}</div>
                <div className={styles.stateInfo}>
                  <h3>Today's Mission</h3>
                  {todaysMission.todaysPlannedSession ? (
                    <p className={styles.targetDescription}>
                      {getMissionDescription(
                        todaysMission.todaysPlannedSession
                      )}
                    </p>
                  ) : (
                    <p className={styles.targetDescription}>
                      Upload your run to track your progress!
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSessionAction}
                  className={`${styles.actionButton} ${styles.pending}`}
                >
                  📱 Upload Run Screenshots
                </button>
              </div>
            )}

            {/* REST DAY STATE - No workout planned */}
            {widgetState === "tomorrow" && (
              <div className={styles.stateContent}>
                <div className={styles.symbolContainer}>
                  {SessionSymbols.tomorrow}
                </div>
                <div className={styles.stateInfo}>
                  <h3>Rest Day</h3>
                  <p className={styles.restMessage}>
                    Recovery is progress too 💪
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Upload Flow */}
      {showUploadFlow && (
        <WorkoutUploadFlow
          onComplete={handleUploadComplete}
          onClose={handleUploadClose}
          plannedSessionId={todaysMission?.todaysPlannedSession?.id}
        />
      )}
    </>
  );
};

export default RunnerWidget;
