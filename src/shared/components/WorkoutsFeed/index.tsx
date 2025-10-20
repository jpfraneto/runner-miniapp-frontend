import React, { useState, useEffect } from "react";
import {
  getRecentWorkouts,
  getCurrentWeekWorkouts,
  getUserWorkouts,
  WorkoutApiResponse,
} from "@/services/runnerAPI";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import { FaEye, FaShare, FaTrash } from "react-icons/fa";
import { useAdmin } from "@/shared/hooks/admin/useAdmin";
import ConfirmModal from "@/shared/components/ConfirmModal";
import styles from "./WorkoutsFeed.module.scss";
import LoaderIndicator from "../LoaderIndicator";
import { RunningSession } from "@/shared/types/running";
import { API_URL } from "@/config/api";
import {
  getCurrentWeekNumber,
  getTimeUntilReset,
  formatCountdown,
  WEEK_ZERO_END_DATE,
} from "@/shared/utils/weekCalculation";
import { useUnits } from "@/shared/providers/UnitsProvider";

interface WorkoutsFeedProps {
  type?: "recent" | "currentWeek" | "user";
  userId?: number;
  limit?: number;
  maxEntries?: number;
  onDataFetched?: (workouts: RunningSession[]) => void;
  highlightCastHash?: string;
  renderWorkout?: (workout: RunningSession, index: number) => React.ReactNode;
  onHighlightedItemRef?: (ref: HTMLDivElement | null) => void;
}

