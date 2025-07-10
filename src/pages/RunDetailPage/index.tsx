// Dependencies
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import sdk from "@farcaster/frame-sdk";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";
import IconButton from "@/shared/components/IconButton";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// Hooks
import { useRunDetail } from "@/shared/hooks/user/useRunDetail";

// Assets
import CloseIcon from "@/shared/assets/icons/close-icon.svg?react";
import ShareIcon from "@/shared/assets/icons/share-icon.svg?react";
import ArrowLeftIcon from "@/shared/assets/icons/go-back-icon.svg?react";

// StyleSheet
import styles from "./RunDetailPage.module.scss";

const RunDetailPage: React.FC = () => {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Check if coming from upload flow
  const isFromUpload = location.state?.fromUpload || false;

  // Fetch run data
  const { data: run, isLoading, error } = useRunDetail(Number(runId));

  // Show celebration animation on first load if coming from upload
  useEffect(() => {
    if (isFromUpload && run && !showCelebration) {
      setShowCelebration(true);
      sdk.haptics.notificationOccurred("success");

      // Hide celebration after 3 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isFromUpload, run, showCelebration]);

  // Handle navigation back
  const handleGoBack = () => {
    sdk.haptics.selectionChanged();
    navigate(-1);
  };

  // Handle close
  const handleClose = () => {
    sdk.haptics.selectionChanged();
    navigate("/");
  };

  // Handle share on Farcaster
  const handleShare = () => {
    if (!run) return;

    sdk.haptics.impactOccurred("medium");

    const shareText = `Just completed a ${run.distance}${run.units} run in ${
      run.duration
    } minutes! 🏃‍♂️ ${
      run.isPersonalBest ? `New ${run.personalBestType} PB! 🎉` : ""
    } #RUNNER`;

    sdk.actions.composeCast({
      text: shareText,
      embeds: (run.screenshotUrls || []).slice(0, 2) as
        | [string]
        | [string, string],
    });
  };

  // Handle image gallery
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    sdk.haptics.selectionChanged();
  };

  const handleCloseGallery = () => {
    setSelectedImageIndex(null);
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "#22c55e"; // green
    if (confidence >= 0.6) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  // Get confidence text
  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
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

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <LoaderIndicator />
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            className={styles.loadingText}
          >
            Loading your run details...
          </Typography>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Typography
            variant="geist"
            weight="medium"
            size={18}
            className={styles.errorTitle}
          >
            Run Not Found
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            className={styles.errorText}
          >
            The run you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="primary"
            caption="Go Back"
            onClick={handleGoBack}
            className={styles.errorButton}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className={styles.celebration}
          >
            <div className={styles.celebrationContent}>
              <div className={styles.celebrationIcon}>🎉</div>
              <Typography
                variant="gta"
                weight="wide"
                size={24}
                className={styles.celebrationTitle}
              >
                Run Completed!
              </Typography>
              {run.isPersonalBest && (
                <Typography
                  variant="geist"
                  weight="medium"
                  size={16}
                  className={styles.pbCelebration}
                >
                  New {run.personalBestType} Personal Best! 🏆
                </Typography>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          size={20}
          className={styles.title}
        >
          Run Details
        </Typography>
        <IconButton
          variant="secondary"
          icon={<CloseIcon />}
          onClick={handleClose}
          className={styles.closeButton}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Run Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.summaryCard}
        >
          <div className={styles.summaryHeader}>
            <Typography
              variant="geist"
              weight="medium"
              size={14}
              className={styles.dateText}
            >
              {formatDate(run.completedDate || new Date().toISOString())}
            </Typography>
            {run.isPersonalBest && (
              <div className={styles.pbBadge}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={12}
                  className={styles.pbText}
                >
                  🏆 {run.personalBestType} PB
                </Typography>
              </div>
            )}
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <Typography
                variant="gta"
                weight="wide"
                size={32}
                className={styles.metricValue}
              >
                {run.distance}
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
                {formatTime(run.duration)}
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
                {run.pace}
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

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.statsCard}
        >
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            className={styles.sectionTitle}
          >
            Workout Stats
          </Typography>

          <div className={styles.statsGrid}>
            <div className={styles.statRow}>
              <Typography variant="geist" weight="medium" size={14}>
                Calories
              </Typography>
              <Typography variant="geist" weight="regular" size={14}>
                {run.calories}
              </Typography>
            </div>
            <div className={styles.statRow}>
              <Typography variant="geist" weight="medium" size={14}>
                Avg Heart Rate
              </Typography>
              <Typography variant="geist" weight="regular" size={14}>
                {run.avgHeartRate} bpm
              </Typography>
            </div>
            <div className={styles.statRow}>
              <Typography variant="geist" weight="medium" size={14}>
                Max Heart Rate
              </Typography>
              <Typography variant="geist" weight="regular" size={14}>
                {run.maxHeartRate} bpm
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* AI Confidence Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.confidenceCard}
        >
          <div className={styles.confidenceHeader}>
            <Typography
              variant="geist"
              weight="medium"
              size={16}
              className={styles.sectionTitle}
            >
              AI Extraction Confidence
            </Typography>
            <div
              className={styles.confidenceBadge}
              style={{
                backgroundColor: getConfidenceColor(Number(run.confidence)),
              }}
            >
              <Typography
                variant="geist"
                weight="medium"
                size={12}
                className={styles.confidenceText}
              >
                {getConfidenceText(Number(run.confidence))} (
                {Math.round(Number(run.confidence) * 100)}%)
              </Typography>
            </div>
          </div>

          {!run.isWorkoutImage && Number(run.confidence) < 0.8 && (
            <Typography
              variant="geist"
              weight="regular"
              size={12}
              className={styles.verificationHint}
            >
              ⚠️ Low confidence extraction. Consider verifying the data.
            </Typography>
          )}
        </motion.div>

        {/* Screenshots Gallery */}
        {(run.screenshotUrls || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.galleryCard}
          >
            <Typography
              variant="geist"
              weight="medium"
              size={16}
              className={styles.sectionTitle}
            >
              Workout Screenshots ({(run.screenshotUrls || []).length})
            </Typography>

            <div className={styles.galleryGrid}>
              {(run.screenshotUrls || []).map((url: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.galleryItem}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={url}
                    alt={`Workout screenshot ${index + 1}`}
                    className={styles.galleryImage}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant="secondary"
          caption="Share on Farcaster"
          onClick={handleShare}
          iconLeft={<ShareIcon />}
          className={styles.shareButton}
        />
        {!run.isWorkoutImage && Number(run.confidence) < 0.8 && (
          <Button
            variant="primary"
            caption="Verify Data"
            onClick={() => navigate(`/verify/${run.id}`)}
            className={styles.verifyButton}
          />
        )}
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.galleryModal}
            onClick={handleCloseGallery}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={styles.galleryModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                variant="secondary"
                icon={<CloseIcon />}
                onClick={handleCloseGallery}
                className={styles.galleryCloseButton}
              />
              <img
                src={(run.screenshotUrls || [])[selectedImageIndex]}
                alt={`Workout screenshot ${selectedImageIndex + 1}`}
                className={styles.galleryModalImage}
              />
              <div className={styles.galleryModalFooter}>
                <span>
                  {selectedImageIndex + 1} / {(run.screenshotUrls || []).length}
                </span>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : 0
                    )
                  }
                  disabled={selectedImageIndex === 0}
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev !== null
                        ? Math.min(
                            (run.screenshotUrls || []).length - 1,
                            prev + 1
                          )
                        : 0
                    )
                  }
                  disabled={
                    selectedImageIndex === (run.screenshotUrls || []).length - 1
                  }
                >
                  Next
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RunDetailPage;
