// src/shared/components/LogTodaysRunButton/LogTodaysRunButton.tsx

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import sdk from "@farcaster/frame-sdk";
import Button from "../Button";
import Typography from "../Typography";
import IconButton from "../IconButton";
import styles from "./LogTodaysRunButton.module.scss";

// Hooks
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";
import {
  useUploadWorkout,
  type UploadWorkoutData,
} from "@/shared/hooks/user/useUploadWorkout";

import { RunningSession } from "@/shared/types/running";

// Assets
import CloseIcon from "@/shared/assets/icons/close-icon.svg?react";

// Types
import { useNavigate } from "react-router-dom";

type UploadState =
  | "initial"
  | "selecting"
  | "uploading"
  | "processing"
  | "verification"
  | "error"
  | "not_workout_image"
  | "summary";

const LogTodaysRunButton = ({
  setIsInsideMiniapp,
}: {
  isInsideMiniapp: boolean;
  setIsInsideMiniapp: (isInsideMiniapp: boolean) => void;
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("initial");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [runningSession, setRunningSession] = useState<RunningSession | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Hooks
  const { todaysMission, isLoading: missionLoading } = useTodaysMission();
  const uploadMutation = useUploadWorkout();

  // Don't show button if user already completed today's run
  const hasCompletedToday = todaysMission?.hasCompletedToday;

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setUploadState("selecting");
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setUploadState("uploading");
    setError(null);

    try {
      const uploadData: UploadWorkoutData = {
        screenshots: selectedFiles,
        notes: "",
      };

      const result = await uploadMutation.mutateAsync(uploadData);

      if (
        result.extractedData.isWorkoutImage &&
        Number(result.extractedData.confidence) > 0
      ) {
        setRunningSession(result.runningSession);
        setUploadState("summary");
      } else {
        setUploadState("not_workout_image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, [selectedFiles, uploadMutation]);

  const handleCloseUploadFlow = useCallback(() => {
    setShowUploadModal(false);
    setUploadState("initial");
    setSelectedFiles([]);
    setUploadProgress(0);
    setError(null);
    setRunningSession(null);
  }, []);

  const handleRetry = useCallback(() => {
    setUploadState("initial");
    setError(null);
  }, []);

  if (missionLoading) {
    return (
      <div className={styles.quickActions}>
        <Button
          variant="primary"
          onClick={() => {}}
          caption="Loading..."
          disabled
          className={styles.logRunButton}
        />
      </div>
    );
  }

  if (hasCompletedToday) {
    navigate("/");
    return (
      <div className={styles.quickActions}>
        <Button
          variant="primary"
          onClick={() => {
            sdk.haptics.selectionChanged();
            setIsInsideMiniapp(true);
            navigate("/");
          }}
          caption="Open Miniapp"
          className={styles.logRunButton}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.quickActions}>
        <Button
          variant="primary"
          caption="📱 log a run"
          onClick={() => {
            sdk.haptics.selectionChanged();
            setShowUploadModal(true);
            setUploadState("initial");
          }}
          className={styles.logRunButton}
        />
      </div>

      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
            >
              <div className={styles.header}>
                <Typography as="h2" variant="geist">
                  Upload Running Session
                </Typography>
                <IconButton
                  onClick={handleCloseUploadFlow}
                  icon={<CloseIcon />}
                />
              </div>

              <div className={styles.content}>
                {uploadState === "initial" && (
                  <div className={styles.initialState}>
                    <Typography variant="geist">
                      Upload screenshots from your running app to log your run
                    </Typography>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="primary"
                      caption="Select Screenshots"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      style={{ display: "none" }}
                    />
                  </div>
                )}

                {uploadState === "selecting" && (
                  <div className={styles.selectingState}>
                    <Typography variant="geist">
                      {selectedFiles.length} file(s) selected
                    </Typography>
                    <Button
                      onClick={handleUpload}
                      variant="primary"
                      caption="Upload Running Session"
                    />
                    <Button
                      onClick={handleCloseUploadFlow}
                      variant="secondary"
                      caption="Cancel"
                    />
                  </div>
                )}

                {uploadState === "uploading" && (
                  <div className={styles.uploadingState}>
                    <Typography variant="geist">
                      Uploading running session...
                    </Typography>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === "error" && (
                  <div className={styles.errorState}>
                    <Typography variant="geist">{error}</Typography>
                    <Button
                      onClick={handleRetry}
                      variant="primary"
                      caption="Try Again"
                    />
                    <Button
                      onClick={handleCloseUploadFlow}
                      variant="secondary"
                      caption="Cancel"
                    />
                  </div>
                )}

                {uploadState === "not_workout_image" && (
                  <div className={styles.notWorkoutState}>
                    <Typography variant="geist">
                      The uploaded images don't appear to be workout
                      screenshots. Please try uploading screenshots from your
                      running app.
                    </Typography>
                    <Button
                      onClick={handleRetry}
                      variant="primary"
                      caption="Try Again"
                    />
                    <Button
                      onClick={handleCloseUploadFlow}
                      variant="secondary"
                      caption="Cancel"
                    />
                  </div>
                )}

                {uploadState === "summary" && runningSession && (
                  <div className={styles.summaryState}>
                    <Typography as="h3" variant="geist">
                      Workout Uploaded Successfully!
                    </Typography>
                    <div className={styles.workoutSummary}>
                      <Typography variant="geist">
                        Distance: {runningSession?.distance}km
                      </Typography>
                      <Typography variant="geist">
                        Duration:{" "}
                        {Math.floor(Number(runningSession?.duration) || 0)}:
                        {(((Number(runningSession?.duration) || 0) % 1) * 60)
                          .toFixed(0)
                          .padStart(2, "0")}
                      </Typography>
                      <Typography variant="geist">
                        Pace: {runningSession?.pace}
                      </Typography>
                    </div>
                    <Button
                      onClick={handleCloseUploadFlow}
                      variant="primary"
                      caption="Done"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogTodaysRunButton;
