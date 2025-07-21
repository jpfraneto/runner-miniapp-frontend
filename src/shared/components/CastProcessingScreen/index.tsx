import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Typography from "@/shared/components/Typography";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import NotificationPrompt from "@/shared/components/NotificationPrompt";

// Context
import { AuthContext } from "@/shared/providers/AppProvider";

// Services
import { processCast } from "@/services/castProcessing";

// Styles
import styles from "./CastProcessingScreen.module.scss";

interface CastProcessingScreenProps {
  castHash: string;
  text: string;
  embeds: string[];
  onComplete: (runData?: any) => void;
}

const CastProcessingScreen: React.FC<CastProcessingScreenProps> = ({
  castHash,
  text,
  embeds,
  onComplete,
}) => {
  const navigate = useNavigate();
  const { miniappContext } = useContext(AuthContext);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

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
          setShowNotificationPrompt(true);

          // Call onComplete with the processed data
          onComplete(response.data);
        } else {
          console.error("Failed to process cast:", response.message);
          // Handle error - could show error state or retry
          setProcessingComplete(true);
          setShowNotificationPrompt(true);
        }
      } catch (error) {
        console.error("Error processing cast:", error);
        // Handle error - could show error state or retry
        setProcessingComplete(true);
        setShowNotificationPrompt(true);
      }
    };

    processCastData();
  }, [castHash, text, embeds, onComplete]);

  const handleNotificationComplete = () => {
    setShowNotificationPrompt(false);
    onComplete();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {!processingComplete ? (
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

          {showNotificationPrompt && (
            <div className={styles.notificationPrompt}>
              <NotificationPrompt
                userFid={miniappContext?.user?.fid || 0}
                onComplete={handleNotificationComplete}
                points={0}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CastProcessingScreen;
