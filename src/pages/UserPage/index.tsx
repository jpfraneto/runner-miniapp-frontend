import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import { getUserWorkouts } from "@/services/runnerAPI";
import styles from "./UserPage.module.scss";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

const UserPage: React.FC = () => {
  const { fid } = useParams<{ fid: string }>();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<{
    username: string;
    pfpUrl: string;
    totalKm: number;
    totalRuns: number;
    avgPace: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!fid) return;

      try {
        setLoading(true);
        const response = await getUserWorkouts(parseInt(fid), 100);
        console.log("THE WORKOUTS HERE ARE:", response);

        if (response.runs.length > 0) {
          const firstWorkout = response.runs[0];
          const totalKm = response.runs.reduce(
            (sum, workout) => sum + workout.distanceMeters / 1000,
            0
          );
          const totalRuns = response.runs.length;

          // Calculate average pace
          const totalMinutes = response.runs.reduce(
            (sum, workout) => sum + workout.duration,
            0
          );
          const avgPaceMinutes = totalMinutes / totalKm;
          const avgPace = `${avgPaceMinutes.toFixed(2)} min/km`;

          setUserStats({
            username: firstWorkout.user.username,
            pfpUrl: firstWorkout.user.pfpUrl,
            totalKm,
            totalRuns,
            avgPace,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [fid]);

  if (!fid) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.error}>User not found</div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <LoaderIndicator />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>

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
                    {userStats.totalKm.toFixed(1)} km
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
          <h2>Recent Workouts</h2>
          <WorkoutsFeed type="user" userId={parseInt(fid)} limit={50} />
        </div>
      </div>
    </AppLayout>
  );
};

export default UserPage;
