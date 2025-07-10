import React from "react";
import { RunningSession as RunningSessionType } from "@/shared/types/running";
import { formatDuration } from "@/shared/utils/workoutAnalysis";
import styles from "./RunningSession.module.scss";
import sdk from "@farcaster/frame-sdk";

interface RunningSessionProps {
  workout: RunningSessionType;
  isOwner: boolean;
  onEdit: (workout: RunningSessionType) => void;
  onUserClick?: (userId: number) => void;
}

const RunningSession: React.FC<RunningSessionProps> = ({
  workout,
  isOwner,
  onEdit,
  onUserClick,
}) => {
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

  const handleCardClick = () => {
    if (onUserClick && workout.user?.fid) {
      onUserClick(workout.user.fid);
    }
  };

  return (
    <div className={styles.sessionCard} onClick={handleCardClick}>
      {/* Header with user info and action buttons */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {workout.user?.pfpUrl && (
            <img
              src={workout.user.pfpUrl}
              alt="User"
              className={styles.avatar}
            />
          )}
          <div className={styles.userDetails}>
            <div className={styles.username}>
              {workout.user?.username
                ? `@${workout.user.username}`
                : `User ${workout.fid}`}
            </div>
            <div className={styles.date}>
              {formatDate(workout.completedDate || new Date().toISOString())}
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {/* Share Button */}
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
              try {
                if (workout.castHash) {
                  sdk.actions.composeCast({
                    embeds: [
                      `https://farcaster.xyz/~/conversations/${workout.castHash}`,
                    ],
                  });
                } else {
                  // Fallback share
                  const shareText = `Check out this ${workout.distance}${
                    workout.units
                  } run in ${formatDuration(workout.duration)}!`;
                  if (navigator.share) {
                    navigator.share({
                      title: `${workout.user?.username || "Someone"}'s Workout`,
                      text: shareText,
                      url: window.location.href,
                    });
                  } else {
                    // Copy to clipboard fallback
                    navigator.clipboard?.writeText(shareText);
                  }
                }
              } catch (error) {
                console.error("Share failed:", error);
              }
            }}
            title="Share running session"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16,6 12,2 8,6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {/* Cast Button */}
          {workout.castHash && (
            <button
              className={`${styles.actionButton} ${styles.castButton}`}
              onClick={(e) => {
                e.stopPropagation();
                try {
                  sdk.actions.viewCast({ hash: workout.castHash! });
                } catch (error) {
                  console.error("View cast failed:", error);
                }
              }}
              title="View cast"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}

          {/* Edit Button */}
          {isOwner && (
            <button
              className={`${styles.actionButton} ${styles.editButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(workout);
              }}
              title="Edit workout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Personal Best Badge */}
      {workout.isPersonalBest && (
        <div className={styles.pbBanner}>
          <span className={styles.pbIcon}>🏆</span>
          <span className={styles.pbText}>Personal Best</span>
          {workout.personalBestType && (
            <span className={styles.pbType}>• {workout.personalBestType}</span>
          )}
        </div>
      )}

      {/* Main Stats */}
      <div className={styles.mainStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            {workout.distance ? Number(workout.distance).toFixed(1) : "0.0"}
          </div>
          <div className={styles.statLabel}>{workout.units || "km"}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            {workout.duration && workout.duration > 0
              ? (() => {
                  try {
                    return formatDuration(workout.duration);
                  } catch (error) {
                    console.error("Format duration error:", error);
                    return "--:--";
                  }
                })()
              : "--:--"}
          </div>
          <div className={styles.statLabel}>time</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{workout.pace || "--:--"}</div>
          <div className={styles.statLabel}>avg pace</div>
        </div>
      </div>

      {/* Secondary Stats */}
      {(workout.calories || workout.avgHeartRate || workout.maxHeartRate) && (
        <div className={styles.secondaryStats}>
          {workout.calories && workout.calories > 0 && (
            <div className={styles.secondaryStat}>
              <span className={styles.statIcon}>🔥</span>
              <span className={styles.statText}>
                {workout.calories.toLocaleString()} cal
              </span>
            </div>
          )}
          {workout.avgHeartRate && workout.avgHeartRate > 0 && (
            <div className={styles.secondaryStat}>
              <span className={styles.statIcon}>❤️</span>
              <span className={styles.statText}>
                {workout.avgHeartRate} avg bpm
              </span>
            </div>
          )}
          {workout.maxHeartRate && workout.maxHeartRate > 0 && (
            <div className={styles.secondaryStat}>
              <span className={styles.statIcon}>📈</span>
              <span className={styles.statText}>
                {workout.maxHeartRate} max bpm
              </span>
            </div>
          )}
        </div>
      )}

      {/* Workout Comment */}
      {workout.comment && (
        <div className={styles.comment}>
          <div className={styles.commentText}>{workout.comment}</div>
        </div>
      )}
    </div>
  );
};

export default RunningSession;
