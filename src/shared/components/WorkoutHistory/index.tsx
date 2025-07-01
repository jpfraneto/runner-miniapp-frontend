// Dependencies
import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import Typography from "../Typography";

// Hooks
import { useWorkoutHistory } from "@/shared/hooks/user/useWorkoutHistory";

// StyleSheet
import styles from "./WorkoutHistory.module.scss";

const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const { data: workoutHistory, isLoading, error } = useWorkoutHistory();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.title}
        >
          Loading your runs...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.title}
        >
          Failed to load workout history
        </Typography>
      </div>
    );
  }

  const workouts = workoutHistory?.data || [];

  if (workouts.length === 0) {
    return (
      <div className={styles.container}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          className={styles.title}
        >
          No runs yet
        </Typography>
        <Typography
          variant="geist"
          weight="regular"
          size={14}
          className={styles.subtitle}
        >
          Upload your first run to get started!
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography
        variant="geist"
        weight="medium"
        size={16}
        className={styles.title}
      >
        Your Recent Runs
      </Typography>

      <div className={styles.workoutList}>
        {workouts.slice(0, 5).map((workout) => (
          <div
            key={workout.id}
            className={styles.workoutItem}
            onClick={() => navigate(`/runs/${workout.id}`)}
          >
            <div className={styles.workoutInfo}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.workoutDate}
              >
                {new Date(workout.completedDate).toLocaleDateString()}
              </Typography>
              <div className={styles.workoutStats}>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.stat}
                >
                  {workout.actualDistance} km
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.stat}
                >
                  {workout.actualTime} min
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.stat}
                >
                  {workout.actualPace}
                </Typography>
              </div>
            </div>
            {workout.isPersonalBest && (
              <div className={styles.personalBest}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={10}
                  className={styles.pbText}
                >
                  PB
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;
