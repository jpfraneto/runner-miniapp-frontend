// Dependencies
import React from "react";
import styles from "./NewUserExperience.module.scss";

interface NewUserExperienceProps {
  fid: number;
}

const NewUserExperience: React.FC<NewUserExperienceProps> = ({ fid }) => {
  return (
    <div className={styles.container}>
      {/* Welcome Message */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeIcon}>🏃‍♂️</div>
        <h2 className={styles.welcomeTitle}>Welcome to Runner!</h2>
        <p className={styles.welcomeText}>
          Start your running journey and unlock detailed progress analytics, 
          community comparisons, and personal insights.
        </p>
      </div>

      {/* Community Preview */}
      <div className={styles.previewCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>See What Others Are Achieving</h3>
        </div>
        <div className={styles.previewStats}>
          <div className={styles.previewStat}>
            <div className={styles.statValue}>2.4M+</div>
            <div className={styles.statLabel}>Total KM Run</div>
          </div>
          <div className={styles.previewStat}>
            <div className={styles.statValue}>15K+</div>
            <div className={styles.statLabel}>Active Runners</div>
          </div>
          <div className={styles.previewStat}>
            <div className={styles.statValue}>48K+</div>
            <div className={styles.statLabel}>Workouts Logged</div>
          </div>
        </div>
      </div>

      {/* Potential Insights */}
      <div className={styles.insightsCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>What You'll Unlock</h3>
        </div>
        <div className={styles.featuresList}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Personal Analytics</div>
              <div className={styles.featureDesc}>Track progress, trends, and improvements</div>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🏆</div>
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Community Rankings</div>
              <div className={styles.featureDesc}>See how you compare to other runners</div>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔥</div>
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Streak Tracking</div>
              <div className={styles.featureDesc}>Build and maintain running streaks</div>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💡</div>
            <div className={styles.featureText}>
              <div className={styles.featureTitle}>Smart Insights</div>
              <div className={styles.featureDesc}>Data-driven tips to improve performance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={styles.ctaCard}>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Ready to Start?</h3>
          <p className={styles.ctaText}>
            Log your first run to begin tracking your progress and unlock all features.
          </p>
          <button className={styles.ctaButton}>
            Log Your First Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserExperience;