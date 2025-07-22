import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import Typography from "@/shared/components/Typography";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import Button from "@/shared/components/Button";

// Styles
import styles from "./CastVerificationScreen.module.scss";

interface CastVerificationScreenProps {
  castHash: string;
  text: string;
  embeds: string[];
  isVerifying: boolean;
  verificationResult: any;
  onComplete: () => void;
}

const CastVerificationScreen: React.FC<CastVerificationScreenProps> = ({
  castHash,
  text,
  embeds,
  isVerifying,
  verificationResult,
  onComplete,
}) => {
  console.log(JSON.stringify(verificationResult, null, 2));
  const navigate = useNavigate();

  const handleContinue = () => {
    onComplete();
    navigate("/");
  };

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
