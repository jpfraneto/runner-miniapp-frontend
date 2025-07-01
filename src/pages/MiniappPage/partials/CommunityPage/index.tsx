// Dependencies
import React from "react";

// Components
import Typography from "@/shared/components/Typography";

// StyleSheet
import styles from "./CommunityPage.module.scss";

const CommunityPage: React.FC = () => {
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
          COMMUNITY
        </Typography>
        <Typography
          variant="geist"
          weight="regular"
          size={14}
          lineHeight={18}
          className={styles.subtitle}
        >
          Connect with fellow runners
        </Typography>
      </div>

      {/* Coming Soon */}
      <div className={styles.comingSoonSection}>
        <div className={styles.comingSoonCard}>
          <Typography
            size={16}
            weight="medium"
            className={styles.comingSoonTitle}
          >
            🏃‍♂️ Runner Community
          </Typography>
          <Typography size={14} className={styles.comingSoonText}>
            Connect with runners worldwide
          </Typography>
        </div>
      </div>

      {/* Features */}
      <div className={styles.featuresSection}>
        <Typography
          variant="geist"
          weight="medium"
          size={16}
          lineHeight={20}
          className={styles.sectionTitle}
        >
          Coming Soon
        </Typography>

        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>👥</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Running Groups
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Join local and global running communities
              </Typography>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🏆</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Challenges
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Participate in weekly and monthly challenges
              </Typography>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💬</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Chat & Support
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Get motivation and tips from fellow runners
              </Typography>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📊</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Leaderboards
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Compete with friends and community members
              </Typography>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🎯</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Group Goals
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Set and achieve goals together
              </Typography>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📱</div>
            <div className={styles.featureContent}>
              <Typography
                size={14}
                weight="medium"
                className={styles.featureTitle}
              >
                Social Sharing
              </Typography>
              <Typography size={12} className={styles.featureDescription}>
                Share your achievements with the community
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Beta Signup */}
      <div className={styles.betaSection}>
        <div className={styles.betaCard}>
          <Typography size={16} weight="medium" className={styles.betaTitle}>
            🚀 Early Access
          </Typography>
          <Typography size={14} className={styles.betaText}>
            Be the first to experience the new community features when they
            launch!
          </Typography>
          <div className={styles.betaButton}>
            <Typography
              size={12}
              weight="medium"
              className={styles.betaButtonText}
            >
              Notify Me
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
