// Dependencies
import React from "react";
import { useCommunityContext } from "../../hooks/useCommunityContext";

// Styles
import styles from "./CommunityContext.module.scss";

interface CommunityContextProps {
  fid: number;
}

const CommunityContext: React.FC<CommunityContextProps> = ({ fid }) => {
  const { data: community, isLoading, error } = useCommunityContext(fid);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingText}>Loading community data...</div>
        </div>
      </div>
    );
  }

  if (error || !community?.success) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorText}>Unable to load community data</div>
        </div>
      </div>
    );
  }

  const { userRankings, communityBenchmark, similarRunners, achievementBadges } = community.data;

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return '#00ff00';
    if (percentile >= 75) return '#ffff00';
    if (percentile >= 50) return '#ff8800';
    return '#ff4444';
  };

  return (
    <div className={styles.container}>
      {/* Your Rank Cards */}
      <div className={styles.rankCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Your Rankings</h3>
        </div>
        <div className={styles.rankingsGrid}>
          {userRankings.map(ranking => (
            <div key={ranking.category} className={styles.rankingItem}>
              <div className={styles.rankCategory}>
                {ranking.category.charAt(0).toUpperCase() + ranking.category.slice(1)}
              </div>
              <div className={styles.rankPosition}>#{ranking.rank}</div>
              <div 
                className={styles.percentile}
                style={{ color: getPercentileColor(ranking.percentile) }}
              >
                Top {(100 - ranking.percentile).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Benchmark */}
      <div className={styles.benchmarkCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Community Average</h3>
        </div>
        <div className={styles.benchmarkGrid}>
          <div className={styles.benchmarkStat}>
            <div className={styles.statLabel}>Distance</div>
            <div className={styles.statValue}>{communityBenchmark.avgDistance.toFixed(1)}km</div>
          </div>
          <div className={styles.benchmarkStat}>
            <div className={styles.statLabel}>Runs</div>
            <div className={styles.statValue}>{communityBenchmark.avgRuns}</div>
          </div>
          <div className={styles.benchmarkStat}>
            <div className={styles.statLabel}>Pace</div>
            <div className={styles.statValue}>{communityBenchmark.avgPace}</div>
          </div>
        </div>
      </div>

      {/* Similar Runners */}
      <div className={styles.similarCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Similar Runners</h3>
        </div>
        <div className={styles.runnersList}>
          {similarRunners.slice(0, 3).map(runner => (
            <div key={runner.fid} className={styles.runnerItem}>
              <div className={styles.runnerInfo}>
                <img 
                  src={runner.pfpUrl} 
                  alt={runner.username}
                  className={styles.runnerAvatar}
                />
                <div className={styles.runnerDetails}>
                  <div className={styles.runnerName}>{runner.username}</div>
                  <div className={styles.runnerStats}>
                    {runner.totalDistance.toFixed(1)}km • {runner.totalRuns} runs
                  </div>
                </div>
              </div>
              <div className={styles.similarityScore}>
                {Math.round(runner.similarityScore * 100)}% match
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className={styles.badgesCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Achievement Badges</h3>
        </div>
        <div className={styles.badgesGrid}>
          {achievementBadges.slice(0, 6).map(badge => (
            <div 
              key={badge.id} 
              className={`${styles.badge} ${badge.earned ? styles.badgeEarned : styles.badgeLocked}`}
            >
              <div className={styles.badgeIcon}>{badge.icon}</div>
              <div className={styles.badgeTitle}>{badge.title}</div>
              <div className={styles.badgePercentile}>
                Top {(100 - badge.percentile).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityContext;