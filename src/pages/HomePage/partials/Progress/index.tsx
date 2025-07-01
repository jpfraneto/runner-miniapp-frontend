// Dependencies
import React from "react";

// StyleSheet
import styles from "./Progress.module.scss";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

interface ProgressProps {}

const Progress: React.FC<ProgressProps> = () => {
  const progressData = {
    currentLevel: 8,
    xp: 1250,
    xpToNextLevel: 1500,
    streak: 4,
    totalRuns: 24,
    totalDistance: "156.8 km",
    totalTime: "14:32:15",
    runnerTokens: 1250,
    achievements: [
      {
        id: 1,
        name: "First Run",
        description: "Complete your first run",
        earned: true,
        icon: "🏃‍♂️",
      },
      {
        id: 2,
        name: "Week Warrior",
        description: "Complete 3 runs in a week",
        earned: true,
        icon: "💪",
      },
      {
        id: 3,
        name: "Distance Demon",
        description: "Run 50km total",
        earned: true,
        icon: "🔥",
      },
      {
        id: 4,
        name: "Streak Master",
        description: "Maintain a 7-day streak",
        earned: false,
        icon: "⚡",
      },
    ],
  };

  const xpProgress = (progressData.xp / progressData.xpToNextLevel) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="druk" weight="wide" size={24} lineHeight={28}>
          Your Progress
        </Typography>
      </div>

      <div className={styles.levelSection}>
        <div className={styles.levelInfo}>
          <Typography variant="druk" weight="wide" size={32} lineHeight={36}>
            Level {progressData.currentLevel}
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            lineHeight={18}
          >
            {progressData.xp} / {progressData.xpToNextLevel} XP
          </Typography>
        </div>
        <div className={styles.xpBar}>
          <div
            className={styles.xpProgress}
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            {progressData.streak}
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
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            {progressData.totalRuns}
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
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            {progressData.totalDistance}
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={12}
            lineHeight={16}
          >
            Total Distance
          </Typography>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            {progressData.totalTime}
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

      <div className={styles.tokenSection}>
        <div className={styles.tokenHeader}>
          <Typography variant="druk" weight="wide" size={18} lineHeight={22}>
            $RUNNER Tokens
          </Typography>
          <Typography variant="druk" weight="wide" size={24} lineHeight={28}>
            {progressData.runnerTokens.toLocaleString()}
          </Typography>
        </div>
        <Button
          variant="primary"
          caption="Claim Rewards"
          onClick={() => console.log("Claim rewards clicked")}
          className={styles.claimButton}
        />
      </div>

      <div className={styles.achievementsSection}>
        <Typography variant="druk" weight="wide" size={18} lineHeight={22}>
          Achievements
        </Typography>
        <div className={styles.achievements}>
          {progressData.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`${styles.achievement} ${
                achievement.earned ? styles.earned : styles.locked
              }`}
            >
              <div className={styles.achievementIcon}>{achievement.icon}</div>
              <div className={styles.achievementInfo}>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={14}
                  lineHeight={18}
                >
                  {achievement.name}
                </Typography>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={12}
                  lineHeight={16}
                >
                  {achievement.description}
                </Typography>
              </div>
              {achievement.earned && (
                <div className={styles.earnedBadge}>✅</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.shareSection}>
        <Button
          variant="outline"
          caption="Share Progress"
          onClick={() => console.log("Share progress clicked")}
          className={styles.shareButton}
        />
      </div>
    </div>
  );
};

export default Progress;
