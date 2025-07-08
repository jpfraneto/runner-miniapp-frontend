// src/shared/layouts/AppLayout/index.tsx

import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Components
// import NavigationBar from "@/components/NavigationBar";
import RunnerNavigationBar from "@/shared/components/NavigationBar/RunnerNavigationBar";

// StyleSheet
import styles from "./AppLayout.module.scss";
import WorkoutUploadFlow from "@/shared/components/WorkoutUploadFlow";
import { CompletedRun } from "@/shared/hooks/user/useUploadWorkout";

// Hooks
// import { useAuth } from "@/hooks/auth";
import sdk from "@farcaster/frame-sdk";

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // const { data: user } = useAuth();
  const [showUploadFlow, setShowUploadFlow] = useState(false);

  const handleUploadComplete = (_completedRun: CompletedRun) => {
    setShowUploadFlow(false);
    sdk.haptics.notificationOccurred("success");
  };

  const handleCloseUploadFlow = () => {
    setShowUploadFlow(false);
  };

  const handleLogRun = () => {
    sdk.haptics.selectionChanged();
    setShowUploadFlow(true);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>

      <div className={styles.bar}>
        <RunnerNavigationBar onLogRun={handleLogRun} />
      </div>

      {showUploadFlow && (
        <WorkoutUploadFlow
          onComplete={handleUploadComplete}
          onClose={handleCloseUploadFlow}
        />
      )}
    </div>
  );
};

export default AppLayout;
