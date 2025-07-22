import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

// Hooks
import { useRunShareVerification } from "@/shared/hooks/user/useRunShareVerification";

// Types
import { RunningSession } from "@/shared/types/running";

// Assets
import ShareIcon from "@/shared/assets/icons/share-icon.svg?react";

// StyleSheet
import styles from "./ShareRunView.module.scss";

interface ShareRunViewProps {
  runData: RunningSession;
  onSkip: () => void;
  onSuccess?: (verificationResult?: any) => void;
}

export default function ShareRunView({
  runData,
  onSkip,
  onSuccess,
}: ShareRunViewProps) {
  const navigate = useNavigate();
  const shareVerification = useRunShareVerification();

  const [isSharing, setIsSharing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Format duration helper
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate pace (min/km)
  const calculatePace = (distanceKm: number, durationMinutes: number) => {
    if (distanceKm === 0) return "0:00";
    const paceMinutes = durationMinutes / distanceKm;
    const mins = Math.floor(paceMinutes);
    const secs = Math.round((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Handles the unified sharing logic with verification.
   */
  const handleClickShare = useCallback(async () => {
    if (isSharing || isVerifying) return; // Prevent double-clicks

    setIsSharing(true);
    setShareError(null);

    try {
      const distance = (runData as any).distance || runData.distanceMeters / 1000;
      const pace = calculatePace(distance, runData.duration);

      // Create the cast text
      const castText = `Just crushed a ${distance.toFixed(1)}km run! 🏃‍♂️

⏱️ Time: ${formatDuration(runData.duration)}
⚡ Pace: ${pace}/km

Building my fitness streak one run at a time! 💪

#RunnerCoin #fitness #running`;

      // Use the app's embed URL - you might want to customize this
      const embedUrl = `https://runnercoin.lat/runs/${runData.castHash}`;

      // Compose cast with standardized text and embed
      const castResponse = await sdk.actions.composeCast({
        text: castText,
        embeds: [embedUrl],
      });

      // If cast was successful and we have a hash, verify it
      if (castResponse && castResponse.cast?.hash) {
        // Update state to show verification is happening
        setIsSharing(false);
        setIsVerifying(true);

        // Verify the share and wait for result
        shareVerification.mutate(
          {
            castHash: castResponse.cast?.hash,
            runSessionId: (runData as any).id?.toString() || runData.castHash,
          },
          {
            onSuccess: (data) => {
              setIsVerifying(false);
              console.log("✅ Run share verified:", data);
              
              // Call success callback with the verification data or navigate
              if (onSuccess) {
                onSuccess(data);
              } else {
                navigate("/");
              }
            },
            onError: (error) => {
              console.error("❌ Run share verification failed:", error);
              setIsVerifying(false);
              setShareError(
                error.message || "Failed to verify share. Please try again."
              );
            },
          }
        );
      } else {
        console.warn("📤 Cast response missing hash:", castResponse);
        setShareError("Share was not completed. Please try again.");
        setIsSharing(false);
      }
    } catch (error) {
      console.error("📤 Share error:", error);
      setShareError("Failed to share cast. Please try again.");
      setIsSharing(false);
    }
  }, [
    runData,
    shareVerification,
    isSharing,
    isVerifying,
    onSuccess,
    navigate,
  ]);

  // Determine the current state for UI feedback
  const getButtonState = () => {
    if (isSharing) return "Sharing...";
    if (isVerifying) return "Verifying...";
    return "Share on Farcaster";
  };

  const isLoading = isSharing || isVerifying;
  const distance = (runData as any).distance || runData.distanceMeters / 1000;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography
          size={24}
          lineHeight={32}
          variant={"druk"}
          weight={"wide"}
          className={styles.title}
        >
          Share Your Run
        </Typography>
        
        <Typography
          size={16}
          lineHeight={24}
          variant={"geist"}
          weight={"regular"}
          className={styles.subtitle}
        >
          Show off your achievement to the Farcaster community!
        </Typography>
      </div>

      {/* Show error message if share verification failed */}
      {shareError && (
        <div className={styles.errorMessage}>
          <Typography
            variant={"geist"}
            weight={"medium"}
            size={14}
            lineHeight={18}
            textAlign={"center"}
          >
            {shareError}
          </Typography>
        </div>
      )}

      {/* Show verification status */}
      {isVerifying && (
        <div className={styles.verificationMessage}>
          <Typography
            variant={"geist"}
            weight={"medium"}
            size={14}
            lineHeight={18}
            textAlign={"center"}
          >
            🔍 Verifying your share to award points...
          </Typography>
        </div>
      )}

      <div className={styles.runPreview}>
        <div className={styles.runStats}>
          <div className={styles.primaryStats}>
            <div className={styles.statItem}>
              <Typography
                variant={"druk"}
                weight={"wide"}
                size={32}
                lineHeight={36}
                className={styles.statValue}
              >
                {distance.toFixed(1)}
              </Typography>
              <Typography
                variant={"geist"}
                weight={"medium"}
                size={14}
                lineHeight={18}
                className={styles.statLabel}
              >
                km
              </Typography>
            </div>
            
            <div className={styles.statItem}>
              <Typography
                variant={"druk"}
                weight={"wide"}
                size={32}
                lineHeight={36}
                className={styles.statValue}
              >
                {formatDuration(runData.duration)}
              </Typography>
              <Typography
                variant={"geist"}
                weight={"medium"}
                size={14}
                lineHeight={18}
                className={styles.statLabel}
              >
                time
              </Typography>
            </div>
            
            <div className={styles.statItem}>
              <Typography
                variant={"druk"}
                weight={"wide"}
                size={32}
                lineHeight={36}
                className={styles.statValue}
              >
                {calculatePace(distance, runData.duration)}
              </Typography>
              <Typography
                variant={"geist"}
                weight={"medium"}
                size={14}
                lineHeight={18}
                className={styles.statLabel}
              >
                /km
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.preview}>
          <Typography
            variant={"geist"}
            weight={"medium"}
            size={14}
            lineHeight={18}
            className={styles.previewLabel}
          >
            Cast Preview:
          </Typography>
          
          <div className={styles.castPreview}>
            <Typography
              variant={"geist"}
              weight={"regular"}
              size={14}
              lineHeight={20}
            >
              Just crushed a {distance.toFixed(1)}km run! 🏃‍♂️<br />
              <br />
              ⏱️ Time: {formatDuration(runData.duration)}<br />
              ⚡ Pace: {calculatePace(distance, runData.duration)}/km<br />
              <br />
              Building my fitness streak one run at a time! 💪<br />
              <br />
              #RunnerCoin #fitness #running
            </Typography>
          </div>
        </div>

        <div className={styles.actions}>
          <Typography
            variant={"geist"}
            weight={"semiBold"}
            textAlign={"center"}
            size={14}
            lineHeight={18}
            className={styles.rewardText}
          >
            {isVerifying
              ? "Verifying share to award points..."
              : "Earn points for sharing your achievement!"}
          </Typography>
          
          <Button
            caption={getButtonState()}
            className={styles.shareButton}
            iconLeft={
              isLoading ? <LoaderIndicator size={16} /> : <ShareIcon />
            }
            onClick={handleClickShare}
            disabled={isLoading}
          />
          
          <Button
            variant={"underline"}
            caption="Skip for now"
            onClick={onSkip}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}