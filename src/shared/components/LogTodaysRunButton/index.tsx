// src/shared/components/LogTodaysRunButton/LogTodaysRunButton.tsx

import { useState } from "react";
import sdk from "@farcaster/frame-sdk";
import Button from "../Button";
import WorkoutUploadFlow from "../WorkoutUploadFlow";
import styles from "./LogTodaysRunButton.module.scss";

// Hooks
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";

// Types
import { CompletedRun } from "@/shared/hooks/user/useUploadWorkout";
import { router } from "@/config/router";

const LogTodaysRunButton = ({
  isInsideMiniapp,
  setIsInsideMiniapp,
}: {
  isInsideMiniapp: boolean;
  setIsInsideMiniapp: (isInsideMiniapp: boolean) => void;
}) => {
  const [showUploadFlow, setShowUploadFlow] = useState(false);

  // Hooks
  const { data: todaysMission, isLoading: missionLoading } = useTodaysMission();

  // Don't show button if user already completed today's run
  const hasCompletedToday = todaysMission?.hasCompletedToday;

  const handleUploadComplete = (completedRun: CompletedRun) => {
    setShowUploadFlow(false);
    // Navigation is now handled by the WorkoutUploadFlow component
    // The run detail page will handle sharing
  };

  const handleCloseUploadFlow = () => {
    setShowUploadFlow(false);
  };

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
    return (
      <div className={styles.quickActions}>
        <Button
          variant="primary"
          onClick={() => {
            sdk.haptics.selectionChanged();
            setIsInsideMiniapp(true);
            router.navigate("/miniapp");
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
            setShowUploadFlow(true);
          }}
          className={styles.logRunButton}
        />
      </div>

      {showUploadFlow && (
        <WorkoutUploadFlow
          onComplete={handleUploadComplete}
          onClose={handleCloseUploadFlow}
        />
      )}
    </>
  );
};

export default LogTodaysRunButton;
