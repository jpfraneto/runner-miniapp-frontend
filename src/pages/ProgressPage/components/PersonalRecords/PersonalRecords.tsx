// Dependencies
import React from "react";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";
import styles from "./PersonalRecords.module.scss";

interface PersonalRecordsProps {
  fid: number;
}

const PersonalRecords: React.FC<PersonalRecordsProps> = ({ fid }) => {
  const { data: analytics, isLoading, error } = useProgressAnalytics(fid);

  if (isLoading) {
    return <div className={styles.loadingCard}>Loading records...</div>;
  }

  if (error || !analytics?.success) {
    return <div className={styles.errorCard}>Unable to load records</div>;
  }

  const { personalStats } = analytics.data;

  return (
    <div className={styles.container}>
      <div className={styles.recordsCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Personal Records</h3>
        </div>
        <div className={styles.recordsGrid}>
          <div className={styles.record}>
            <div className={styles.recordIcon}>🏃‍♂️</div>
            <div className={styles.recordTitle}>Longest Run</div>
            <div className={styles.recordValue}>{personalStats.bestDistance.toFixed(1)}km</div>
          </div>
          <div className={styles.record}>
            <div className={styles.recordIcon}>⚡</div>
            <div className={styles.recordTitle}>Best Pace</div>
            <div className={styles.recordValue}>{personalStats.bestPace}</div>
          </div>
          <div className={styles.record}>
            <div className={styles.recordIcon}>🔥</div>
            <div className={styles.recordTitle}>Longest Streak</div>
            <div className={styles.recordValue}>{personalStats.longestStreak} days</div>
          </div>
          <div className={styles.record}>
            <div className={styles.recordIcon}>⏱️</div>
            <div className={styles.recordTitle}>Best Time</div>
            <div className={styles.recordValue}>{Math.floor(personalStats.bestTime / 60)}h {personalStats.bestTime % 60}m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalRecords;