// Dependencies
import React from "react";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";
import { useWeeklySummary } from "../../hooks/useWeeklySummary";

// Styles
import styles from "./PersonalOverview.module.scss";

interface PersonalOverviewProps {
  fid: number;
}

const PersonalOverview: React.FC<PersonalOverviewProps> = ({ fid }) => {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useProgressAnalytics(fid);
  const {
    data: weekly,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useWeeklySummary(fid);

  const isLoading = analyticsLoading || weeklyLoading;
  const hasError = analyticsError || weeklyError;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingText}>Loading your progress...</div>
        </div>
      </div>
    );
  }

  if (hasError || !analytics?.success || !weekly?.success) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorText}>Unable to load progress data</div>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { personalStats } = analytics.data;
  const { weeklyStats, streakInfo } = weekly.data;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={styles.container}>
      {/* Primary Stats Card */}
      <div className={styles.primaryCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Your Performance</h2>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{personalStats.totalRuns}</div>
            <div className={styles.statLabel}>Total Runs</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>
              {personalStats.totalDistance.toFixed(1)}km
            </div>
            <div className={styles.statLabel}>Distance</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>
              {formatTime(personalStats.totalTime)}
            </div>
            <div className={styles.statLabel}>Time</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{personalStats.averagePace}</div>
            <div className={styles.statLabel}>Avg Pace</div>
          </div>
        </div>
      </div>

      {/* Current Streak Display */}
      <div className={styles.streakCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Current Streak</h3>
        </div>
        <div className={styles.streakContent}>
          <div className={styles.streakNumber}>
            <span className={styles.streakValue}>
              {personalStats.currentStreak}
            </span>
            <span className={styles.streakUnit}>days</span>
          </div>
          <div className={styles.streakStatus}>
            <div
              className={`${styles.statusIndicator} ${
                streakInfo.status === "active"
                  ? styles.statusActive
                  : streakInfo.status === "at_risk"
                  ? styles.statusWarning
                  : styles.statusDanger
              }`}
            >
              {streakInfo.status === "active" && "🔥 On Fire!"}
              {streakInfo.status === "at_risk" && "⚠️ At Risk"}
              {streakInfo.status === "broken" && "💔 Broken"}
            </div>
            {personalStats.longestStreak > personalStats.currentStreak && (
              <div className={styles.bestStreak}>
                Best: {personalStats.longestStreak} days
              </div>
            )}
          </div>
        </div>
      </div>

      {/* This Week Summary */}
      <div className={styles.weeklyCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>This Week</h3>
        </div>
        <div className={styles.weeklyGrid}>
          <div className={styles.weeklyStat}>
            <div className={styles.statValue}>{weeklyStats.totalRuns}</div>
            <div className={styles.statLabel}>Runs</div>
          </div>
          <div className={styles.weeklyStat}>
            <div className={styles.statValue}>
              {weeklyStats.totalDistance.toFixed(1)}km
            </div>
            <div className={styles.statLabel}>Distance</div>
          </div>
          <div className={styles.weeklyStat}>
            <div className={styles.statValue}>{weeklyStats.averagePace}</div>
            <div className={styles.statLabel}>Avg Pace</div>
          </div>
        </div>
        {weeklyStats.bestRun && (
          <div className={styles.bestRun}>
            <div className={styles.bestRunLabel}>Best Run This Week:</div>
            <div className={styles.bestRunDetails}>
              {weeklyStats.bestRun.distance.toFixed(1)}km in{" "}
              {formatTime(weeklyStats.bestRun.time)}
            </div>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className={styles.insightsCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Quick Insights</h3>
        </div>
        <div className={styles.insightsList}>
          <div className={styles.insight}>
            <div className={styles.insightIcon}>🏃‍♂️</div>
            <div className={styles.insightText}>
              You've burned {personalStats.totalCalories.toLocaleString()}{" "}
              calories total
            </div>
          </div>
          <div className={styles.insight}>
            <div className={styles.insightIcon}>🎯</div>
            <div className={styles.insightText}>
              Personal best: {personalStats.bestDistance.toFixed(1)}km
            </div>
          </div>
          <div className={styles.insight}>
            <div className={styles.insightIcon}>⚡</div>
            <div className={styles.insightText}>
              Fastest pace: {personalStats.bestPace}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalOverview;
