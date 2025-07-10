import React from "react";
import Typography from "../Typography";
import { useWorkoutHistory } from "@/shared/hooks/user/useWorkoutHistory";
import { formatDuration } from "@/shared/utils/workoutAnalysis";
import styles from "./RecentRunsFeed.module.scss";

const RecentRunsFeed: React.FC = () => {
  const { data: workoutHistory, isLoading, error } = useWorkoutHistory();
  console.log("WORKOUT HISTORY", workoutHistory);

  if (isLoading) {
    return (
      <div className={styles.feedContainer}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.feedTitle}
        >
          Recent Runs
        </Typography>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <Typography variant="geist" size={14} className={styles.loadingText}>
            Loading your runs...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedContainer}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.feedTitle}
        >
          Recent Runs
        </Typography>
        <div className={styles.errorState}>
          <Typography variant="geist" size={14} className={styles.errorText}>
            Failed to load runs
          </Typography>
        </div>
      </div>
    );
  }

  const workouts = workoutHistory?.workouts || [];

  if (workouts.length === 0) {
    return (
      <div className={styles.feedContainer}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.feedTitle}
        >
          Recent Runs
        </Typography>
        <div className={styles.emptyState}>
          <Typography variant="geist" size={14} className={styles.emptyText}>
            No runs yet. Upload your first run to get started!
          </Typography>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className={styles.feedContainer}>
      <Typography
        variant="geist"
        weight="medium"
        size={16}
        className={styles.feedTitle}
      >
        Recent Runs
      </Typography>

      <div className={styles.runsList}>
        {workouts.slice(0, 3).map((workout) => (
          <div key={workout.id} className={styles.runItem}>
            <div className={styles.runHeader}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.runDate}
              >
                {formatDate(workout.completedDate || new Date().toISOString())}
              </Typography>
              {workout.isPersonalBest && (
                <div className={styles.pbBadge}>
                  <span className={styles.pbIcon}>🏆</span>
                </div>
              )}
            </div>

            <div className={styles.runStats}>
              <div className={styles.statGroup}>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={20}
                  className={styles.statValue}
                >
                  {Number(workout.distance).toFixed(1)}
                </Typography>
                <Typography
                  variant="geist"
                  size={10}
                  className={styles.statLabel}
                >
                  {workout.units || "km"}
                </Typography>
              </div>

              <div className={styles.statGroup}>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={20}
                  className={styles.statValue}
                >
                  {formatDuration(workout.duration)}
                </Typography>
                <Typography
                  variant="geist"
                  size={10}
                  className={styles.statLabel}
                >
                  time
                </Typography>
              </div>

              <div className={styles.statGroup}>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={20}
                  className={styles.statValue}
                >
                  {workout.pace}
                </Typography>
                <Typography
                  variant="geist"
                  size={10}
                  className={styles.statLabel}
                >
                  pace
                </Typography>
              </div>
            </div>

            {(workout.calories || workout.avgHeartRate) && (
              <div className={styles.additionalStats}>
                {workout.calories && (
                  <span className={styles.additionalStat}>
                    🔥 {workout.calories.toLocaleString()}
                  </span>
                )}
                {workout.avgHeartRate && (
                  <span className={styles.additionalStat}>
                    ❤️ {workout.avgHeartRate}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {workouts.length > 3 && (
        <div className={styles.viewMore}>
          <Typography variant="geist" size={12} className={styles.viewMoreText}>
            +{workouts.length - 3} more runs
          </Typography>
        </div>
      )}
    </div>
  );
};

export default RecentRunsFeed;
