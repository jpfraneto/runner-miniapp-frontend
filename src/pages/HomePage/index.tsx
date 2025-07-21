import React, { useEffect, useState } from "react";
import AppLayout from "../../shared/layouts/AppLayout";
import WeeklyLeaderboard from "@/shared/components/WeeklyLeaderboard";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import WeekCountdown from "@/shared/components/WeekCountdown";
import withProtectionRoute from "@/hocs/withProtectionRoute";
import { getCurrentWeekWorkouts } from "@/services/runnerAPI";
import { Workout } from "@/shared/types/workout";
import styles from "./HomePage.module.scss";

function HomePage(): React.ReactNode {
  const [weeklyStats, setWeeklyStats] = useState<{ totalKm: number; totalRuns: number } | null>(null);

  useEffect(() => {
    // Auto-refresh leaderboard every 30 seconds
    const leaderboardInterval = setInterval(() => {
      // Trigger refresh of leaderboard component by key change
      window.dispatchEvent(new CustomEvent('refreshLeaderboard'));
    }, 30000);

    // Auto-refresh workouts every 60 seconds
    const workoutsInterval = setInterval(() => {
      window.dispatchEvent(new CustomEvent('refreshWorkouts'));
    }, 60000);

    // Calculate weekly community stats
    const fetchWeeklyStats = async () => {
      try {
        const workouts = await getCurrentWeekWorkouts();
        const totalKm = workouts.reduce((sum, workout) => sum + parseFloat(workout.kilometers), 0);
        const totalRuns = workouts.length;
        setWeeklyStats({ totalKm, totalRuns });
      } catch (error) {
        console.error("Failed to fetch weekly stats:", error);
      }
    };

    fetchWeeklyStats();

    return () => {
      clearInterval(leaderboardInterval);
      clearInterval(workoutsInterval);
    };
  }, []);

  return (
    <AppLayout>
      <div className={styles.container}>
        <WeekCountdown />
        
        {weeklyStats && (
          <div className={styles.weeklyStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{weeklyStats.totalKm.toFixed(1)} km</span>
              <span className={styles.statLabel}>community distance this week</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{weeklyStats.totalRuns}</span>
              <span className={styles.statLabel}>total runs this week</span>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2>This Week's Leaderboard</h2>
          <WeeklyLeaderboard maxEntries={10} />
        </div>

        <div className={styles.section}>
          <h2>Recent Activity</h2>
          <WorkoutsFeed type="recent" maxEntries={20} />
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");