const WorkoutsFeed: React.FC<WorkoutsFeedProps> = ({
  type = "recent",
  userId,
  limit = 50,
  maxEntries,
  onDataFetched,
  highlightCastHash,
  renderWorkout,
  onHighlightedItemRef,
}) => {
  const navigate = useNavigate();
  const { convertDistance, convertPace } = useUnits();
  const { isAdmin, deleteRunByHash, isDeletingRun } = useAdmin();
  const [workouts, setWorkouts] = useState<RunningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [runToDelete, setRunToDelete] = useState<{ castHash: string; username: string } | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: WorkoutApiResponse;

      switch (type) {
        case "currentWeek":
          data = await getCurrentWeekWorkouts();
          break;
        case "user":
          if (!userId) throw new Error("User ID required for user workouts");
          data = await getUserWorkouts(userId, limit);
          break;
        case "recent":
        default:
          data = await getRecentWorkouts(limit);
          break;
      }

      const workoutData = maxEntries
        ? data.runs.slice(0, maxEntries)
        : data.runs;
      setWorkouts(workoutData);

      if (onDataFetched) {
        onDataFetched(workoutData);
      }
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [type, userId, limit, maxEntries]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchWorkouts();
    };

    window.addEventListener("refreshWorkouts", handleRefresh);
    return () => window.removeEventListener("refreshWorkouts", handleRefresh);
  }, [type, userId, limit, maxEntries]);

  const handleViewCast = (castHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sdk.actions.viewCast({ hash: castHash });
    } catch (error) {
      console.error("Failed to view cast:", error);
    }
  };

  const handleShareCast = (castHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      console.log("SHARING CAST:", castHash);
      const embedURL = `${API_URL}/embeds/run/${castHash}`;
      console.log("EMBED URL:", embedURL);
      sdk.actions.composeCast({
        text: "",
        embeds: [embedURL],
      });
    } catch (error) {
      console.error("Failed to share cast:", error);
    }
  };

  const handleUserClick = (
    fid: number,
    e: React.MouseEvent,
    castHash?: string
  ) => {
    if (window.location.pathname.includes(`/user/${fid}`)) {
      return;
    }
    e.stopPropagation();
    sdk.haptics.impactOccurred("light");
    navigate(`/user/${fid}?castHash=${castHash}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Always use UTC for both now and date
    const now = new Date();
    const utcNow = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    );
    const utcDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      )
    );
    const diffTime = utcNow.getTime() - utcDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return "Today";
    }

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffTime / (1000 * 60));
        return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return utcDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getDayOfWeek = (dateString: string): number => {
    const date = new Date(dateString);
    return date.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  };

  const getDayClass = (dateString: string): string => {
    const dayOfWeek = getDayOfWeek(dateString);
    const dayClasses = [
      styles.sunday, // 0 - Sunday - violet
      styles.monday, // 1 - Monday - red
      styles.tuesday, // 2 - Tuesday - orange
      styles.wednesday, // 3 - Wednesday - yellow
      styles.thursday, // 4 - Thursday - green
      styles.friday, // 5 - Friday - blue
      styles.saturday, // 6 - Saturday - indigo
    ];
    return dayClasses[dayOfWeek] || "";
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const handleDeleteRun = (castHash: string, username: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRunToDelete({ castHash, username });
    setShowDeleteModal(true);
  };

  const confirmDeleteRun = async () => {
    if (!runToDelete) return;
    
    const success = await deleteRunByHash(runToDelete.castHash);
    if (success) {
      setShowDeleteModal(false);
      setRunToDelete(null);
      // Refresh the workouts feed
      fetchWorkouts();
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const newLimit = workouts?.length + 20;

      let data: WorkoutApiResponse;
      switch (type) {
        case "currentWeek":
          data = await getCurrentWeekWorkouts();
          break;
        case "user":
          if (!userId) return;
          data = await getUserWorkouts(userId, newLimit);
          break;
        case "recent":
        default:
          data = await getRecentWorkouts(newLimit);
          break;
      }
      console.log("THE DATA HERE IS:", data);
      setWorkouts(data.runs);
    } catch (err) {
      console.error("Failed to load more workouts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Function to calculate week number for a workout
  const getWorkoutWeekNumber = (workoutDate: string): number => {
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const timeDiff = new Date(workoutDate).getTime() - WEEK_ZERO_END_DATE.getTime();
    const weeksPassed = Math.floor(timeDiff / WEEK_MS);
    // Week 0 ended, so current week is weeksPassed + 1
    // But if we're still in week 0 (negative time), return 0
    return Math.max(0, weeksPassed + 1);
  };

  // Group workouts by week
  const groupWorkoutsByWeek = (workouts: RunningSession[]) => {
    const groups: { [weekNumber: number]: RunningSession[] } = {};

    workouts.forEach((workout) => {
      const weekNumber = getWorkoutWeekNumber(workout.createdAt || "");
      if (!groups[weekNumber]) {
        groups[weekNumber] = [];
      }
      groups[weekNumber].push(workout);
    });

    return groups;
  };

  // Week separator component
  const WeekSeparator: React.FC<{ weekNumber: number }> = ({ weekNumber }) => {
    const currentWeek = getCurrentWeekNumber();
    const isCurrentWeek = weekNumber === currentWeek;
    const timeUntilReset = getTimeUntilReset();

    // Get week-based background color
    const getWeekBackgroundClass = (week: number): string => {
      const weekColors = [
        styles.weekColor0, // Week 0
        styles.weekColor1, // Week 1
        styles.weekColor2, // Week 2
        styles.weekColor3, // Week 3
        styles.weekColor4, // Week 4
        styles.weekColor5, // Week 5
        styles.weekColor6, // Week 6
      ];
      return weekColors[week % 7] || styles.weekColor0;
    };

    return (
      <div
        className={`${styles.weekContainer} ${getWeekBackgroundClass(
          weekNumber
        )}`}
      >
        <div
          className={styles.weekSeparator}
          data-week={weekNumber}
          onClick={() => navigate(`/leaderboard?week=${weekNumber}`)}
        >
          <div className={styles.weekText}>
            Week {weekNumber}
            {isCurrentWeek && (
              <>
                <span className={styles.liveBadge}>LIVE</span>
                <span className={styles.countdown}>
                  {formatCountdown(timeUntilReset)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoaderIndicator />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {workouts?.length === 0 ? (
        <div className={styles.empty}>
          <p>No workouts found</p>
        </div>
      ) : (
        <>
          <div className={styles.workoutsTable}>
            {(() => {
              const workoutGroups = groupWorkoutsByWeek(workouts);
              const sortedWeekNumbers = Object.keys(workoutGroups)
                .map(Number)
                .sort((a, b) => b - a); // Sort by week number descending (newest first)

              return sortedWeekNumbers.map((weekNumber) => (
                <React.Fragment key={`week-${weekNumber}`}>
                  <WeekSeparator weekNumber={weekNumber} />
                  {workoutGroups[weekNumber].map((workout, index) => {
                    const convertedDistance = convertDistance(
                      workout.distanceMeters
                    );
                    const distance = convertedDistance.value.toFixed(2);
                    const distanceUnit = convertedDistance.unit;
                    const isHighlighted =
                      highlightCastHash === workout.castHash;

                    const workoutContent = (
                      <div
                        key={workout.castHash}
                        ref={isHighlighted ? onHighlightedItemRef : undefined}
                        className={`${styles.workoutRow} ${getDayClass(
                          workout.createdAt || ""
                        )} ${isHighlighted ? styles.highlightedWorkout : ""}`}
                        onClick={(e) =>
                          handleUserClick(workout.fid, e, workout.castHash)
                        }
                      >
                        <img
                          src={workout.user.pfpUrl}
                          alt={workout.user.username}
                          className={styles.avatar}
                        />
                        <div className={styles.userInfoContainer}>
                          <div className={styles.userColumn}>
                            <div className={styles.userInfo}>
                              <div className={styles.username}>
                                @{workout.user.username}
                              </div>
                              <div className={styles.date}>
                                {formatDate(workout.createdAt || "")}
                              </div>
                            </div>
                          </div>

                          <div className={styles.statsColumn}>
                            <div className={styles.statGroup}>
                              <span className={styles.statValue}>
                                {distance} {distanceUnit}
                              </span>
                              <span className={styles.statLabel}>-</span>
                              <span className={styles.statValue}>
                                {formatDuration(workout.duration)}
                              </span>
                              <span className={styles.statLabel}>-</span>
                              <span className={styles.statValue}>
                                {convertPace(
                                  workout.distanceMeters,
                                  workout.duration
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.actionsColumn}>
                          <div className={styles.topActionRow}>
                            {isAdmin && (
                              <button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={(e) => handleDeleteRun(workout.castHash, workout.user.username, e)}
                                title="Delete run"
                              >
                                <FaTrash />
                              </button>
                            )}
                            <button
                              className={styles.actionButton}
                              onClick={(e) => handleViewCast(workout.castHash, e)}
                              title="View cast"
                            >
                              <FaEye />
                            </button>
                          </div>
                          <button
                            className={styles.actionButton}
                            onClick={(e) =>
                              handleShareCast(workout.castHash, e)
                            }
                            title="Share cast"
                          >
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    );

                    // If custom renderer is provided and this is the highlighted workout, use it
                    if (renderWorkout && isHighlighted) {
                      return renderWorkout(workout, index);
                    }

                    return workoutContent;
                  })}
                </React.Fragment>
              ));
            })()}
          </div>

          {!maxEntries && type === "recent" && workouts?.length >= 20 && (
            <div className={styles.loadMore}>
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={styles.loadMoreButton}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {maxEntries && workouts.length >= maxEntries && (
            <div className={styles.viewMore}>
              <button
                onClick={() => navigate("/activity")}
                className={styles.viewMoreButton}
              >
                View All Activity
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Run Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRunToDelete(null);
        }}
        onConfirm={confirmDeleteRun}
        title="Delete Run"
        message={`Are you sure you want to delete @${runToDelete?.username}'s run? This action cannot be undone.`}
        confirmText="Delete Run"
        cancelText="Cancel"
        isLoading={isDeletingRun}
        variant="danger"
      />
    </div>
  );
};

export default WorkoutsFeed;
