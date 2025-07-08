// Dependencies
import React from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";

// StyleSheet
import styles from "./MiniAppPage.module.scss";

const MiniAppPage: React.FC = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.homeContent}>
            <div className={styles.welcomeSection}>
              <Typography
                variant="geist"
                weight="medium"
                size={18}
                lineHeight={24}
                className={styles.welcomeTitle}
              >
                Welcome to Your Running Hub! 🏃‍♂️
              </Typography>
              <Typography
                variant="geist"
                weight="regular"
                size={14}
                lineHeight={20}
                className={styles.welcomeText}
              >
                Track your progress, log workouts, and connect with the running
                community.
              </Typography>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔥</div>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={24}
                  lineHeight={28}
                >
                  4
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  lineHeight={16}
                >
                  Day Streak
                </Typography>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏃‍♂️</div>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={24}
                  lineHeight={28}
                >
                  24
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  lineHeight={16}
                >
                  Total Runs
                </Typography>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📏</div>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={24}
                  lineHeight={28}
                >
                  156.8
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  lineHeight={16}
                >
                  Total KM
                </Typography>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={24}
                  lineHeight={28}
                >
                  14:32
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  lineHeight={16}
                >
                  Total Time
                </Typography>
              </div>
            </div>

            <div className={styles.quickStats}>
              <Typography
                variant="druk"
                weight="wide"
                size={16}
                lineHeight={20}
              >
                Today's Goal
              </Typography>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={14}
                  lineHeight={18}
                >
                  3.5km / 5km
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MiniAppPage;
