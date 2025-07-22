import React, { useState, useEffect } from "react";
import {
  getRecentWorkouts,
  getCurrentWeekWorkouts,
  getUserWorkouts,
  flagRunningSession,
  WorkoutApiResponse,
} from "@/services/runnerAPI";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import styles from "./WorkoutsFeed.module.scss";
import LoaderIndicator from "../LoaderIndicator";
import { RunningSession } from "@/shared/types/running";

interface WorkoutsFeedProps {
  type?: "recent" | "currentWeek" | "user";
  userId?: number;
  limit?: number;
  maxEntries?: number;
  units?: "km" | "mi";
}

const WorkoutsFeed: React.FC<WorkoutsFeedProps> = ({
  type = "recent",
  userId,
  limit = 50,
  maxEntries,
  units = "km",
}) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<RunningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
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

        setWorkouts(maxEntries ? data.runs.slice(0, maxEntries) : data.runs);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
        setError("Failed to load workouts");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [type, userId, limit, maxEntries]);


  const handleViewCast = (castHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sdk.actions.viewCast({ hash: castHash });
    } catch (error) {
      console.error("Failed to view cast:", error);
    }
  };

  const handleFlagCast = async (castHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await flagRunningSession(castHash);
      alert("Running session has been flagged for review.");
    } catch (error) {
      console.error("Failed to flag cast:", error);
      alert("Failed to flag running session. Please try again.");
    }
  };

  const handleShareCast = (castHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sdk.actions.composeCast({ embeds: [castHash] });
    } catch (error) {
      console.error("Failed to share cast:", error);
    }
  };

  const handleUserClick = (fid: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${fid}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
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

  const calculatePace = (distanceMeters: string, duration: number): string => {
    const distanceKm = parseFloat(distanceMeters) / 1000;
    const totalMinutes = duration;

    if (distanceKm === 0 || totalMinutes === 0) return "--";

    const paceMinPerKm = totalMinutes / distanceKm;

    if (units === "mi") {
      const paceMinPerMile = paceMinPerKm * 1.60934;
      const paceMin = Math.floor(paceMinPerMile);
      const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, "0")}/mi`;
    } else {
      const paceMin = Math.floor(paceMinPerKm);
      const paceSec = Math.round((paceMinPerKm - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, "0")}/km`;
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

  if (loading) {
    return (
      <div className={styles.container}>
        <LoaderIndicator />
      </div>
    );
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
          <div className={styles.workoutsList}>
            {workouts?.map((workout) => {
              const distance =
                units === "km"
                  ? (workout.distanceMeters / 1000).toFixed(2)
                  : (workout.distanceMeters / 1609.34).toFixed(2);

              const distanceUnit = units === "mi" ? "mi" : "km";

              return (
                <div
                  key={workout.castHash}
                  className={styles.workoutItem}
                  onClick={(e) => handleUserClick(workout.fid, e)}
                >
                  <div className={styles.header}>
                    <div className={styles.userInfo}>
                      <img
                        src={workout.user.pfpUrl}
                        alt={workout.user.username}
                        className={styles.avatar}
                        onClick={(e) => handleUserClick(workout.fid, e)}
                      />
                      <div className={styles.userDetails}>
                        <div
                          className={styles.username}
                          onClick={(e) => handleUserClick(workout.fid, e)}
                        >
                          @{workout.user.username}
                        </div>
                        <div className={styles.date}>
                          {formatDate(workout.createdAt || "")}
                        </div>
                      </div>
                    </div>

                    <div className={styles.castActions}>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => handleViewCast(workout.castHash, e)}
                        title="View cast"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      <button
                        className={styles.actionButton}
                        onClick={(e) => handleFlagCast(workout.castHash, e)}
                        title="Flag cast"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                        >
                          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                          <line x1="4" y1="22" x2="4" y2="15" />
                        </svg>
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => handleShareCast(workout.castHash, e)}
                        title="Share cast"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16,6 12,2 8,6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <div className={styles.statValue}>
                        {distance} {distanceUnit}
                      </div>
                      <div className={styles.statLabel}>distance</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statValue}>
                        {formatDuration(workout.duration)}
                      </div>
                      <div className={styles.statLabel}>time</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statValue}>
                        {calculatePace(
                          workout.distanceMeters.toString(),
                          workout.duration
                        )}
                      </div>
                      <div className={styles.statLabel}>pace</div>
                    </div>
                  </div>

                  {/* {workout.comment && (
                    <div className={styles.comment}>{workout.comment}</div>
                  )} */}
                </div>
              );
            })}
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
    </div>
  );
};

export default WorkoutsFeed;
