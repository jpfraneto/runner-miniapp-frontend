import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import { RunningSession } from "@/shared/types/running";
import { useRunningSessionByCastHash } from "@/shared/hooks/user/useRunningSessionByCastHash";
import { useSmartNavigation } from "@/shared/hooks/navigation/useSmartNavigation";
import { useUnits } from "@/shared/providers/UnitsProvider";
import styles from "./RunDetailPage.module.scss";

const RunDetailPage: React.FC = () => {
  const { castHash } = useParams<{ castHash: string }>();
  const { goBack } = useSmartNavigation();
  const { formatDistance, convertPace } = useUnits();
  const [userWorkouts, setUserWorkouts] = useState<RunningSession[]>([]);
  const [userStats, setUserStats] = useState<{
    username: string;
    pfpUrl: string;
    totalMeters: number;
    totalRuns: number;
    avgPace: string;
  } | null>(null);
  const [travelingToTarget, setTravelingToTarget] = useState(false);
  const [showRunner, setShowRunner] = useState(false);
  const targetRunRef = useRef<HTMLDivElement>(null);

  // Use the existing hook to fetch the target run
  const {
    data: targetRun,
    isLoading: loading,
    error,
  } = useRunningSessionByCastHash(castHash);

  useEffect(() => {
    // Once user workouts are loaded and target run is found, start the journey
    if (userWorkouts.length > 0 && targetRun && !travelingToTarget) {
      const timer = setTimeout(() => {
        setTravelingToTarget(true);
        setShowRunner(true);

        // After runner animation, scroll to target
        const scrollTimer = setTimeout(() => {
          targetRunRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Hide runner after reaching target
          const hideTimer = setTimeout(() => {
            setShowRunner(false);
          }, 2000);

          return () => clearTimeout(hideTimer);
        }, 2000);

        return () => clearTimeout(scrollTimer);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [userWorkouts, targetRun, travelingToTarget]);

  const handleWorkoutsDataFetched = (workouts: RunningSession[]) => {
    setUserWorkouts(workouts);

    if (workouts.length > 0) {
      const firstWorkout = workouts[0];
      const totalMeters = workouts.reduce(
        (sum, workout) => sum + workout.distanceMeters,
        0
      );
      const totalRuns = workouts.length;

      const totalMinutes = workouts.reduce(
        (sum, workout) => sum + workout.duration,
        0
      );
      const avgPace = convertPace(totalMeters, totalMinutes);

      setUserStats({
        username: firstWorkout.user.username,
        pfpUrl: firstWorkout.user.pfpUrl,
        totalMeters,
        totalRuns,
        avgPace,
      });
    }
  };

  if (loading || !targetRun) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingRectangle}>
              <img
                src="/runner.gif"
                alt="Loading..."
                className={styles.runnerGif}
              />
            </div>
            <p className={styles.loadingText}>Time traveling to run...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h2>Run not found</h2>
            <p>The run you're looking for doesn't exist or has been removed.</p>
            <button onClick={goBack} className={styles.backButton}>
              ← Go Back
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        <button onClick={goBack} className={styles.backButton}>
          ← Back
        </button>

        {/* Traveling Runner Animation */}
        <AnimatePresence>
          {showRunner && (
            <motion.div
              initial={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%) rotate(90deg)",
                zIndex: 1000,
              }}
              animate={{
                top: targetRunRef.current
                  ? `${targetRunRef.current.offsetTop + window.scrollY}px`
                  : "50vh",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className={styles.travelingRunner}
            >
              <img
                src="/runner.gif"
                alt="Traveling through time..."
                className={styles.travelingRunnerGif}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {userStats && (
          <div className={styles.profileHeader}>
            <img
              src={userStats.pfpUrl}
              alt={userStats.username}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <h1 className={styles.username}>{userStats.username}</h1>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {formatDistance(userStats.totalMeters)}
                  </span>
                  <span className={styles.statLabel}>total distance</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {userStats.totalRuns}
                  </span>
                  <span className={styles.statLabel}>total runs</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{userStats.avgPace}</span>
                  <span className={styles.statLabel}>avg pace</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <WorkoutsFeedWrapper
            targetRun={targetRun}
            targetRunRef={targetRunRef}
            onDataFetched={handleWorkoutsDataFetched}
          />
        </div>
      </div>
    </AppLayout>
  );
};

// Custom WorkoutsFeed wrapper to highlight target run
const WorkoutsFeedWrapper: React.FC<{
  targetRun: RunningSession;
  targetRunRef: React.RefObject<HTMLDivElement>;
  onDataFetched: (workouts: RunningSession[]) => void;
}> = ({ targetRun, targetRunRef, onDataFetched }) => {
  return (
    <div className={styles.workoutsFeedWrapper}>
      <WorkoutsFeed
        type="user"
        userId={targetRun.fid}
        limit={100}
        onDataFetched={onDataFetched}
        highlightCastHash={targetRun.castHash}
        onHighlightedItemRef={(ref) => {
          if (ref) {
            (targetRunRef as any).current = ref;
          }
        }}
      />
    </div>
  );
};

export default RunDetailPage;
