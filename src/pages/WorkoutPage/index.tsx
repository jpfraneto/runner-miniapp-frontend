// Dependencies
import React, { useState } from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";
import WorkoutUploadFlow from "@/shared/components/WorkoutUploadFlow";

// Hooks
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";
import { useWorkoutHistory } from "@/shared/hooks/user/useWorkoutHistory";

// StyleSheet
import styles from "./WorkoutPage.module.scss";

// SDK
import sdk from "@farcaster/frame-sdk";

// Types
import { RunningSession } from "@/shared/types/running";

const WorkoutPage: React.FC = () => {
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const { todaysMission, isLoading: missionLoading } = useTodaysMission();
  const { data: workoutHistory, isLoading: historyLoading } =
    useWorkoutHistory();

  const handleUploadComplete = (_runningSession: RunningSession) => {
    setShowUploadFlow(false);
    sdk.haptics.notificationOccurred("success");
  };

  const handleCloseUploadFlow = () => {
    setShowUploadFlow(false);
  };

  const handleLogWorkout = () => {
    sdk.haptics.selectionChanged();
    setShowUploadFlow(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Typography
            variant="gta"
            weight="wide"
            size={24}
            lineHeight={20}
            className={styles.title}
          >
            WORKOUT
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            lineHeight={18}
            className={styles.subtitle}
          >
            Track your runs and stay motivated
          </Typography>
        </div>

        {/* Today's Mission */}
        <div className={styles.missionSection}>
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            lineHeight={20}
            className={styles.sectionTitle}
          >
            Today's Mission
          </Typography>

          {missionLoading ? (
            <div className={styles.loadingCard}>
              <Typography size={14}>Loading mission...</Typography>
            </div>
          ) : todaysMission?.plannedSession ? (
            <div className={styles.missionCard}>
              <div className={styles.missionHeader}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={14}
                  className={styles.missionTitle}
                >
                  {todaysMission.plannedSession.sessionType
                    .replace("_", " ")
                    .toUpperCase()}
                </Typography>
                {todaysMission.hasCompletedToday && (
                  <div className={styles.completedBadge}>✅</div>
                )}
              </div>
              <Typography
                variant="geist"
                weight="regular"
                size={12}
                className={styles.missionDescription}
              >
                {todaysMission.plannedSession.instructions}
              </Typography>
              <div className={styles.missionStats}>
                {todaysMission.plannedSession.targetDistance && (
                  <div className={styles.stat}>
                    <Typography size={12} className={styles.statLabel}>
                      Distance
                    </Typography>
                    <Typography
                      size={14}
                      weight="medium"
                      className={styles.statValue}
                    >
                      {todaysMission.plannedSession.targetDistance}km
                    </Typography>
                  </div>
                )}
                {todaysMission.plannedSession.targetTime && (
                  <div className={styles.stat}>
                    <Typography size={12} className={styles.statLabel}>
                      Duration
                    </Typography>
                    <Typography
                      size={14}
                      weight="medium"
                      className={styles.statValue}
                    >
                      {todaysMission.plannedSession.targetTime}min
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.noMissionCard}>
              <Typography size={14}>No mission available today</Typography>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsSection}>
          <Button
            variant="primary"
            caption={
              todaysMission?.hasCompletedToday
                ? "✅ Run Logged Today"
                : "📱 Log Today's Run"
            }
            onClick={handleLogWorkout}
            disabled={missionLoading || todaysMission?.hasCompletedToday}
            className={styles.logButton}
          />
        </div>

        {/* Recent Workouts */}
        <div className={styles.historySection}>
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            lineHeight={20}
            className={styles.sectionTitle}
          >
            Recent Workouts
          </Typography>

          {historyLoading ? (
            <div className={styles.loadingCard}>
              <Typography size={14}>Loading history...</Typography>
            </div>
          ) : workoutHistory?.workouts && workoutHistory.workouts.length > 0 ? (
            <div className={styles.historyList}>
              {workoutHistory.workouts
                .slice(0, 5)
                .map((workout: RunningSession, index: number) => (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.workoutInfo}>
                      <Typography
                        size={14}
                        weight="medium"
                        className={styles.workoutDate}
                      >
                        {formatDate(
                          workout.completedDate || new Date().toISOString()
                        )}
                      </Typography>
                      <Typography size={12} className={styles.workoutDetails}>
                        {Number(workout.distance)}km{" "}
                        {Math.floor(Number(workout.duration))}:
                        {((Number(workout.duration) % 1) * 60)
                          .toFixed(0)
                          .padStart(2, "0")}{" "}
                        {workout.pace}
                      </Typography>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={styles.noHistoryCard}>
              <Typography size={14}>No workout history yet</Typography>
            </div>
          )}
        </div>

        {/* Upload Flow Modal */}
        {showUploadFlow && (
          <WorkoutUploadFlow
            onComplete={handleUploadComplete}
            onClose={handleCloseUploadFlow}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default WorkoutPage;
