import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

// Types
import { RunShareVerificationResponse } from "@/services/user";

// StyleSheet
import styles from "./ShareSuccessView.module.scss";

interface ShareSuccessViewProps {
  verificationResult: RunShareVerificationResponse;
  onContinue?: () => void;
}

export default function ShareSuccessView({
  verificationResult,
  onContinue,
}: ShareSuccessViewProps) {
  const navigate = useNavigate();

  // Auto-navigate after a delay if no custom onContinue handler
  useEffect(() => {
    if (!onContinue) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, onContinue]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigate("/");
    }
  };

  const getSuccessMessage = () => {
    if (verificationResult.alreadyShared) {
      return "Thanks for sharing again!";
    }
    if (verificationResult.verified && verificationResult.pointsAwarded > 0) {
      return "Share verified successfully!";
    }
    if (verificationResult.verified) {
      return "Share confirmed!";
    }
    return "Share processed!";
  };

  const getSubMessage = () => {
    if (verificationResult.alreadyShared) {
      return "You've already earned points for sharing this run, but we appreciate your enthusiasm!";
    }
    if (verificationResult.pointsAwarded > 0) {
      return `You've earned ${verificationResult.pointsAwarded} points for sharing your achievement!`;
    }
    return verificationResult.message || "Your run has been shared to the community.";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {verificationResult.verified ? "🎉" : "✅"}
        </div>

        <Typography
          variant="druk"
          weight="wide"
          size={28}
          lineHeight={36}
          textAlign="center"
          className={styles.title}
        >
          {getSuccessMessage()}
        </Typography>

        <Typography
          variant="geist"
          weight="regular"
          size={16}
          lineHeight={24}
          textAlign="center"
          className={styles.subtitle}
        >
          {getSubMessage()}
        </Typography>

        {verificationResult.pointsAwarded > 0 && (
          <div className={styles.pointsCard}>
            <div className={styles.pointsBadge}>
              <Typography
                variant="druk"
                weight="wide"
                size={24}
                lineHeight={28}
                className={styles.pointsValue}
              >
                +{verificationResult.pointsAwarded}
              </Typography>
              <Typography
                variant="geist"
                weight="medium"
                size={12}
                lineHeight={16}
                className={styles.pointsLabel}
              >
                POINTS
              </Typography>
            </div>
            
            {verificationResult.newTotalPoints && (
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                lineHeight={18}
                textAlign="center"
                className={styles.totalPoints}
              >
                Total: {verificationResult.newTotalPoints} points
              </Typography>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            caption="Continue"
            onClick={handleContinue}
            className={styles.continueButton}
          />
          
          <Typography
            variant="geist"
            weight="regular"
            size={12}
            lineHeight={16}
            textAlign="center"
            className={styles.autoRedirect}
          >
            {!onContinue && "Redirecting to home in 3 seconds..."}
          </Typography>
        </div>
      </div>
    </div>
  );
}