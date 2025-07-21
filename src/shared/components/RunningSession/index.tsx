import React from "react";
import { RunningSession as RunningSessionType } from "@/shared/types/running";
import styles from "./RunningSession.module.scss";
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";

interface RunningSessionProps {
  workout: RunningSessionType;
}

const RunningSession: React.FC<RunningSessionProps> = ({ workout }) => {
  const navigate = useNavigate();
  
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleCardClick = () => {
    navigate(`/runs/${workout.castHash}`);
  };

  const handleViewCast = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sdk.actions.viewCast({ hash: workout.castHash });
    } catch (error) {
      console.error("View cast failed:", error);
    }
  };

  return (
    <div className={styles.sessionCard} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src={workout.user.pfpUrl}
            alt={workout.user.username}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <div className={styles.username}>@{workout.user.username}</div>
            <div className={styles.date}>
              {formatDate(workout.completedDate || new Date().toISOString())}
            </div>
          </div>
        </div>
        
        <button
          className={styles.castButton}
          onClick={handleViewCast}
          title="View cast"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div className={styles.mainStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{workout.distance.toFixed(1)}</div>
          <div className={styles.statLabel}>km</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formatDuration(workout.duration)}</div>
          <div className={styles.statLabel}>time</div>
        </div>
      </div>
    </div>
  );
};

export default RunningSession;