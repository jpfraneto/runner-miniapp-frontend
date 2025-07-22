import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import { AuthContext } from "@/shared/providers/AppProvider";
import { RunningSession } from "@/shared/types/running";
import { RunningSession as RunningSessionType } from "@/shared/types/running";
import RunningSessionComponent from "@/shared/components/RunningSession";
import { getUserProfile } from "@/services/user";
import sdk from "@farcaster/frame-sdk";
import styles from "./RunnerPage.module.scss";
import { API_URL } from "@/config/api";

interface WeeklyStats {
  week: string;
  distance: number;
}

interface UserStats {
  totalDistance: number;
  totalRuns: number;
  totalTimeMinutes: number;
  currentStreak?: number;
  longestStreak?: number;
  averagePace?: string;
  weeklyStats: WeeklyStats[];
  recentRuns: RunningSession[];
}

interface UserProfileData {
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
    displayName?: string;
    totalDistance?: string;
    totalRuns?: number;
    totalTimeMinutes?: number;
    currentStreak?: number;
    longestStreak?: number;
    averagePace?: string;
  };
  stats?: UserStats;
  recentWorkouts?: RunningSessionType[];
  data?: {
    workouts: RunningSessionType[];
  };
}

function useUserProfile(fid: number) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setProfileData(null);

    getUserProfile(fid)
      .then((data) => {
        if (!isMounted) return;
        setProfileData(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "An error occurred");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fid]);

  return { profileData, isLoading, error };
}

const RunnerPage: React.FC = () => {
  const { fid } = useParams();
  const navigate = useNavigate();
  const { miniappContext } = useContext(AuthContext);

  const { profileData, isLoading, error } = useUserProfile(Number(fid));

  // Check if user can go back (has navigation history)
  const canGoBack = window.history.length > 1;

  // Check if current user is viewing their own profile
  const currentUserFid = miniappContext?.user?.fid;
  const isOwnProfile = currentUserFid === Number(fid);

  const formatTimeMinutes = (totalMinutes: number) => {
    if (!totalMinutes || isNaN(totalMinutes)) return "0m";
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);
    const days = totalDays % 30;
    const months = Math.floor(totalDays / 30);
    let result = "";
    if (months > 0) result += `${months}mo `;
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || result === "") result += `${minutes}m`;
    return result.trim();
  };

  // Show loading state while authentication is in progress
  if (!fid) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorText}>
              Failed to load profile: {error}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profileData) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorText}>No data available</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const user = profileData.user;
  const workouts =
    profileData.data?.workouts || profileData.recentWorkouts || [];
  const stats = profileData.stats;

  // Support both {user, data:{workouts}} and {user, stats, recentWorkouts}
  const totalDistance = user.totalDistance || stats?.totalDistance || 0;
  const totalRuns = user.totalRuns || stats?.totalRuns || 0;
  const totalTimeMinutes =
    user.totalTimeMinutes || stats?.totalTimeMinutes || 0;

  // Generate appropriate share text based on whether it's own profile or someone else's
  const generateShareText = () => {
    if (isOwnProfile) {
      return `Check out my running stats on /running \n\n🏃‍♂️ ${totalDistance} km total\n📋 ${totalRuns} runs shared\n⏱️ ${formatTimeMinutes(
        totalTimeMinutes
      )} time running\n\nJoin the community:`;
    } else {
      return `Check out @${
        user.username
      }'s running stats on /running \n\n🏃‍♂️ ${totalDistance} km total\n📋 ${totalRuns} runs shared\n⏱️ ${formatTimeMinutes(
        totalTimeMinutes
      )} time running\n\nJoin the community:`;
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header with user info and navigation */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            {canGoBack && (
              <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              className={styles.shareButton}
              onClick={() => {
                console.log(
                  "JUST BEFORE COMPOSING THE CAST",
                  `${API_URL}/embeds/user/${fid}`
                );
                sdk.actions.composeCast({
                  text: generateShareText(),
                  embeds: [`${API_URL}/embeds/user/${fid}`],
                });
              }}
              aria-label="Share profile"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16,6 12,2 8,6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
          {/* User Info with Stats List */}
          <div className={styles.userInfo}>
            <img
              src={user.pfpUrl}
              alt={user.username}
              className={styles.avatar}
            />
            <div className={styles.userDetails}>
              <h1 className={styles.displayName}>@{user.username}</h1>
              <p className={styles.fid}>Farcaster ID: {fid}</p>

              {/* Stats as Large Numbers */}
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <svg
                    className={styles.statIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18l-9-9v18z" />
                  </svg>
                  <div className={styles.statNumber}>{totalDistance}</div>
                </div>
                <div className={styles.statItem}>
                  <svg
                    className={styles.statIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                    <path d="M3 12h6m6 0h6" />
                  </svg>
                  <div className={styles.statNumber}>{totalRuns}</div>
                </div>
                <div className={styles.statItem}>
                  <svg
                    className={styles.statIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <div className={styles.statNumber}>
                    {Math.floor(totalTimeMinutes / 60)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Runs */}
        <div className={styles.runsSection}>
          <h2 className={styles.sectionTitle}>Recent Runs</h2>
          {workouts && workouts.length > 0 ? (
            <div className={styles.runsList}>
              {workouts.map((run: RunningSessionType) => (
                <RunningSessionComponent key={run.castHash} workout={run} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>
                No runs found. Start running and track your progress!
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RunnerPage;
