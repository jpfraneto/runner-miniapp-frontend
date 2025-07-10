// Dependencies
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import Typography from "../Typography";
import Button from "../Button";
import IconButton from "../IconButton";
import WorkoutSummary from "../WorkoutSummary";

// Hooks
import {
  useUploadWorkout,
  type UploadWorkoutData,
} from "@/shared/hooks/user/useUploadWorkout";

// Types
import { RunningSession } from "@/shared/types/running";

// Assets
import CloseIcon from "@/assets/icons/close-icon.svg?react";

// StyleSheet
import styles from "./WorkoutUploadFlow.module.scss";

interface WorkoutUploadFlowProps {
  onComplete?: (completedRun: RunningSession) => void;
  onClose?: () => void;
  plannedSessionId?: string;
}

type UploadState =
  | "instructions"
  | "selecting"
  | "uploading"
  | "processing"
  | "verification"
  | "error"
  | "not_workout_image"
  | "summary";

const WorkoutUploadFlow: React.FC<WorkoutUploadFlowProps> = ({
  onComplete,
  onClose,
  plannedSessionId,
}) => {
  const [uploadState, setUploadState] = useState<UploadState>("instructions");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completedRun, setCompletedRun] = useState<RunningSession | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadWorkout();

  // Check if user has previously chosen to hide instructions
  useEffect(() => {
    const shouldHide =
      localStorage.getItem("hideWorkoutInstructions") === "true";
    if (shouldHide) {
      setUploadState("selecting");
    }
  }, []);

  // Generate image previews when files are selected
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setImagePreviews([]);
      return;
    }
    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then(setImagePreviews);
  }, [selectedFiles]);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);
      if (uploadState === "selecting") {
        setSelectedFiles((prev) => [...prev, ...fileArray]);
      } else {
        setSelectedFiles(fileArray);
      }
      setUploadState("selecting");
    },
    [uploadState]
  );

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setUploadState("uploading");
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const uploadData: UploadWorkoutData = {
        screenshots: selectedFiles,
        plannedSessionId,
        notes: "",
      };

      const result = await uploadMutation.mutateAsync(uploadData);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store the full response for detailed display
      setUploadResponse(result);

      // Brief processing state
      setTimeout(() => {
        if (
          result.extractedData.isWorkoutImage &&
          (Number(result.extractedData.confidence) || 0) > 0
        ) {
          setCompletedRun(result.runningSession);
          setUploadState("summary");
          // Don't call onComplete immediately - let user see the summary first
        } else {
          setUploadState("not_workout_image");
        }
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, [selectedFiles, plannedSessionId, uploadMutation]);

  const handleClose = useCallback(() => {
    setUploadState("instructions");
    setSelectedFiles([]);
    setUploadProgress(0);
    setError(null);
    setCompletedRun(null);
    setUploadResponse(null);
    onClose?.();
  }, [onClose]);

  const handleRetry = useCallback(() => {
    setUploadState("instructions");
    setError(null);
  }, []);

  const handleDeleteImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle summary completion - user clicks "Done" or "View Details"
  const handleSummaryComplete = useCallback(() => {
    if (completedRun && onComplete) {
      onComplete(completedRun);
    }
    handleClose();
  }, [completedRun, onComplete, handleClose]);

  const getStateContent = () => {
    switch (uploadState) {
      case "instructions":
        return (
          <div className={styles.instructionsState}>
            <div className={styles.instructionsHeader}>
              <div className={styles.instructionIcon}>📱</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Log Your Run
              </Typography>
              <Typography
                variant="geist"
                size={16}
                className={styles.instructionSubtitle}
              >
                Share your running achievements with the community
              </Typography>
            </div>

            <div className={styles.instructionSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Open your favorite running app
                  </Typography>
                  <Typography
                    variant="geist"
                    size={14}
                    className={styles.stepDescription}
                  >
                    Strava, Nike Run Club, Garmin, etc.
                  </Typography>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Take screenshots of your workout
                  </Typography>
                  <Typography
                    variant="geist"
                    size={14}
                    className={styles.stepDescription}
                  >
                    Include distance, time, and pace data
                  </Typography>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Upload and share with community
                  </Typography>
                  <Typography
                    variant="geist"
                    size={14}
                    className={styles.stepDescription}
                  >
                    Get recognition for your achievements
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.stateActions}>
              <Button
                onClick={() => setUploadState("selecting")}
                variant="primary"
                caption="📸 Start Upload"
                className={styles.primaryButton}
              />
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Cancel"
              />
            </div>
          </div>
        );

      case "selecting":
        return (
          <div className={styles.selectingState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>📸</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Select Screenshots
              </Typography>
              <Typography variant="geist" size={16}>
                Choose your workout screenshots
              </Typography>
            </div>

            <div className={styles.fileInputContainer}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className={styles.hiddenFileInput}
              />

              {selectedFiles.length === 0 ? (
                <div
                  className={styles.dropZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={styles.dropZoneContent}>
                    <div className={styles.dropZoneIcon}>📱</div>
                    <Typography variant="geist" weight="medium" size={16}>
                      Tap to select screenshots
                    </Typography>
                    <Typography variant="geist" size={14}>
                      or drag and drop here
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className={styles.selectedFiles}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Selected Screenshots ({selectedFiles.length})
                  </Typography>
                  <div className={styles.imageGrid}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={styles.imageItem}>
                        <img
                          src={preview}
                          alt={`Screenshot ${index + 1}`}
                          className={styles.previewImage}
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className={styles.deleteButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.stateActions}>
              {selectedFiles.length > 0 ? (
                <Button
                  onClick={handleUpload}
                  variant="primary"
                  caption="🚀 Upload & Process"
                  className={styles.primaryButton}
                />
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="primary"
                  caption="📸 Select Screenshots"
                  className={styles.primaryButton}
                />
              )}
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Cancel"
              />
            </div>
          </div>
        );

      case "uploading":
        return (
          <div className={styles.uploadingState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>⏳</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Uploading And Processing Your Screenshots
              </Typography>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <Typography
                variant="geist"
                size={14}
                className={styles.progressText}
              >
                {uploadProgress}% complete
              </Typography>
            </div>

            <div className={styles.uploadingSteps}>
              <div
                className={`${styles.uploadStep} ${
                  uploadProgress > 20 ? styles.completed : ""
                }`}
              >
                <div className={styles.stepIcon}>📤</div>
                <Typography variant="geist" size={14}>
                  Uploading files
                </Typography>
              </div>
              <div
                className={`${styles.uploadStep} ${
                  uploadProgress > 50 ? styles.completed : ""
                }`}
              >
                <div className={styles.stepIcon}>🔍</div>
                <Typography variant="geist" size={14}>
                  Analyzing workout data
                </Typography>
              </div>
              <div
                className={`${styles.uploadStep} ${
                  uploadProgress > 80 ? styles.completed : ""
                }`}
              >
                <div className={styles.stepIcon}>✅</div>
                <Typography variant="geist" size={14}>
                  Validating results
                </Typography>
              </div>
            </div>
          </div>
        );

      case "error":
        return (
          <div className={styles.errorState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>❌</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Upload Failed
              </Typography>
              <Typography
                variant="geist"
                size={16}
                className={styles.errorMessage}
              >
                {error}
              </Typography>
            </div>

            <div className={styles.stateActions}>
              <Button
                onClick={handleRetry}
                variant="primary"
                caption="🔄 Try Again"
                className={styles.primaryButton}
              />
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Cancel"
              />
            </div>
          </div>
        );

      case "not_workout_image":
        return (
          <div className={styles.notWorkoutState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>🤔</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                {selectedFiles.length === 1
                  ? "That is not a running session screenshot"
                  : "Those are not running session screenshots"}
              </Typography>
            </div>

            <div className={styles.tipsContainer}>
              <Typography variant="geist" weight="medium" size={16}>
                Please try again. You have only two attempts remaining on your
                history using this miniapp. Try to not make mistakes again or
                you will only have one more attempt. And then, if you try to
                upload an image that is not a running session screenshot, you
                will be banned. If you don't agree with this and have a better
                idea, please DC @jpfraneto.eth
              </Typography>
            </div>

            <div className={styles.stateActions}>
              <Button
                onClick={handleRetry}
                variant="primary"
                caption="📸 Try Different Screenshots"
                className={styles.primaryButton}
              />
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Cancel"
              />
            </div>
          </div>
        );

      case "summary":
        return (
          <div className={styles.summaryState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>🎉</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Run Successfully Processed!
              </Typography>
              <Typography variant="geist" size={16}>
                Here's what we extracted from your screenshots:
              </Typography>
            </div>

            {completedRun && (
              <div className={styles.summaryContent}>
                <WorkoutSummary
                  completedRun={completedRun}
                  isPersonalBest={uploadResponse?.isPersonalBest}
                  personalBestType={uploadResponse?.personalBestType}
                />

                {/* Additional processing details */}
                {uploadResponse && (
                  <div className={styles.processingDetails}>
                    <Typography variant="geist" weight="medium" size={16}>
                      Processing Details
                    </Typography>

                    <div className={styles.detailItem}>
                      <Typography variant="geist" size={14}>
                        <strong>Confidence Score:</strong>{" "}
                        {Math.round(
                          (uploadResponse.extractedData.confidence || 0) * 100
                        )}
                        %
                      </Typography>
                    </div>

                    {uploadResponse.extractedData.extractedText &&
                      uploadResponse.extractedData.extractedText.length > 0 && (
                        <div className={styles.detailItem}>
                          <Typography variant="geist" size={14}>
                            <strong>Text Extracted:</strong>{" "}
                            {uploadResponse.extractedData.extractedText.length}{" "}
                            text blocks
                          </Typography>
                        </div>
                      )}

                    {uploadResponse.screenshotUrls && (
                      <div className={styles.detailItem}>
                        <Typography variant="geist" size={14}>
                          <strong>Screenshots Processed:</strong>{" "}
                          {uploadResponse.screenshotUrls.length}
                        </Typography>
                      </div>
                    )}

                    {uploadResponse.extractedData.comment && (
                      <div className={styles.detailItem}>
                        <Typography variant="geist" size={14}>
                          <strong>Notes:</strong>{" "}
                          {uploadResponse.extractedData.comment}
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className={styles.stateActions}>
              <Button
                onClick={handleSummaryComplete}
                variant="primary"
                caption="✅ Done - Return to Feed"
                className={styles.primaryButton}
              />
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Close"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.fullScreenOverlay}
      >
        <div className={styles.fullScreenContent}>
          <div className={styles.header}>
            <IconButton onClick={handleClose} icon={<CloseIcon />} />
          </div>

          <div className={styles.content}>{getStateContent()}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkoutUploadFlow;
