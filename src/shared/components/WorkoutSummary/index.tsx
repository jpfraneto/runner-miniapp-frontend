import React from "react";
import Typography from "../Typography";
import { RunningSession } from "@/shared/types/running";
import {
  analyzeWorkoutType,
  formatDuration,
  getWorkoutTypeIcon,
  getWorkoutTypeLabel,
} from "@/shared/utils/workoutAnalysis";
import styles from "./WorkoutSummary.module.scss";

interface WorkoutSummaryProps {
  completedRun: RunningSession;
  isPersonalBest?: boolean;
  personalBestType?: string;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  completedRun,
  isPersonalBest = false,
  personalBestType,
}) => {
  const workoutAnalysis = analyzeWorkoutType(completedRun);

  // Get screenshot URLs
  const screenshotUrls = completedRun.screenshotUrls || [];

  return (
    <div className={styles.workoutSummary}>
      {/* Header with workout type */}
      <div className={styles.header}>
        <div className={styles.workoutType}>
          <span className={styles.typeIcon}>
            {getWorkoutTypeIcon(workoutAnalysis.type)}
          </span>
          <Typography variant="druk" weight="wide" size={18}>
            {getWorkoutTypeLabel(workoutAnalysis.type)}
          </Typography>
        </div>

        {isPersonalBest && (
          <div className={styles.personalBest}>
            <span className={styles.pbIcon}>🏆</span>
            <Typography variant="geist" weight="medium" size={12}>
              {personalBestType
                ? personalBestType.replace("_", " ")
                : "Personal Best"}
            </Typography>
          </div>
        )}
      </div>

      {/* Main stats grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Typography variant="druk" weight="wide" size={32}>
            {Number(completedRun.distance).toFixed(2)}
          </Typography>
          <Typography variant="geist" size={14}>
            {completedRun.units}
          </Typography>
        </div>

        <div className={styles.statCard}>
          <Typography variant="druk" weight="wide" size={32}>
            {formatDuration(Number(completedRun.duration))}
          </Typography>
          <Typography variant="geist" size={14}>
            duration
          </Typography>
        </div>

        <div className={styles.statCard}>
          <Typography variant="druk" weight="wide" size={32}>
            {completedRun.pace}
          </Typography>
          <Typography variant="geist" size={14}>
            avg pace
          </Typography>
        </div>
      </div>

      {/* Additional metrics */}
      {(completedRun.calories || completedRun.avgHeartRate) && (
        <div className={styles.additionalMetrics}>
          {completedRun.calories && (
            <div className={styles.metric}>
              <span className={styles.metricIcon}>🔥</span>
              <Typography variant="geist" weight="medium" size={16}>
                {Number(completedRun.calories).toLocaleString()} calories
              </Typography>
            </div>
          )}

          {completedRun.avgHeartRate && (
            <div className={styles.metric}>
              <span className={styles.metricIcon}>❤️</span>
              <Typography variant="geist" weight="medium" size={16}>
                {Number(completedRun.avgHeartRate)} bpm avg
              </Typography>
            </div>
          )}

          {completedRun.maxHeartRate && (
            <div className={styles.metric}>
              <span className={styles.metricIcon}>💓</span>
              <Typography variant="geist" weight="medium" size={16}>
                {Number(completedRun.maxHeartRate)} bpm max
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Screenshots preview */}
      {screenshotUrls.length > 0 && (
        <div className={styles.screenshotsSection}>
          <Typography variant="geist" weight="medium" size={16}>
            Screenshots ({screenshotUrls.length})
          </Typography>
          <div className={styles.screenshotsGrid}>
            {screenshotUrls.slice(0, 3).map((url, index) => (
              <div key={index} className={styles.screenshotItem}>
                <img
                  src={url}
                  alt={`Workout screenshot ${index + 1}`}
                  className={styles.screenshot}
                />
              </div>
            ))}
            {screenshotUrls.length > 3 && (
              <div className={styles.screenshotItem}>
                <div className={styles.moreScreenshots}>
                  <Typography variant="geist" weight="medium" size={14}>
                    +{screenshotUrls.length - 3}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Extraction confidence */}
      <div className={styles.confidenceSection}>
        <div className={styles.confidenceBar}>
          <div
            className={styles.confidenceFill}
            style={{ width: `${Number(completedRun.confidence) * 100}%` }}
          />
        </div>
        <Typography variant="geist" size={12}>
          Extraction confidence:{" "}
          {Math.round(Number(completedRun.confidence) * 100)}%
        </Typography>
      </div>

      {/* Raw text preview */}
      <div className={styles.rawTextSection}>
        <Typography variant="geist" weight="medium" size={14}>
          Extracted Data
        </Typography>
        <Typography variant="geist" size={12} className={styles.rawText}>
          {completedRun.rawText}
        </Typography>
      </div>
    </div>
  );
};

export default WorkoutSummary;
