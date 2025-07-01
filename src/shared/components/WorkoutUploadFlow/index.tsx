// Dependencies
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Components
import Typography from "../Typography";
import Button from "../Button";
import IconButton from "../IconButton";
import WorkoutHistory from "../WorkoutHistory";

// Hooks
import {
  useUploadWorkout,
  useVerifyWorkout,
} from "@/shared/hooks/user/useUploadWorkout";

// Assets
import CloseIcon from "@/assets/icons/close-icon.svg?react";

// StyleSheet
import styles from "./WorkoutUploadFlow.module.scss";

// Types
import {
  UploadWorkoutData,
  ExtractedWorkoutData,
  CompletedRun,
} from "@/shared/hooks/user/useUploadWorkout";

interface WorkoutUploadFlowProps {
  onComplete?: (completedRun: CompletedRun) => void;
  onClose?: () => void;
}

type UploadState =
  | "initial"
  | "selecting"
  | "uploading"
  | "processing"
  | "verification"
  | "error"
  | "not_workout_image"; // New state for non-workout images

const WorkoutUploadFlow: React.FC<WorkoutUploadFlowProps> = ({
  onComplete,
  onClose,
}) => {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>("initial");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] =
    useState<ExtractedWorkoutData | null>(null);
  const [completedRun, setCompletedRun] = useState<CompletedRun | null>(null);
  const [error, setError] = useState<string>("");
  const [nonWorkoutMessage, setNonWorkoutMessage] = useState<string>(""); // New state for fun messages
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [lastUploadHash, setLastUploadHash] = useState<string>("");
  const [showInstructions, setShowInstructions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check local storage for user preference
  useEffect(() => {
    const hideInstructions = localStorage.getItem("hideWorkoutInstructions");
    if (hideInstructions === "true") {
      setShowInstructions(false);
    }
  }, []);

  // Hooks
  const uploadWorkout = useUploadWorkout();
  const verifyWorkout = useVerifyWorkout();

  // Create a hash of the files being uploaded
  const createUploadHash = useCallback((files: File[]) => {
    const fileData = files
      .map((f) => `${f.name}-${f.size}-${f.lastModified}`)
      .join("|");
    return btoa(fileData); // Simple base64 hash
  }, []);

  // File validation
  const validateFiles = useCallback(
    (files: File[], existingFiles: File[] = []): File[] => {
      const validFiles = files.filter((file) => {
        const isValidType = file.type.match(/^image\/(jpeg|jpg|png|webp)$/);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        sdk.haptics.notificationOccurred("error");
        setError(
          "Some files were invalid. Only JPEG, PNG, and WebP images under 10MB are allowed."
        );
        return [];
      }

      const totalFiles = existingFiles.length + validFiles.length;
      if (totalFiles > 4) {
        sdk.haptics.notificationOccurred("error");
        setError(
          `Maximum 4 screenshots allowed. You can add ${
            4 - existingFiles.length
          } more.`
        );
        return [];
      }

      return validFiles;
    },
    []
  );

  // File selection handler
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = validateFiles(files, selectedFiles);

      if (validFiles.length > 0) {
        // Append new files to existing ones, ensuring we don't exceed 4 files
        setSelectedFiles((prevFiles) => {
          const combinedFiles = [...prevFiles, ...validFiles];
          // Keep only the first 4 files if we exceed the limit
          return combinedFiles.slice(0, 4);
        });
        setUploadState("selecting");
        setError("");
        setNonWorkoutMessage(""); // Clear any previous non-workout messages
        sdk.haptics.selectionChanged();
      }
    },
    [validateFiles, selectedFiles]
  );

  // Upload handler
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one screenshot");
      return;
    }

    // Prevent duplicate uploads
    const uploadHash = createUploadHash(selectedFiles);
    if (uploadInProgress) {
      console.log("Upload already in progress, ignoring duplicate request");
      return;
    }

    if (lastUploadHash === uploadHash) {
      console.log("Same files already uploaded, ignoring duplicate");
      setError("These files have already been uploaded");
      return;
    }

    setUploadInProgress(true);
    setUploadState("uploading");
    setError("");
    setNonWorkoutMessage("");
    sdk.haptics.impactOccurred("medium");

    // Simulate progress updates
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
        notes: `Workout uploaded on ${new Date().toLocaleDateString()}`,
      };

      const result = await uploadWorkout.mutateAsync(uploadData);
      console.log("************************************************** ");
      console.log("************************************************** ");
      console.log("************************************************** ");
      console.log("************************************************** ");
      console.log("UPLOAD RESULT ::: ", JSON.stringify(result, null, 2));
      console.log("************************************************** ");
      console.log("************************************************** ");
      console.log("************************************************** ");
      console.log("************************************************** ");

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Check if the uploaded images were not workout images
      if (result.data.extractedData.isWorkoutImage === false) {
        console.log("Non-workout image detected:", result.data.extractedData);
        setNonWorkoutMessage(
          result.data.extractedData.errorMessage ||
            "🏃‍♂️ That doesn't look like a workout screenshot! Try uploading images from your running app instead."
        );
        setUploadState("not_workout_image");
        sdk.haptics.notificationOccurred("warning");
        return;
      }

      // Only proceed if we have valid workout data
      if (result.data.extractedData.confidence > 0) {
        // Success - store the hash
        setLastUploadHash(uploadHash);
        setExtractedData(result.data.extractedData);
        setCompletedRun(result.data.completedRun);

        // Success feedback
        sdk.haptics.notificationOccurred("success");

        // Navigate to run detail page with celebration state
        navigate(`/runs/${result.data.completedRun.id}`, {
          state: { fromUpload: true },
        });

        // Call onComplete callback if provided
        if (onComplete) {
          onComplete(result.data.completedRun);
        }
      } else {
        // Handle case where confidence is 0 (no valid data extracted)
        setError(
          "Failed to extract workout data. Please try with clearer screenshots."
        );
        setUploadState("error");
        sdk.haptics.notificationOccurred("error");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setError(error instanceof Error ? error.message : "Upload failed");
      setUploadState("error");
      sdk.haptics.notificationOccurred("error");
    } finally {
      setUploadInProgress(false);
      setUploadProgress(0);
    }
  }, [
    selectedFiles,
    uploadWorkout,
    uploadInProgress,
    lastUploadHash,
    createUploadHash,
    navigate,
    onComplete,
  ]);

  // Verification handler
  const handleVerification = useCallback(async () => {
    if (!completedRun) return;

    try {
      const result = await verifyWorkout.mutateAsync(completedRun.id);
      setCompletedRun(result.data);
      sdk.haptics.notificationOccurred("success");

      // Navigate to run detail page with celebration state
      navigate(`/runs/${result.data.id}`, {
        state: { fromUpload: true },
      });

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(result.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      sdk.haptics.notificationOccurred("error");
    }
  }, [completedRun, verifyWorkout, onComplete, navigate]);

  // Reset handler
  const handleReset = useCallback(() => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setExtractedData(null);
    setCompletedRun(null);
    setError("");
    setNonWorkoutMessage("");
    setUploadState("initial");
    setUploadInProgress(false);
    setLastUploadHash("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    sdk.haptics.selectionChanged();
  }, []);

  // Try again with new images handler
  const handleTryAgain = useCallback(() => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setExtractedData(null);
    setCompletedRun(null);
    setError("");
    setNonWorkoutMessage("");
    setUploadState("initial");
    setUploadInProgress(false);
    // Don't reset lastUploadHash to prevent the same files from being uploaded again

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    sdk.haptics.selectionChanged();
  }, []);

  // Trigger file selection
  const triggerFileSelect = useCallback(() => {
    sdk.haptics.selectionChanged();
    fileInputRef.current?.click();
  }, []);

  // Remove file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    sdk.haptics.selectionChanged();
  }, []);

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

  // Handle "don't show again" preference
  const handleDontShowAgain = () => {
    localStorage.setItem("hideWorkoutInstructions", "true");
    setShowInstructions(false);
    sdk.haptics.selectionChanged();
  };

  return (
    <div className={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Header */}
      <div className={styles.header}>
        <Typography
          variant="gta"
          weight="wide"
          size={24}
          className={styles.title}
        >
          Share Your Run
        </Typography>
        {onClose && (
          <IconButton
            variant="secondary"
            icon={<CloseIcon />}
            onClick={onClose}
            className={styles.closeButton}
          />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.errorMessage}
        >
          <Typography
            variant="geist"
            weight="medium"
            size={14}
            className={styles.errorText}
          >
            {error}
          </Typography>
        </motion.div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {/* Initial State */}
          {uploadState === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.initialState}
            >
              {showInstructions ? (
                <div className={styles.uploadPrompt}>
                  <div className={styles.uploadIcon}>📱</div>
                  <Typography
                    variant="geist"
                    weight="medium"
                    size={18}
                    className={styles.uploadTitle}
                  >
                    Upload Your Run Screenshots
                  </Typography>
                  <Typography
                    variant="geist"
                    weight="regular"
                    size={14}
                    className={styles.uploadDescription}
                  >
                    Take screenshots from your running app and our AI will
                    extract your run data to share with the community
                  </Typography>
                  <div className={styles.uploadTips}>
                    <Typography
                      variant="geist"
                      weight="medium"
                      size={12}
                      className={styles.tipsTitle}
                    >
                      💡 Tips for best results:
                    </Typography>
                    <ul className={styles.tipsList}>
                      <li>Take screenshots of your run summary</li>
                      <li>Include distance, time, and pace information</li>
                      <li>Make sure text is clearly visible</li>
                      <li>Upload up to 4 screenshots</li>
                    </ul>
                  </div>
                  <div className={styles.dontShowAgain}>
                    <button
                      onClick={handleDontShowAgain}
                      className={styles.dontShowAgainButton}
                    >
                      <Typography
                        variant="geist"
                        weight="regular"
                        size={12}
                        className={styles.dontShowAgainText}
                      >
                        Don't show this screen again
                      </Typography>
                    </button>
                  </div>
                </div>
              ) : (
                <WorkoutHistory />
              )}
            </motion.div>
          )}

          {/* Non-Workout Image State */}
          {uploadState === "not_workout_image" && (
            <motion.div
              key="not_workout_image"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.notWorkoutState}
            >
              <div className={styles.notWorkoutPrompt}>
                <div className={styles.notWorkoutIcon}>🤔</div>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={18}
                  className={styles.notWorkoutTitle}
                >
                  Oops! Wrong Type of Image
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={14}
                  className={styles.notWorkoutMessage}
                >
                  {nonWorkoutMessage}
                </Typography>
                <div className={styles.workoutAppExamples}>
                  <Typography
                    variant="geist"
                    weight="medium"
                    size={12}
                    className={styles.examplesTitle}
                  >
                    📱 Try screenshots from these apps:
                  </Typography>
                  <div className={styles.appsList}>
                    <span className={styles.appName}>Nike Run Club</span>
                    <span className={styles.appName}>Strava</span>
                    <span className={styles.appName}>Garmin Connect</span>
                    <span className={styles.appName}>Apple Fitness</span>
                    <span className={styles.appName}>Adidas Running</span>
                    <span className={styles.appName}>MapMyRun</span>
                  </div>
                </div>
                <div className={styles.workoutDataExample}>
                  <Typography
                    variant="geist"
                    weight="medium"
                    size={12}
                    className={styles.exampleTitle}
                  >
                    🎯 We're looking for screenshots that show:
                  </Typography>
                  <ul className={styles.dataList}>
                    <li>Distance (e.g., 5.2 km)</li>
                    <li>Time (e.g., 28:45)</li>
                    <li>Pace (e.g., 5:30/km)</li>
                    <li>Calories burned</li>
                    <li>Route maps</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* File Selection State */}
          {uploadState === "selecting" && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.fileSelection}
            >
              <Typography
                variant="geist"
                weight="medium"
                size={16}
                className={styles.sectionTitle}
              >
                Selected Screenshots ({selectedFiles.length}/4)
              </Typography>

              <div className={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.fileItem}
                  >
                    <div className={styles.filePreview}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                      />
                    </div>
                    <div className={styles.fileInfo}>
                      <Typography
                        variant="geist"
                        weight="medium"
                        size={12}
                        className={styles.fileName}
                      >
                        {file.name}
                      </Typography>
                      <Typography
                        variant="geist"
                        weight="regular"
                        size={10}
                        className={styles.fileSize}
                      >
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </div>
                    <IconButton
                      variant="secondary"
                      icon={<CloseIcon />}
                      onClick={() => removeFile(index)}
                      className={styles.removeFileButton}
                    />
                  </motion.div>
                ))}
              </div>

              {selectedFiles.length < 4 && (
                <Button
                  variant="secondary"
                  caption="Add More Screenshots"
                  onClick={triggerFileSelect}
                  className={styles.addMoreButton}
                />
              )}
            </motion.div>
          )}

          {/* Upload Progress State */}
          {(uploadState === "uploading" || uploadState === "processing") && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.uploadProgress}
            >
              <Typography
                variant="geist"
                weight="medium"
                size={16}
                className={styles.progressTitle}
              >
                {uploadState === "uploading"
                  ? "Uploading Screenshots..."
                  : "Processing with AI..."}
              </Typography>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <Typography
                variant="geist"
                weight="regular"
                size={14}
                className={styles.progressText}
              >
                {uploadProgress}% complete
              </Typography>

              <Typography
                variant="geist"
                weight="regular"
                size={12}
                className={styles.progressHint}
              >
                {uploadState === "uploading"
                  ? "Uploading your screenshots to our servers..."
                  : "Our AI is extracting workout data from your screenshots..."}
              </Typography>
            </motion.div>
          )}

          {/* Verification State */}
          {uploadState === "verification" && extractedData && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.verification}
            >
              <Typography
                variant="geist"
                weight="medium"
                size={16}
                className={styles.sectionTitle}
              >
                Review Extracted Data
              </Typography>

              <div className={styles.confidenceIndicator}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={12}
                  className={styles.confidenceLabel}
                >
                  AI Confidence:
                </Typography>
                <div
                  className={styles.confidenceBadge}
                  style={{
                    backgroundColor: getConfidenceColor(
                      extractedData.confidence
                    ),
                  }}
                >
                  <Typography
                    variant="geist"
                    weight="medium"
                    size={12}
                    className={styles.confidenceText}
                  >
                    {getConfidenceText(extractedData.confidence)} (
                    {Math.round(extractedData.confidence * 100)}%)
                  </Typography>
                </div>
              </div>

              <div className={styles.extractedData}>
                <div className={styles.dataRow}>
                  <Typography variant="geist" weight="medium" size={14}>
                    Distance:
                  </Typography>
                  <Typography variant="geist" weight="regular" size={14}>
                    {extractedData.distance} km
                  </Typography>
                </div>
                <div className={styles.dataRow}>
                  <Typography variant="geist" weight="medium" size={14}>
                    Duration:
                  </Typography>
                  <Typography variant="geist" weight="regular" size={14}>
                    {extractedData.duration} minutes
                  </Typography>
                </div>
                <div className={styles.dataRow}>
                  <Typography variant="geist" weight="medium" size={14}>
                    Pace:
                  </Typography>
                  <Typography variant="geist" weight="regular" size={14}>
                    {extractedData.pace}
                  </Typography>
                </div>
                <div className={styles.dataRow}>
                  <Typography variant="geist" weight="medium" size={14}>
                    Calories:
                  </Typography>
                  <Typography variant="geist" weight="regular" size={14}>
                    {extractedData.calories}
                  </Typography>
                </div>
                <div className={styles.dataRow}>
                  <Typography variant="geist" weight="medium" size={14}>
                    Running App:
                  </Typography>
                  <Typography variant="geist" weight="regular" size={14}>
                    {extractedData.runningApp}
                  </Typography>
                </div>
              </div>

              <Typography
                variant="geist"
                weight="regular"
                size={12}
                className={styles.verificationHint}
              >
                Please verify that the extracted data is correct before sharing.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {uploadState === "initial" && (
          <Button
            variant="primary"
            caption="Select Screenshots"
            onClick={triggerFileSelect}
            className={styles.primaryButton}
          />
        )}

        {uploadState === "not_workout_image" && (
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              caption="Cancel"
              onClick={onClose || (() => {})}
              className={styles.secondaryButton}
            />
            <Button
              variant="primary"
              caption="🏃‍♂️ Try Different Screenshots"
              onClick={handleTryAgain}
              className={styles.primaryButton}
            />
          </div>
        )}

        {uploadState === "selecting" && (
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              caption="Cancel"
              onClick={handleReset}
              className={styles.secondaryButton}
            />
            <Button
              variant="primary"
              caption={`upload ${selectedFiles.length} screenshot${
                selectedFiles.length > 1 ? "s" : ""
              }`}
              onClick={handleUpload}
              disabled={uploadWorkout.isPending || uploadInProgress}
              className={styles.primaryButton}
            />
          </div>
        )}

        {uploadState === "verification" && (
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              caption="edit data"
              onClick={() => setUploadState("selecting")}
              className={styles.secondaryButton}
            />
            <Button
              variant="primary"
              caption="✅ Confirm & Share"
              onClick={handleVerification}
              disabled={verifyWorkout.isPending}
              className={styles.primaryButton}
            />
          </div>
        )}

        {uploadState === "error" && (
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              caption="Try Again"
              onClick={handleReset}
              className={styles.secondaryButton}
            />
            <Button
              variant="primary"
              caption="Close"
              onClick={onClose || (() => {})}
              className={styles.primaryButton}
            />
          </div>
        )}

        {(uploadState === "uploading" || uploadState === "processing") && (
          <Button
            variant="primary"
            caption="Processing..."
            onClick={() => {}}
            disabled
            className={styles.primaryButton}
          />
        )}
      </div>
    </div>
  );
};

export default WorkoutUploadFlow;
