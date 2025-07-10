import React, { useState, useEffect } from "react";
import { RunningSession } from "@/shared/types/running";
import RunningSessionComponent from "../RunningSession";
import styles from "./UserProfile.module.scss";
import { getUserProfile } from "@/services/user";
import sdk from "@farcaster/frame-sdk";

interface UserProfileProps {
  userId: number;
  onBack: () => void;
  onEdit: (workout: RunningSession) => void;
}

interface UserStats {
  totalDistance: number;
  totalDuration: number;
  averagePace: string;
  totalWorkouts: number;
  personalBests: number;
  favoriteDistance: string;
  totalCalories: number;
}

interface UserProfileData {
  user: {
    fid: number;
    username: string;
    pfpUrl: string;
    displayName?: string;
    banExpiresAt?: string | null;
    bannedAt?: string | null;
    coachPersonality?: string;
    createdAt?: string;
    currentGoal?: string | null;
    currentStreak?: number;
    fitnessLevel?: string;
    followers?: number;
    following?: number;
    hasActiveTrainingPlan?: boolean;
    hasCompletedOnboarding?: boolean;
    id?: number;
    invalidWorkoutSubmissions?: number;
    isBanned?: boolean;
    lastActiveAt?: string;
    lastBanExpires?: string | null;
    lastBanReason?: string | null;
    lastBanStart?: string | null;
    lastRunDate?: string;
    lastRunReminderSent?: string | null;
    lifetimeTokensEarned?: number;
    longestStreak?: number;
    notificationToken?: string | null;
    notificationUrl?: string | null;
    notificationsEnabled?: boolean;
    preferredWeeklyFrequency?: number;
    privateProfile?: boolean;
    reminderTime?: string;
    role?: string;
    runnerTokens?: number;
    shareByDefault?: boolean;
    statsLastCalculated?: string | null;
    timezone?: string;
    tokensSpent?: number;
    totalBans?: number;
    totalDistance?: string;
    totalLikes?: number;
    totalRuns?: number;
    totalShares?: number;
    totalTimeMinutes?: number;
    unitPreference?: string;
    updatedAt?: string;
    weeklyCompletions?: number;
  };
  stats: UserStats;
  recentWorkouts: RunningSession[];
  data?: {
    workouts: RunningSession[];
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

function formatTimeMinutes(totalMinutes: number) {
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
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onBack,
  onEdit,
}) => {
  const { profileData, isLoading, error } = useUserProfile(userId);
  console.log("THE PROFILE DATA HERE IS:", profileData);

  if (isLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
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
            Back
          </button>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingText}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
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
            Back
          </button>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorText}>
            Failed to load profile: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  // Support both {user, data:{workouts}} and {user, stats, recentWorkouts}
  const user = profileData.user;
  const workouts =
    profileData.data?.workouts || profileData.recentWorkouts || [];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
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
          Back
        </button>
      </div>

      {/* Profile Overview */}
      <div className={styles.profileCard}>
        {/* Share Button at top right */}
        <button
          className={styles.profileShareButton}
          title="Share profile"
          onClick={() => {
            sdk.actions.composeCast({
              text: `@${
                profileData.user.username
              }'s /running stats:\n\nTotal Distance: ${
                user.totalDistance
              } kms\nTotal Runs Shared: ${
                user.totalRuns
              }\nTotal Time Running: ${formatTimeMinutes(
                Number(user.totalTimeMinutes) || 0
              )}\nCheck others here:`,
              embeds: [`https://runnercoin.lat`],
            });
          }}
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
        </button>
        <div className={styles.userInfo}>
          <img
            src={user.pfpUrl}
            alt={user.username}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <h1
              onClick={() => {
                sdk.actions.viewProfile({ fid: user.fid });
              }}
              className={styles.displayName}
            >
              @{user.username}
            </h1>
            <p className={styles.fid}>FID: {user.fid}</p>
          </div>
        </div>
        {/* Modern Stats Card */}
        <div className={styles.statsCard}>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <span
                className={styles.statIcon}
                role="img"
                aria-label="distance"
              >
                🏃‍♂️
              </span>
              <span className={styles.statValue}>
                {user.totalDistance || 0}
              </span>
              <span className={styles.statLabel}>km</span>
              <span className={styles.statDesc}>Distance</span>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statIcon} role="img" aria-label="runs">
                📋
              </span>
              <span className={styles.statValue}>{user.totalRuns || 0}</span>
              <span className={styles.statLabel}>runs</span>
              <span className={styles.statDesc}>Total Runs</span>
            </div>
          </div>
          <div className={styles.statBlock + " " + styles.timeBlock}>
            <span className={styles.statIcon} role="img" aria-label="time">
              ⏱️
            </span>
            <span className={styles.statValue}>
              {formatTimeMinutes(Number(user.totalTimeMinutes) || 0)}
            </span>
            <span className={styles.statLabel}>time</span>
            <span className={styles.statDesc}>Total Time</span>
          </div>
        </div>
      </div>

      {/* Running Sessions */}
      <div className={styles.workoutsSection}>
        <h2 className={styles.sectionTitle}>Running Sessions</h2>
        {workouts.length > 0 ? (
          <div className={styles.workoutsList}>
            {workouts.map((workout) => (
              <RunningSessionComponent
                key={workout.id}
                workout={workout}
                isOwner={false}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyText}>No workouts found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
