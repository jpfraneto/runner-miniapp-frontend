// Dependencies
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import RunnerNavigationBar from "@/shared/components/NavigationBar/RunnerNavigationBar";
import Typography from "@/shared/components/Typography";
import AIAgent from "@/shared/components/AIAgent";

// Hooks
import { useAuth } from "@/shared/hooks/auth";
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";

// StyleSheet
import styles from "./MiniAppPage.module.scss";

// SDK
import sdk from "@farcaster/frame-sdk";

// Partial components
import HomePageRunner from "../HomePage/partials/HomePageRunner";
import WorkoutUploadFlow from "@/shared/components/WorkoutUploadFlow";
import WorkoutPage from "./partials/WorkoutPage";
import ProgressPage from "./partials/ProgressPage";
import CommunityPage from "./partials/CommunityPage";

// Types
import { CompletedRun } from "@/shared/hooks/user/useUploadWorkout";

const MiniAppPage: React.FC = () => {
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const { data: user } = useAuth();
  const { data: todaysMission, isLoading: missionLoading } = useTodaysMission();

  const handleUploadComplete = (completedRun: CompletedRun) => {
    setShowUploadFlow(false);
    sdk.haptics.notificationOccurred("success");
  };

  const handleCloseUploadFlow = () => {
    setShowUploadFlow(false);
  };

  const handleLogWorkout = () => {
    sdk.haptics.selectionChanged();
    setShowUploadFlow(true);
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Typography
              variant="gta"
              weight="wide"
              size={32}
              lineHeight={28}
              className={styles.mainTitle}
            >
              $RUNNER
            </Typography>
            <Typography
              variant="geist"
              weight="regular"
              size={12}
              lineHeight={16}
              className={styles.subtitle}
            >
              Your AI Running Coach
            </Typography>
          </div>

          {/* AI Agent Welcome */}
          <div className={styles.aiWelcome}>
            <AIAgent
              message="Hey runner! Ready to crush your goals today? 🏃‍♂️"
              button1Text="Hell yeah!"
              button2Text="Not today"
              onButton1Click={() => console.log("User clicked: Hell yeah!")}
              onButton2Click={() => console.log("User clicked: Not today")}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePageRunner />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button
            className={styles.logWorkoutButton}
            onClick={handleLogWorkout}
            disabled={missionLoading || todaysMission?.hasCompletedToday}
          >
            <Typography
              variant="geist"
              weight="medium"
              size={14}
              className={styles.buttonText}
            >
              {missionLoading
                ? "Loading..."
                : todaysMission?.hasCompletedToday
                ? "✅ Run Logged Today"
                : "📱 Log Today's Run"}
            </Typography>
          </button>
        </div>

        {/* Upload Flow Modal */}
        {showUploadFlow && (
          <WorkoutUploadFlow
            onComplete={handleUploadComplete}
            onClose={handleCloseUploadFlow}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default MiniAppPage;
