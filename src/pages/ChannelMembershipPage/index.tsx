import React from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import AppLayout from "@/shared/layouts/AppLayout";
import styles from "./ChannelMembershipPage.module.scss";

const ChannelMembershipPage: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinChannel = () => {
    sdk.haptics.selectionChanged();
    
    // Open the /running channel in Warpcast
    sdk.actions.openUrl("https://warpcast.com/~/channel/running");
  };

  const handleGoBack = () => {
    sdk.haptics.selectionChanged();
    navigate(-1);
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <button
              className={styles.backButton}
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className={styles.title}>Join /running Channel</h1>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Channel Info */}
            <div className={styles.channelInfo}>
              <div className={styles.channelIcon}>
                <img
                  src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/99d5e9c3-4dea-4c7e-4b88-a3b8c1088600/rectfill"
                  alt="Running Channel"
                  className={styles.channelImage}
                />
              </div>
              <h2 className={styles.channelName}>/running</h2>
              <p className={styles.channelDescription}>
                Share your running progress and connect with other runners
              </p>
            </div>

            {/* Requirements */}
            <div className={styles.requirements}>
              <h3 className={styles.requirementsTitle}>To share your runs:</h3>
              <ul className={styles.requirementsList}>
                <li className={styles.requirementItem}>
                  <span className={styles.requirementIcon}>1️⃣</span>
                  <span className={styles.requirementText}>
                    Join the /running channel on Warpcast
                  </span>
                </li>
                <li className={styles.requirementItem}>
                  <span className={styles.requirementIcon}>2️⃣</span>
                  <span className={styles.requirementText}>
                    Follow the channel to see updates
                  </span>
                </li>
                <li className={styles.requirementItem}>
                  <span className={styles.requirementIcon}>3️⃣</span>
                  <span className={styles.requirementText}>
                    Come back to share your running achievements
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={styles.joinButton}
                onClick={handleJoinChannel}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.buttonIcon}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Join /running Channel
              </button>

              <button
                className={styles.cancelButton}
                onClick={handleGoBack}
              >
                Maybe Later
              </button>
            </div>

            {/* Info Note */}
            <div className={styles.infoNote}>
              <p className={styles.infoText}>
                <strong>Note:</strong> You need to be a member of the /running channel
                to share your runs and connect with the community. Once you join,
                you'll be able to post directly from this app!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChannelMembershipPage;