// Dependencies
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./WorkoutPage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

// Hooks
import { useModal } from "@/shared/hooks/ui/useModal";
import { ModalsIds } from "@/shared/hooks/ui/useModal";

// SDK
import sdk from "@farcaster/frame-sdk";

// Partial components (to be created)
import WeeklyPlan from "../HomePage/partials/WeeklyPlan";
import RunLogs from "../HomePage/partials/RunLogs";
import Progress from "../HomePage/partials/Progress";

function WorkoutPage(): React.ReactNode {
  const { openModal } = useModal();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogWorkout = () => {
    // Open custom workout image selection modal
    openModal(ModalsIds.WORKOUT_IMAGE_SELECTION, {
      title: "log your run",
      message: "Select images from your device to share your run progress.",
      onImageSelect: handleImageSelection,
    });
  };

  const handleImageSelection = async (files: File[]) => {
    if (files.length === 0) return;

    // Upload images to Pinata (placeholder)
    setIsUploading(true);
    try {
      const ipfsHashes = await uploadImagesToPinata(files);

      // Compose cast with uploaded images (limit to 2 embeds as per SDK constraints)
      const embedUrls = ipfsHashes
        .slice(0, 2) // Limit to 2 embeds
        .map((hash) => `https://pinata.runnercoin.lat/ipfs/${hash}`);

      await sdk.actions.composeCast({
        embeds: embedUrls as [string] | [string, string],
      });

      // Reset state
      setIsUploading(false);

      // Show success message
      openModal(ModalsIds.BOTTOM_ALERT, {
        title: "Workout Logged!",
        content: "Your run has been successfully shared on Farcaster.",
      });
    } catch (error) {
      console.error("Error uploading images or composing cast:", error);
      setIsUploading(false);

      // Show error message
      openModal(ModalsIds.BOTTOM_ALERT, {
        title: "Error",
        content: "Failed to upload images or share workout. Please try again.",
      });
    }
  };

  // Placeholder function for uploading images to Pinata
  const uploadImagesToPinata = async (files: File[]): Promise<string[]> => {
    // TODO: Implement actual Pinata upload logic
    // This is a placeholder that returns mock IPFS hashes
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHashes = files.map(
          (_, index) => `mock-ipfs-hash-${index + 1}`
        );
        resolve(mockHashes);
      }, 2000);
    });
  };

  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Typography
              variant="gta"
              weight="wide"
              size={44}
              lineHeight={36}
              className={styles.mainTitle}
            >
              $RUNNER
            </Typography>
            <Typography
              variant="geist"
              weight="regular"
              size={14}
              lineHeight={18}
              className={styles.subtitle}
            >
              Your AI Coach & Training Companion
            </Typography>
          </div>

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Plan",
                  path: "/plan",
                },
                {
                  label: "Logs",
                  path: "/logs",
                },
                {
                  label: "Progress",
                  path: "/progress",
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<div>Workout Home</div>} />
            <Route path="/plan" element={<WeeklyPlan />} />
            <Route path="/logs" element={<RunLogs />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
          </Routes>
        </div>

        <div className={styles.quickActions}>
          <Button
            variant="primary"
            caption={isUploading ? "Uploading..." : "Log Today's Workout"}
            onClick={handleLogWorkout}
            disabled={isUploading}
            className={styles.logWorkoutButton}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(WorkoutPage, "only-connected");
