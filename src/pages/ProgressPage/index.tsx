// Dependencies
import React from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";

// StyleSheet
import styles from "./ProgressPage.module.scss";
import sdk from "@farcaster/frame-sdk";

const ProgressPage: React.FC = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}

        <p className={styles.text}>what should go on this page?</p>
        <a
          onClick={() => {
            sdk.actions.openUrl(
              `https://farcaster.xyz/~/inbox/create/16098?text=${encodeURI(
                "hey jp, i have feedback for the $runner miniapp"
              )}`
            );
          }}
          target="_blank"
          className={styles.feedbackButton}
        >
          Give Feedback Via DC
        </a>
      </div>
    </AppLayout>
  );
};

export default ProgressPage;
