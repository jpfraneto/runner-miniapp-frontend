import React from "react";
import Button from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";
import { NotificationPromptProps } from "@/shared/components/NotificationPrompt/types";
import { useNotificationPrompt } from "@/shared/hooks/notifications/useNotificationPrompt";
import styles from "./NotificationPrompt.module.scss";
import sdk from "@farcaster/frame-sdk";

const NotificationPrompt: React.FC<NotificationPromptProps> = ({
  onComplete,
  userFid,
}) => {
  const { state, actions } = useNotificationPrompt(userFid, onComplete);

  if (state.isAdded) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.successIcon}>🎉</div>
          <Typography
            variant="druk"
            weight="wide"
            size={20}
            className={styles.successTitle}
          >
            $runner added
          </Typography>
          <Typography size={14} className={styles.successText}>
            You’ll get updates from $runner.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🏃‍♂️</div>

        <Typography size={14} className={styles.description}>
          Add $runner to your apps. Stay in the loop.
        </Typography>

        <div className={styles.benefits}></div>

        {state.error && (
          <Typography size={12} className={styles.error}>
            {state.error}
          </Typography>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          caption="Later"
          onClick={() => {
            sdk.haptics.selectionChanged();
            actions.skip();
          }}
          className={styles.skipButton}
        />
        <Button
          variant="primary"
          caption={state.isLoading ? "adding..." : "Add $runner"}
          onClick={actions.addMiniapp}
          className={styles.addButton}
        />
      </div>
    </div>
  );
};

export default NotificationPrompt;
