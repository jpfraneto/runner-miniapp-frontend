import React from "react";
import styles from "./LandingPage.module.scss";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <img
        src="/runner.gif"
        alt="Runner"
        className={`${styles.runnerGif} ${styles.floatingRunner}`}
      />
      <img
        src="/runner.gif"
        alt="Runner"
        className={`${styles.runnerGif} ${styles.floatingRunner}`}
      />
      <img
        src="/runner.gif"
        alt="Runner"
        className={`${styles.runnerGif} ${styles.floatingRunner}`}
      />

      <div className={styles.hero}>
        <img src="/runner.gif" alt="Runner" className={styles.runnerGif} />
        <a
          target="_blank"
          href="https://dexscreener.com/base/0x5cc4a43f2681a03d9187f3ad6934c748a86d6119"
          className={styles.title}
        >
          $runner miniapp
        </a>
        <p className={styles.subtitle}>
          Earn by running. Track your progress. Join the community.
        </p>
        <p className={styles.description}>
          $runner is a Farcaster miniapp that rewards your running activities
          with money. Connect with fellow runners, share your achievements, and
          earn rewards for staying active.
        </p>
        <a
          href="https://farcaster.xyz/miniapps/R6BVbn33-17a/runner"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
        >
          Start Running & Earning
        </a>
      </div>

      <div className={styles.runnerSection}>
        <div className={styles.runnerContent}>
          <h2>Track Every Step</h2>
          <p>
            Monitor your running sessions, distance, and progress over time.
            Share your achievements with the Farcaster community and earn money
            for your dedication.
          </p>
        </div>
        <img
          src="/runner.gif"
          alt="Runner tracking progress"
          className={styles.runnerImageLarge}
        />
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3>🏃‍♂️ Track Your Runs</h3>
          <p>
            Log your running sessions and monitor your progress with detailed
            analytics and insights.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3>🪙 Earn Tokens</h3>
          <p>
            Get rewarded with $runner for running. The top 8 every week will be
            rewarded with a percentage of the trading fees of $runner for that
            week.
          </p>
        </div>
      </div>

      <div className={styles.runnerSection}>
        <img
          src="/runner.gif"
          alt="Community runner"
          className={styles.runnerImageLarge}
        />
        <div className={styles.runnerContent}>
          <h2>Join the Community</h2>
          <p>
            Connect with passionate runners in the Farcaster ecosystem. Share
            your journey, celebrate milestones, and motivate each other to reach
            new goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
