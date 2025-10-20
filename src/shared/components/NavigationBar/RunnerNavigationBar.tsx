// Dependencies
import React, { useCallback, useState } from "react";
import classNames from "clsx";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

import { FaHome } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

// Components
import CastVerificationScreen from "@/shared/components/CastVerificationScreen";

// Hooks
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";
import { useProcessingRuns } from "@/shared/providers/ProcessingRunsProvider";

// Services
import { verifyAndProcessCast } from "@/services/user";

// Error handling
import {
  handleSubmissionError,
  isErrorResponse,
  UserFriendlyError,
} from "@/shared/utils/errorHandling";

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
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [submissionError, setSubmissionError] =
    useState<UserFriendlyError | null>(null);

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
      // Open cast composer
      const response = await sdk.actions.composeCast({
        text: "[add screenshots and running session info here. then delete this and cast]",
        embeds: ["https://runnercoin.lat"],
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

          // Check if response is an error
          if (isErrorResponse(verificationResponse)) {
            console.error(
              "❌ Cast verification failed:",
              verificationResponse.error
            );

            // Handle the structured error response
            const errorDetails = handleSubmissionError(
              verificationResponse.error,
              {
                trackAnalytics: true,
                onRetry: () => {
                  // Retry functionality - could reopen cast composer or retry processing
                  setSubmissionError(null);
                  setShowProcessingScreen(false);
                  setProcessingData(null);
                  setVerificationResult(null);
                },
                onSignUp: () => {
                  // Navigate to sign up or account creation
                  setSubmissionError(null);
                  setShowProcessingScreen(false);
                  // Could navigate to a sign-up flow or show instructions
                },
              }
            );

            setSubmissionError(errorDetails);
            setVerificationResult(verificationResponse);
            setIsVerifying(false);
          } else {
            // Success case
            setVerificationResult(verificationResponse);
            setIsVerifying(false);
            setSubmissionError(null);

            // Show result in processing screen
            if (verificationResponse.verified) {
              console.log("✅ Cast verified and processed successfully");
              // Refresh workout feed to show new verified cast
              window.dispatchEvent(new CustomEvent("refreshWorkouts"));
            } else {
              console.log(
                "❌ Cast verification failed:",
                verificationResponse.message
              );
            }
          }
        } catch (err: any) {
          console.error("Cast verification error:", err);
          setIsVerifying(false);

          // Handle network or unexpected errors
          const networkError = handleSubmissionError(
            {
              type: err.type,
              message: err.message,
              code: err.code,
              statusCode: err.statusCode,
            },
            {
              trackAnalytics: true,
              onRetry: () => {
                setSubmissionError(null);
                setShowProcessingScreen(false);
                setProcessingData(null);
                setVerificationResult(null);
              },
            }
          );

          setSubmissionError(networkError);
          setVerificationResult({
            success: false,
            verified: false,
            isWorkoutImage: false,
            message: networkError.message,
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
    setSubmissionError(null);
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
            sdk.haptics.impactOccurred("light");
            navigate("/");
          }}
        >
          <div className={styles.iconWrapper}>
            <FaHome className={styles.icon} />
          </div>
        </button>

        {/* Run Tab (Center with special styling) */}
        <button
          className={classNames(styles.tab, styles.runTab)}
          onClick={handleClickLogRun}
        >
          <div className={styles.runIconWrapper}>
            <FaRunning className={styles.runIcon} />
          </div>
        </button>

        {/* Leaderboard Tab */}
        <button
          className={classNames(styles.tab, {
            [styles.active]: isActive("/leaderboard"),
          })}
          onClick={() => {
            sdk.haptics.impactOccurred("medium");
            navigate("/leaderboard");
          }}
        >
          <div className={styles.iconWrapper}>
            <FaTrophy className={styles.icon} />
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
          submissionError={submissionError}
          onComplete={handleProcessingComplete}
        />
      )}
    </>
  );
};

export default RunnerNavigationBar;
