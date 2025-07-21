// Dependencies
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import sdk from "@farcaster/frame-sdk";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";
import IconButton from "@/shared/components/IconButton";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// Hooks
import { useRunningSessionByCastHash } from "@/shared/hooks/user/useRunningSessionByCastHash";

// Assets
import ShareIcon from "@/shared/assets/icons/share-icon.svg?react";
import ArrowLeftIcon from "@/shared/assets/icons/go-back-icon.svg?react";

// StyleSheet
import styles from "./RunningSessionDetail.module.scss";
import { API_URL } from "@/config/api";

interface RunningSessionDetailProps {
  castHash: string;
}

const RunningSessionDetail: React.FC<RunningSessionDetailProps> = ({
  castHash,
}) => {
  const navigate = useNavigate();
  const {
    data: runningSession,
    isLoading,
    error,
  } = useRunningSessionByCastHash(castHash);

  // Handle navigation back
  const handleGoBack = () => {
    navigate("/");
  };

  // Handle share on Farcaster
  const handleShare = () => {
    if (!runningSession) return;

    const shareText = ``;

    // Use Farcaster SDK to compose cast
    sdk.actions.composeCast({
      text: shareText,
      embeds: [`${API_URL}/embeds/run/${castHash}`],
    });
  };

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className={styles.loadingContainer}>
          <LoaderIndicator />
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            className={styles.loadingText}
          >
            Loading running session...
          </Typography>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    const isNotFound =
      error.message?.includes("404") || error.message?.includes("not found");
    const isServerError =
      error.message?.includes("500") || error.message?.includes("server error");

    return (
      <AppLayout>
        <div className={styles.errorContainer}>
          <Typography
            variant="geist"
            weight="medium"
            size={18}
            className={styles.errorTitle}
          >
            {isNotFound ? "Running Session Not Found" : "Error Loading Session"}
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            className={styles.errorText}
          >
            {isNotFound
              ? "This running session doesn't exist or has been removed."
              : isServerError
              ? "Server error occurred. Please try again later."
              : "Failed to load the running session. Please try again."}
          </Typography>
          <Button
            variant="primary"
            caption="Go Back"
            onClick={handleGoBack}
            className={styles.errorButton}
          />
        </div>
      </AppLayout>
    );
  }

  if (!runningSession) {
    return (
      <AppLayout>
        <div className={styles.errorContainer}>
          <Typography
            variant="geist"
            weight="medium"
            size={18}
            className={styles.errorTitle}
          >
            No Data Available
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            className={styles.errorText}
          >
            No running session data was found for this cast.
          </Typography>
          <Button
            variant="primary"
            caption="Go Back"
            onClick={handleGoBack}
            className={styles.errorButton}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <IconButton
            variant="secondary"
            icon={<ArrowLeftIcon />}
            onClick={handleGoBack}
            className={styles.backButton}
          />
          <Typography
            variant="gta"
            weight="wide"
            size={40}
            className={styles.title}
          >
            Running Session
          </Typography>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* User Info */}
          {runningSession.user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.userCard}
            >
              <div className={styles.userInfo}>
                <img
                  src={runningSession.user.pfpUrl}
                  alt={runningSession.user.username}
                  className={styles.userAvatar}
                />
                <div className={styles.userDetails}>
                  <Typography
                    variant="geist"
                    weight="medium"
                    size={16}
                    className={styles.username}
                  >
                    @{runningSession.user.username}
                  </Typography>
                  <Typography
                    variant="geist"
                    weight="regular"
                    size={14}
                    className={styles.userFid}
                  >
                    FID: {runningSession.user.fid}
                  </Typography>
                </div>
              </div>
            </motion.div>
          )}

          {/* Session Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.summaryCard}
          >
            <div className={styles.summaryHeader}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.dateText}
              >
                {formatDate(
                  runningSession.completedDate || new Date().toISOString()
                )}
              </Typography>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <Typography
                  variant="gta"
                  weight="wide"
                  size={32}
                  className={styles.metricValue}
                >
                  {runningSession.distance}
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.metricLabel}
                >
                  km
                </Typography>
              </div>
              <div className={styles.metric}>
                <Typography
                  variant="gta"
                  weight="wide"
                  size={32}
                  className={styles.metricValue}
                >
                  {formatTime(Number(runningSession.duration))}
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.metricLabel}
                >
                  time
                </Typography>
              </div>
              <div className={styles.metric}>
                <Typography
                  variant="gta"
                  weight="wide"
                  size={32}
                  className={styles.metricValue}
                >
                  {runningSession.pace}
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  className={styles.metricLabel}
                >
                  pace
                </Typography>
              </div>
            </div>
          </motion.div>

          {/* Intervals (if available) */}
          {runningSession.intervals && runningSession.intervals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={styles.intervalsCard}
            >
              <Typography
                variant="geist"
                weight="medium"
                size={16}
                className={styles.sectionTitle}
              >
                Intervals ({runningSession.intervals.length})
              </Typography>

              <div className={styles.intervalsList}>
                {runningSession.intervals.map((interval, index) => (
                  <div key={index} className={styles.intervalItem}>
                    <div className={styles.intervalHeader}>
                      <Typography variant="geist" weight="medium" size={14}>
                        Interval {index + 1}
                      </Typography>
                      <Typography variant="geist" weight="regular" size={12}>
                        {interval.distance}km •{" "}
                        {formatTime(Number(interval.duration))}
                      </Typography>
                    </div>
                    {interval.pace && (
                      <Typography variant="geist" weight="regular" size={12}>
                        Pace: {interval.pace}/km
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Screenshots (if available) */}
          {runningSession.screenshotUrls &&
            runningSession.screenshotUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={styles.galleryCard}
              >
                <Typography
                  variant="geist"
                  weight="medium"
                  size={16}
                  className={styles.sectionTitle}
                >
                  Workout Screenshots ({runningSession.screenshotUrls.length})
                </Typography>

                <div className={styles.galleryGrid}>
                  {runningSession.screenshotUrls.map(
                    (url: string, index: number) => (
                      <div key={index} className={styles.galleryItem}>
                        <img
                          src={url}
                          alt={`Workout screenshot ${index + 1}`}
                          className={styles.galleryImage}
                        />
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            caption="Share"
            onClick={handleShare}
            iconLeft={<ShareIcon />}
            className={styles.shareButton}
          />
          {runningSession?.castHash && (
            <button
              className={styles.viewCastButton}
              onClick={() => {
                if (runningSession.castHash) {
                  sdk.actions.viewCast({
                    hash: runningSession.castHash,
                  });
                }
              }}
            >
              View Cast
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RunningSessionDetail;
