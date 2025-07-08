// Dependencies
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import Typography from "../Typography";
import Button from "../Button";
import IconButton from "../IconButton";
import { ModalProvider } from "@/shared/providers/ModalProvider";

// Hooks
import {
  useUploadWorkout,
  type CompletedRun,
  type UploadWorkoutData,
} from "@/shared/hooks/user/useUploadWorkout";

// Assets
import CloseIcon from "@/assets/icons/close-icon.svg?react";

// StyleSheet
import styles from "./WorkoutUploadFlow.module.scss";

interface WorkoutUploadFlowProps {
  onComplete?: (completedRun: CompletedRun) => void;
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
  const [completedRun, setCompletedRun] = useState<CompletedRun | null>(null);
  const [hideInstructions, setHideInstructions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

      // Brief processing state
      setTimeout(() => {
        if (
          result.extractedData.isWorkoutImage &&
          result.extractedData.confidence > 0
        ) {
          setCompletedRun(result.completedRun);
          setUploadState("summary");
          onComplete?.(result.completedRun);
        } else {
          setUploadState("not_workout_image");
        }
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, [selectedFiles, plannedSessionId, uploadMutation, onComplete]);

  const handleClose = useCallback(() => {
    setUploadState("instructions");
    setSelectedFiles([]);
    setUploadProgress(0);
    setError(null);
    setCompletedRun(null);
    onClose?.();
  }, [onClose]);

  const handleRetry = useCallback(() => {
    setUploadState("instructions");
    setError(null);
  }, []);

  const handleHideInstructions = useCallback(() => {
    if (hideInstructions) {
      localStorage.setItem("hideWorkoutInstructions", "true");
    }
  }, [hideInstructions]);

  const handleDeleteImage = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = () => {
    if (deleteIndex !== null) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteImage = () => {
    setDeleteIndex(null);
    setShowDeleteModal(false);
  };

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
                    Strava, Nike Run Club, Garmin, or any app you use
                  </Typography>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Take a screenshot of your workout
                  </Typography>
                  <Typography
                    variant="geist"
                    size={14}
                    className={styles.stepDescription}
                  >
                    Make sure distance, time, and pace are visible
                  </Typography>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <Typography variant="geist" weight="medium" size={16}>
                    Upload and share with the community
                  </Typography>
                  <Typography
                    variant="geist"
                    size={14}
                    className={styles.stepDescription}
                  >
                    We'll automatically extract your workout data
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.instructionActions}>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                caption="📸 Select Screenshots"
                className={styles.primaryButton}
              />

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="hideInstructions"
                  checked={hideInstructions}
                  onChange={(e) => setHideInstructions(e.target.checked)}
                  className={styles.checkbox}
                />
                <label
                  htmlFor="hideInstructions"
                  className={styles.checkboxLabel}
                >
                  <Typography variant="geist" size={14}>
                    Don't show this again
                  </Typography>
                </label>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                handleFileSelect(e.target.files);
                if (uploadState !== "selecting") handleHideInstructions();
              }}
              style={{ display: "none" }}
            />
          </div>
        );

      case "selecting":
        return (
          <div className={styles.selectingState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>📁</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Ready to Upload
              </Typography>
              <Typography variant="geist" size={16}>
                {selectedFiles.length} screenshot
                {selectedFiles.length !== 1 ? "s" : ""} selected
              </Typography>
            </div>

            <div className={styles.imagePreviewRow}>
              {imagePreviews.map((src, index) => (
                <div key={index} className={styles.imagePreviewItem}>
                  <img
                    src={src}
                    alt={`Screenshot ${index + 1}`}
                    className={styles.imagePreviewImg}
                  />
                  <button
                    className={styles.deleteImageButton}
                    onClick={() => handleDeleteImage(index)}
                    aria-label="Delete image"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div
                className={styles.addMoreItem}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="Add more images"
              >
                <span className={styles.addMoreIcon}>＋</span>
              </div>
            </div>

            <div className={styles.stateActions}>
              <Button
                onClick={handleUpload}
                variant="primary"
                caption="🚀 Upload Workout"
                className={styles.primaryButton}
                disabled={selectedFiles.length === 0}
              />
              <Button
                onClick={handleClose}
                variant="secondary"
                caption="Cancel"
              />
            </div>

            {showDeleteModal && (
              <ModalProvider>
                <div className={styles.confirmModalOverlay}>
                  <div className={styles.confirmModalBox}>
                    <Typography as="h3" variant="druk" size={20}>
                      Delete this image?
                    </Typography>
                    <Typography variant="geist" size={16}>
                      Are you sure you want to remove this screenshot?
                    </Typography>
                    <div className={styles.confirmModalActions}>
                      <Button
                        onClick={confirmDeleteImage}
                        variant="primary"
                        caption="Yes, delete"
                        className={styles.primaryButton}
                      />
                      <Button
                        onClick={cancelDeleteImage}
                        variant="secondary"
                        caption="Cancel"
                      />
                    </div>
                  </div>
                </div>
              </ModalProvider>
            )}
          </div>
        );

      case "uploading":
        return (
          <div className={styles.uploadingState}>
            <div className={styles.stateHeader}>
              <div className={styles.stateIcon}>⏳</div>
              <Typography as="h2" variant="druk" weight="wide" size={24}>
                Uploading Your Run
              </Typography>
              <Typography variant="geist" size={16}>
                Processing your workout data...
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
                Not a Workout Image
              </Typography>
              <Typography variant="geist" size={16}>
                We couldn't detect workout data in your screenshots
              </Typography>
            </div>

            <div className={styles.tipsContainer}>
              <Typography variant="geist" weight="medium" size={16}>
                Tips for better results:
              </Typography>
              <ul className={styles.tipsList}>
                <li>Make sure the screenshot shows distance, time, and pace</li>
                <li>
                  Try taking a screenshot from your running app's summary screen
                </li>
                <li>Ensure the text is clear and readable</li>
                <li>
                  Upload screenshots from apps like Strava, Nike Run Club, or
                  Garmin
                </li>
              </ul>
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
                Run Logged Successfully!
              </Typography>
              <Typography variant="geist" size={16}>
                Your workout has been shared with the community
              </Typography>
            </div>

            {completedRun && (
              <div className={styles.workoutSummary}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryStat}>
                    <Typography variant="druk" weight="wide" size={32}>
                      {completedRun.distance}
                    </Typography>
                    <Typography variant="geist" size={14}>
                      kilometers
                    </Typography>
                  </div>
                  <div className={styles.summaryStat}>
                    <Typography variant="druk" weight="wide" size={32}>
                      {Math.floor(completedRun.duration)}:
                      {((completedRun.duration % 1) * 60)
                        .toFixed(0)
                        .padStart(2, "0")}
                    </Typography>
                    <Typography variant="geist" size={14}>
                      duration
                    </Typography>
                  </div>
                  <div className={styles.summaryStat}>
                    <Typography variant="druk" weight="wide" size={32}>
                      {completedRun.pace}
                    </Typography>
                    <Typography variant="geist" size={14}>
                      pace
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.stateActions}>
              <Button
                onClick={handleClose}
                variant="primary"
                caption="✅ Done"
                className={styles.primaryButton}
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
