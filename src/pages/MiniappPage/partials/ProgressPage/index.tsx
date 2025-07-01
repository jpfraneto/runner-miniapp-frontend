// Dependencies
import React from "react";

// Components
import Typography from "@/shared/components/Typography";

// Hooks
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";

// StyleSheet
import styles from "./ProgressPage.module.scss";

const ProgressPage: React.FC = () => {
  const { data: todaysMission, isLoading: missionLoading } = useTodaysMission();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Typography
          variant="gta"
          weight="wide"
          size={24}
          lineHeight={20}
          className={styles.title}
        >
          PROGRESS
        </Typography>
        <Typography
          variant="geist"
          weight="regular"
          size={14}
          lineHeight={18}
          className={styles.subtitle}
        >
          Track your running journey
        </Typography>
      </div>

      {/* Weekly Progress */}
      <div className={styles.progressSection}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          lineHeight={20}
          className={styles.sectionTitle}
        >
          This Week
        </Typography>

        {missionLoading ? (
          <div className={styles.loadingCard}>
            <Typography size={14}>Loading progress...</Typography>
          </div>
        ) : todaysMission ? (
          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.progressTitle}
              >
                Weekly Completion
              </Typography>
            </div>
            <div className={styles.progressStats}>
              <div className={styles.stat}>
                <Typography size={12} className={styles.statLabel}>
                  Completed
                </Typography>
                <Typography
                  size={24}
                  weight="medium"
                  className={styles.statValue}
                >
                  {todaysMission.weeklyProgress.completed}
                </Typography>
              </div>
              <div className={styles.stat}>
                <Typography size={12} className={styles.statLabel}>
                  Planned
                </Typography>
                <Typography
                  size={24}
                  weight="medium"
                  className={styles.statValue}
                >
                  {todaysMission.weeklyProgress.planned}
                </Typography>
              </div>
              <div className={styles.stat}>
                <Typography size={12} className={styles.statLabel}>
                  Rate
                </Typography>
                <Typography
                  size={24}
                  weight="medium"
                  className={styles.statValue}
                >
                  {Math.round(todaysMission.weeklyProgress.completionRate)}%
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noProgressCard}>
            <Typography size={14}>No progress data available</Typography>
          </div>
        )}
      </div>

      {/* Streak */}
      <div className={styles.streakSection}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          lineHeight={20}
          className={styles.sectionTitle}
        >
          Streak
        </Typography>

        {missionLoading ? (
          <div className={styles.loadingCard}>
            <Typography size={14}>Loading streak...</Typography>
          </div>
        ) : todaysMission ? (
          <div className={styles.streakCard}>
            <div className={styles.streakHeader}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.streakTitle}
              >
                Current Streak
              </Typography>
            </div>
            <div className={styles.streakStats}>
              <div className={styles.streakNumber}>
                <Typography
                  size={32}
                  weight="medium"
                  className={styles.streakValue}
                >
                  {todaysMission.streak.current}
                </Typography>
                <Typography size={12} className={styles.streakLabel}>
                  days
                </Typography>
              </div>
              <div className={styles.streakStatus}>
                {todaysMission.streak.needsTodaysRun && (
                  <Typography size={12} className={styles.statusWarning}>
                    ⚠️ Need today's run to maintain streak
                  </Typography>
                )}
                {todaysMission.streak.isAtRisk && (
                  <Typography size={12} className={styles.statusDanger}>
                    🔥 Streak at risk!
                  </Typography>
                )}
                {!todaysMission.streak.needsTodaysRun &&
                  !todaysMission.streak.isAtRisk && (
                    <Typography size={12} className={styles.statusGood}>
                      ✅ Streak safe
                    </Typography>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noStreakCard}>
            <Typography size={14}>No streak data available</Typography>
          </div>
        )}
      </div>

      {/* Coming Soon */}
      <div className={styles.comingSoonSection}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          lineHeight={20}
          className={styles.sectionTitle}
        >
          Coming Soon
        </Typography>
        <div className={styles.comingSoonCard}>
          <Typography size={14} className={styles.comingSoonText}>
            📊 Detailed analytics
          </Typography>
          <Typography size={14} className={styles.comingSoonText}>
            🏆 Personal records
          </Typography>
          <Typography size={14} className={styles.comingSoonText}>
            📈 Performance trends
          </Typography>
          <Typography size={14} className={styles.comingSoonText}>
            🎯 Goal tracking
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
