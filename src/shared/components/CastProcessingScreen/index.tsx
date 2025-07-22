import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Typography from "@/shared/components/Typography";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import NotificationPrompt from "@/shared/components/NotificationPrompt";
import ShareRunView from "@/shared/components/ShareRunView";
import ShareSuccessView from "@/shared/components/ShareSuccessView";
import Button from "@/shared/components/Button";

// Context
import { AuthContext } from "@/shared/providers/AppProvider";

// Services
import { processCast } from "@/services/castProcessing";

// Types
import { RunShareVerificationResponse } from "@/services/user";

// Styles
import styles from "./CastProcessingScreen.module.scss";

interface CastProcessingScreenProps {
  castHash: string;
  text: string;
  embeds: string[];
  onComplete: (runData?: any) => void;
}

type ViewState = "processing" | "complete" | "share" | "shareSuccess";

const CastProcessingScreen: React.FC<CastProcessingScreenProps> = ({
  castHash,
  text,
  embeds,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { miniappContext } = useContext(AuthContext);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [_processingComplete, setProcessingComplete] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("processing");
  const [processedRunData, setProcessedRunData] = useState<any>(null);
  const [shareVerificationResult, setShareVerificationResult] =
    useState<RunShareVerificationResponse | null>(null);

  useEffect(() => {
    // Call the backend to process the cast
    const processCastData = async () => {
      try {
        console.log("Processing cast:", { castHash, text, embeds });

        const response = await processCast({
          castHash,
          text,
          embeds,
        });

        console.log("Cast processing response:", response);

        if (response.success) {
          // Cast was processed successfully
          setProcessingComplete(true);
          setCurrentView("complete");
          setProcessedRunData(response.data);
          setShowNotificationPrompt(true);

          // Call onComplete with the processed data
          onComplete(response.data);
        } else {
          console.error("Failed to process cast:", response.message);
          // Handle error - could show error state or retry
          setProcessingComplete(true);
          setCurrentView("complete");
          setShowNotificationPrompt(true);
        }
      } catch (error) {
        console.error("Error processing cast:", error);
        // Handle error - could show error state or retry
        setProcessingComplete(true);
        setCurrentView("complete");
        setShowNotificationPrompt(true);
      }
    };

    processCastData();
  }, [castHash, text, embeds, onComplete]);

  const handleNotificationComplete = () => {
    setShowNotificationPrompt(false);
  };

  const handleShareRun = () => {
    setCurrentView("share");
  };

  const handleSkipShare = () => {
    onComplete();
    navigate("/");
  };

  const handleShareSuccess = (result: RunShareVerificationResponse) => {
    setShareVerificationResult(result);
    setCurrentView("shareSuccess");
  };

  const handleShareSuccessComplete = () => {
    onComplete();
    navigate("/");
  };

  // Handle different view states
  if (currentView === "share" && processedRunData?.runningSession) {
    return (
      <ShareRunView
        runData={processedRunData.runningSession}
        onSkip={handleSkipShare}
        onSuccess={handleShareSuccess}
      />
    );
  }

  if (currentView === "shareSuccess" && shareVerificationResult) {
    return (
      <ShareSuccessView
        verificationResult={shareVerificationResult}
        onContinue={handleShareSuccessComplete}
      />
    );
  }

  return (
    <div className={styles.container}>
      {currentView === "processing" ? (
        <div className={styles.processingContent}>
          <div className={styles.icon}>🏃‍♂️</div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            Processing Your Run
          </Typography>

          <Typography size={16} className={styles.description}>
            We're analyzing your run data and extracting your stats...
          </Typography>

          <div className={styles.castInfo}>
            <Typography size={14} className={styles.castHash}>
              Cast: {castHash.slice(0, 10)}...{castHash.slice(-8)}
            </Typography>

            {text && (
              <Typography size={14} className={styles.castText}>
                "{text.slice(0, 100)}
                {text.length > 100 ? "..." : ""}"
              </Typography>
            )}

            {embeds.length > 0 && (
              <Typography size={14} className={styles.embedsCount}>
                {embeds.length} image{embeds.length > 1 ? "s" : ""} attached
              </Typography>
            )}
          </div>

          <div className={styles.loaderContainer}>
            <LoaderIndicator />
            <Typography size={14} className={styles.loadingText}>
              Extracting run data...
            </Typography>
          </div>
        </div>
      ) : (
        <div className={styles.completeContent}>
          <div className={styles.icon}>✅</div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            Run Processed!
          </Typography>

          <Typography size={16} className={styles.description}>
            Your run has been successfully processed and added to your profile.
          </Typography>

          {showNotificationPrompt && !processedRunData ? (
            <div className={styles.notificationPrompt}>
              <NotificationPrompt
                userFid={miniappContext?.user?.fid || 0}
                onComplete={handleNotificationComplete}
                points={0}
              />
            </div>
          ) : processedRunData?.runningSession ? (
            <div className={styles.shareActions}>
              <Typography size={14} className={styles.sharePrompt}>
                Share your achievement with the community?
              </Typography>

              <div className={styles.actionButtons}>
                <Button
                  variant="primary"
                  caption="Share Run"
                  onClick={handleShareRun}
                  className={styles.shareButton}
                />

                <Button
                  variant="underline"
                  caption="Skip for now"
                  onClick={handleSkipShare}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CastProcessingScreen;
