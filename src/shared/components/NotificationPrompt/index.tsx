import React from "react";
import Button from "@/shared/components/Button";
import Typography from "@/shared/components/Typography";
import { NotificationPromptProps } from "@/shared/components/NotificationPrompt/types";
import { useNotificationPrompt } from "@/shared/hooks/notifications/useNotificationPrompt";
import styles from "./NotificationPrompt.module.scss";
import sdk from "@farcaster/frame-sdk";

const NotificationPrompt: React.FC<NotificationPromptProps> = ({
  onComplete,
  points = 0,
  userFid,
}) => {
  const { state, actions } = useNotificationPrompt(userFid, onComplete);

  // Determine if this is being shown on app load vs after voting
  const isAppLoadContext = points === 0;

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
            You're all set!
          </Typography>
          <Typography size={14} className={styles.successText}>
            {isAppLoadContext
              ? "Welcome to BRND! We'll keep you updated with the latest."
              : "We'll remind you to vote daily so you never miss earning points"}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔔</div>

        <Typography size={14} className={styles.description}>
          {isAppLoadContext
            ? "add $runner miniapp to your apps. i don't know why yet, but you will be first."
            : ``}
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
