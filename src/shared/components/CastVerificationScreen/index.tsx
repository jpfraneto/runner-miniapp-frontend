import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Components
import Typography from "@/shared/components/Typography";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import Button from "@/shared/components/Button";

// Styles
import styles from "./CastVerificationScreen.module.scss";
import { useState } from "react";

// Error handling
import {
  UserFriendlyError,
  formatTimeUntilNextDay,
} from "@/shared/utils/errorHandling";

interface CastVerificationScreenProps {
  castHash: string;
  text: string;
  embeds: string[];
  isVerifying: boolean;
  verificationResult: any;
  submissionError: UserFriendlyError | null;
  onComplete: () => void;
}

const CastVerificationScreen: React.FC<CastVerificationScreenProps> = ({
  castHash,
  text,
  embeds,
  isVerifying,
  verificationResult,
  submissionError,
  onComplete,
}) => {
  console.log(JSON.stringify(verificationResult, null, 2));
  const navigate = useNavigate();
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  const handleContinue = () => {
    sdk.haptics.impactOccurred("medium");
    onComplete();
    navigate("/");
  };

  const handleActionClick = () => {
    if (submissionError?.action) {
      sdk.haptics.impactOccurred("light");
      submissionError.action();
    }
  };

  const handleSecondaryActionClick = () => {
    if (submissionError?.secondaryAction) {
      sdk.haptics.impactOccurred("light");
      submissionError.secondaryAction();
    }
  };

  // Haptic feedback when verification starts
  useEffect(() => {
    if (isVerifying) {
      sdk.haptics.impactOccurred("light");
    }
  }, [isVerifying]);

  // Haptic feedback when verification completes
  useEffect(() => {
    if (!isVerifying && verificationResult) {
      if (verificationResult.verified && verificationResult.processed) {
        sdk.haptics.notificationOccurred("success");
      } else {
        sdk.haptics.notificationOccurred("error");
      }
    }
  }, [isVerifying, verificationResult]);

  // Timer for daily limit countdown
  useEffect(() => {
    if (submissionError?.showTimer) {
      const updateTimer = () => {
        setTimeUntilReset(formatTimeUntilNextDay());
      };

      updateTimer(); // Initial update
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [submissionError]);

  return (
    <div className={styles.container}>
      {isVerifying ? (
        <div className={styles.verifyingContent}>
          <div className={styles.icon}>🔍</div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            Verifying Your Cast
          </Typography>

          <Typography size={16} className={styles.description}>
            We're checking if your cast contains running data and processing
            it...
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
              Analyzing cast for running data...
            </Typography>
          </div>
        </div>
      ) : submissionError ? (
        <div className={styles.errorContent}>
          <div className={styles.icon}>
            {submissionError.type === "warning"
              ? "⚠️"
              : submissionError.type === "info"
              ? "ℹ️"
              : "❌"}
          </div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            {submissionError.title}
          </Typography>

          <Typography size={16} className={styles.description}>
            {submissionError.message}
          </Typography>

          {submissionError.showTimer && timeUntilReset && (
            <div className={styles.timerContainer}>
              <Typography size={14} className={styles.timerLabel}>
                {submissionError.timerMessage || "Try again in:"}
              </Typography>
              <Typography size={18} className={styles.timerValue}>
                {timeUntilReset}
              </Typography>
            </div>
          )}

          <div className={styles.buttonContainer}>
            {submissionError.actionText && submissionError.action && (
              <Button
                variant="primary"
                caption={submissionError.actionText}
                onClick={handleActionClick}
                className={styles.actionButton}
              />
            )}

            {submissionError.secondaryActionText &&
              submissionError.secondaryAction && (
                <Button
                  variant="secondary"
                  caption={submissionError.secondaryActionText}
                  onClick={handleSecondaryActionClick}
                  className={styles.secondaryButton}
                />
              )}

            <Button
              variant="primary"
              caption="Continue"
              onClick={handleContinue}
              className={styles.continueButton}
            />
          </div>
        </div>
      ) : verificationResult ? (
        <div className={styles.resultContent}>
          <div className={styles.icon}>
            {verificationResult.verified && verificationResult.processed
              ? "✅"
              : "❌"}
          </div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            {verificationResult.verified && verificationResult.processed
              ? "Cast Verified & Processed!"
              : "Cast Verification Failed"}
          </Typography>

          <Typography size={16} className={styles.description}>
            {verificationResult.message ||
              (verificationResult.verified && verificationResult.processed
                ? "Your running data has been extracted and added to your profile."
                : "We couldn't find valid running data in your cast.")}
          </Typography>

          {verificationResult.verified &&
            verificationResult.processed &&
            verificationResult.run && (
              <div className={styles.runData}>
                <Typography size={14} className={styles.dataTitle}>
                  Extracted Data:
                </Typography>

                <div className={styles.stats}>
                  {verificationResult.run.distanceMeters && (
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Distance:</span>
                      <span className={styles.statValue}>
                        {verificationResult.run.distanceMeters} km
                      </span>
                    </div>
                  )}

                  {verificationResult.run.duration && (
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Duration:</span>
                      <span className={styles.statValue}>
                        {verificationResult.run.duration} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          <Button
            variant="primary"
            caption="Continue"
            onClick={handleContinue}
            className={styles.continueButton}
          />
        </div>
      ) : (
        <div className={styles.errorContent}>
          <div className={styles.icon}>❓</div>

          <Typography
            variant="druk"
            weight="wide"
            size={24}
            className={styles.title}
          >
            Processing...
          </Typography>

          <Button
            variant="primary"
            caption="Continue"
            onClick={handleContinue}
            className={styles.continueButton}
          />
        </div>
      )}
    </div>
  );
};

export default CastVerificationScreen;
