// src/shared/layouts/AppLayout/index.tsx

import React, { useState } from "react";

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

  return (
    <div className={styles.layout}>
      {/* Sponsor Bar */}
      <div
        className={styles.sponsorBar}
        onClick={() => {
          sdk.actions.swapToken({
            sellToken: "eip155:8453/native", // ETH
            buyToken:
              "eip8453:8453/erc20:0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a", // $RUNNER
            sellAmount: "69420000000000000", // 1 ETH (example)
          });
        }}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeText}>
            <span>
              this miniapp is sponsored by <b>$RUNNER</b>
            </span>
          </div>
        </div>
      </div>
      <div className={styles.content}>{children}</div>

      <div className={styles.bar}>
        <RunnerNavigationBar />
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
