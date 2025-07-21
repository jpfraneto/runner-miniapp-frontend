import React, { useState, useEffect } from "react";
import { getRecentWorkouts, getCurrentWeekWorkouts, getUserWorkouts } from "@/services/runnerAPI";
import { Workout } from "@/shared/types/workout";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import styles from "./WorkoutsFeed.module.scss";

interface WorkoutsFeedProps {
  type?: "recent" | "currentWeek" | "user";
  userId?: number;
  limit?: number;
  maxEntries?: number;
}

const WorkoutsFeed: React.FC<WorkoutsFeedProps> = ({
  type = "recent",
  userId,
  limit = 50,
  maxEntries
}) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Workout[];
        
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
        
        setWorkouts(maxEntries ? data.slice(0, maxEntries) : data);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
        setError("Failed to load workouts");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [type, userId, limit, maxEntries]);

  const handleWorkoutClick = (castHash: string) => {
    try {
      sdk.actions.viewCast({ hash: castHash });
    } catch (error) {
      console.error("Failed to view cast:", error);
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

  const loadMore = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      const newLimit = workouts.length + 20;
      
      let data: Workout[];
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
      
      setWorkouts(data);
    } catch (err) {
      console.error("Failed to load more workouts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading workouts...</p>
        </div>
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
      {workouts.length === 0 ? (
        <div className={styles.empty}>
          <p>No workouts found</p>
        </div>
      ) : (
        <>
          <div className={styles.workoutsList}>
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={styles.workoutItem}
                onClick={() => handleWorkoutClick(workout.castHash)}
              >
                <div className={styles.header}>
                  <div className={styles.userInfo}>
                    <img
                      src={workout.pfpUrl}
                      alt={workout.username}
                      className={styles.avatar}
                      onClick={(e) => handleUserClick(workout.fid, e)}
                    />
                    <div className={styles.userDetails}>
                      <div
                        className={styles.username}
                        onClick={(e) => handleUserClick(workout.fid, e)}
                      >
                        {workout.username}
                      </div>
                      <div className={styles.date}>
                        {formatDate(workout.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.castIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>

                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{workout.kilometers} km</div>
                    <div className={styles.statLabel}>distance</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{workout.minutes.toFixed(1)} min</div>
                    <div className={styles.statLabel}>time</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statValue}>{workout.pace} min/km</div>
                    <div className={styles.statLabel}>pace</div>
                  </div>
                </div>

                {workout.comment && (
                  <div className={styles.comment}>
                    {workout.comment}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!maxEntries && type === "recent" && workouts.length >= 20 && (
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
                onClick={() => navigate('/activity')}
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