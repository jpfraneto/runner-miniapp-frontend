// Dependencies
import React, { useCallback, useState } from "react";
import classNames from "clsx";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

// SVG Icons
import HomeIcon from "./icons/HomeIcon";
import RunningIcon from "./icons/RunningIcon";
import LeaderboardIcon from "./icons/LeaderboardIcon";

// Components
import CastVerificationScreen from "@/shared/components/CastVerificationScreen";

// Hooks
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";
import { useProcessingRuns } from "@/shared/providers/ProcessingRunsProvider";

// Services
import { verifyAndProcessCast } from "@/services/user";

interface RunnerNavigationBarProps {}

const RunnerNavigationBar: React.FC<RunnerNavigationBarProps> = () => {
  const navigate = useNavigate();
  const { addProcessingRun } = useProcessingRuns();
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const [processingData, setProcessingData] = useState<{
    castHash: string;
    text: string;
    embeds: string[];
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    verified: boolean;
    isWorkoutImage: boolean;
    replyData?: {
      castHash: string;
      text: string;
      message: string;
    };
    run?: {
      distanceMeters?: number;
      duration?: number;
    };
    message: string;
  } | null>(null);

  const isActive = (path: string) => {
    const currentPath = window.location.pathname;
    if (path === "/" && (currentPath === "/" || currentPath === "/home"))
      return true;
    if (path === "/running" && currentPath === "/running") return true;
    if (path === "/leaderboard" && currentPath === "/leaderboard") return true;
    return false;
  };

  /**
   * Handles the run button click - opens cast composer and verifies/processes the cast
   */
  const handleClickLogRun = useCallback(async () => {
    sdk.haptics.selectionChanged();

    try {
      console.log("COMPOSING A NEW CAT");
      // Open cast composer
      const response = await sdk.actions.composeCast({
        text: "[insert run details and screenshots here]",
        embeds: [],
        channelKey: "running",
      });

      console.log("Cast response:", response);

      // If cast was successful, send to training-service for verification and processing
      if (response && response.cast && response.cast.hash) {
        const processingRun = {
          id: `processing-${Date.now()}`,
          castHash: response.cast.hash,
          text: response.cast.text || "",
          embeds: response.cast.embeds || [],
          timestamp: Date.now(),
        };

        addProcessingRun(processingRun);

        // Set processing data and show processing screen
        setProcessingData({
          castHash: response.cast.hash,
          text: response.cast.text || "",
          embeds: response.cast.embeds || [],
        });
        setShowProcessingScreen(true);
        setIsVerifying(true);

        try {
          // Call training-service to verify and process the cast
          const verificationResponse = await verifyAndProcessCast({
            castHash: response.cast.hash,
            text: response.cast.text || "",
            embeds: response.cast.embeds || [],
          });

          console.log("Cast verification response:", verificationResponse);

          setVerificationResult(verificationResponse);
          setIsVerifying(false);

          // Show result in processing screen
          if (verificationResponse.verified) {
            console.log("✅ Cast verified and processed successfully");
          } else {
            console.log(
              "❌ Cast verification failed:",
              verificationResponse.message
            );
          }
        } catch (verificationError) {
          console.error("Cast verification error:", verificationError);
          setIsVerifying(false);
          setVerificationResult({
            success: false,
            verified: false,
            isWorkoutImage: false,
            message: "Failed to verify cast. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to compose cast:", error);
    }
  }, [addProcessingRun]);

  const handleProcessingComplete = () => {
    setShowProcessingScreen(false);
    setProcessingData(null);
    setIsVerifying(false);
    setVerificationResult(null);
    navigate("/");
  };

  return (
    <>
      <div className={classNames(styles.layout)}>
        {/* Home Tab */}
        <button
          className={classNames(styles.tab, {
            [styles.active]: isActive("/"),
          })}
          onClick={() => {
            navigate("/");
          }}
        >
          <div className={styles.iconWrapper}>
            <HomeIcon className={styles.icon} />
          </div>
        </button>

        {/* Run Tab (Center with special styling) */}
        <button
          className={classNames(styles.tab, styles.runTab)}
          onClick={handleClickLogRun}
        >
          <div className={styles.runIconWrapper}>
            <RunningIcon className={styles.runIcon} />
          </div>
        </button>

        {/* Leaderboard Tab */}
        <button
          className={classNames(styles.tab, {
            [styles.active]: isActive("/leaderboard"),
          })}
          onClick={() => {
            navigate("/leaderboard");
          }}
        >
          <div className={styles.iconWrapper}>
            <LeaderboardIcon className={styles.icon} />
          </div>
        </button>
      </div>

      {/* Cast Verification Screen */}
      {showProcessingScreen && processingData && (
        <CastVerificationScreen
          castHash={processingData.castHash}
          text={processingData.text}
          embeds={processingData.embeds}
          isVerifying={isVerifying}
          verificationResult={verificationResult}
          onComplete={handleProcessingComplete}
        />
      )}
    </>
  );
};

export default RunnerNavigationBar;
