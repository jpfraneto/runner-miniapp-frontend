// Dependencies
import { useMemo, useContext } from "react";
import { useProfile } from "@farcaster/auth-kit";
import { motion } from "framer-motion";
import { AuthContext } from "@/shared/providers/AppProvider";

// StyleSheet
import styles from "./LoginPage.module.scss";

// Components
import Typography from "@/components/Typography";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

function LoginPage() {
  const { isAuthenticated } = useProfile();
  const { miniappContext, isInitialized } = useContext(AuthContext);

  const renderDecoration = useMemo(
    () => (
      <div className={styles.decorator}>
        <div className={styles.squareGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`--decoration-key-${i.toString()}`}
              className={styles.square}
            ></div>
          ))}
        </div>
      </div>
    ),
    []
  );

  // Determine what to show based on different states
  const renderFooterContent = () => {
    // If miniapp hasn't been initialized or no user context, show "Open Miniapp" button
    if (!isInitialized || !miniappContext?.user?.fid) {
      return (
        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="https://farcaster.xyz/runner-miniapp"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            <span>
              <Typography>🏃‍♂️ Open RUNNER Miniapp</Typography>
            </span>
          </a>
        </motion.div>
      );
    }

    // If we have user context but there's an auth error (server communication issue)
    if (!isAuthenticated && miniappContext?.user?.fid) {
      return (
        <>
          <motion.div
            className={styles.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href={`https://farcaster.xyz/~/inbox/create/16098?text=${encodeURIComponent(
                "hey, there is an error with the RUNNER miniapp - can't authenticate properly"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <span>
                <Typography>📧 Report Issue</Typography>
              </span>
            </a>
            <div className={styles.errorMessage}>
              <Typography weight="light" textAlign="center">
                There was a problem connecting to the RUNNER servers. Please try
                refreshing the miniapp, or contact support if the issue
                persists.
              </Typography>
            </div>
          </motion.div>
        </>
      );
    }

    // Default fallback
    return null;
  };

  return (
    <div className={styles.body}>
      <div className={styles.inner}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.containerTitle}>
            <div className={styles.field}>
              <Typography
                weight={"light"}
                className={styles.title}
                textAlign={"center"}
              >
                Track runs, earn tokens, build streaks with the Farcaster
                community
              </Typography>
            </div>
          </div>
        </motion.div>

        {renderFooterContent()}
      </div>

      {renderDecoration}
    </div>
  );
}

export default withProtectionRoute(LoginPage, "only-disconnected");
