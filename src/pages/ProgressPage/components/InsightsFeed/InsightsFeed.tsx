// Dependencies
import React from "react";
import { useProgressInsights } from "../../hooks/useProgressInsights";
import styles from "./InsightsFeed.module.scss";

interface InsightsFeedProps {
  fid: number;
}

const InsightsFeed: React.FC<InsightsFeedProps> = ({ fid }) => {
  const { data: insights, isLoading, error } = useProgressInsights(fid);

  if (isLoading) {
    return <div className={styles.loadingCard}>Loading insights...</div>;
  }

  if (error || !insights?.success) {
    return <div className={styles.errorCard}>Unable to load insights</div>;
  }

  const { weeklyStory, patternInsights, improvementOpportunities } = insights.data;

  return (
    <div className={styles.container}>
      {/* Weekly Story */}
      <div className={styles.storyCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{weeklyStory.title}</h3>
        </div>
        <p className={styles.storySummary}>{weeklyStory.summary}</p>
        {weeklyStory.highlights.length > 0 && (
          <div className={styles.highlights}>
            {weeklyStory.highlights.map((highlight, index) => (
              <div key={index} className={styles.highlight}>
                • {highlight}
              </div>
            ))}
          </div>
        )}
        {weeklyStory.improvement && (
          <div className={styles.improvement}>
            <span className={`${styles.improvementIcon} ${weeklyStory.improvement.isPositive ? styles.positive : styles.negative}`}>
              {weeklyStory.improvement.isPositive ? '📈' : '📉'}
            </span>
            <span className={styles.improvementText}>
              {weeklyStory.improvement.metric}: {weeklyStory.improvement.change > 0 ? '+' : ''}{weeklyStory.improvement.change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Pattern Insights */}
      <div className={styles.patternsCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Pattern Recognition</h3>
        </div>
        <div className={styles.patternsList}>
          {patternInsights.slice(0, 2).map((pattern, index) => (
            <div key={index} className={styles.pattern}>
              <div className={styles.patternTitle}>{pattern.title}</div>
              <div className={styles.patternDesc}>{pattern.description}</div>
              <div className={styles.patternAction}>{pattern.actionable}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Opportunities */}
      <div className={styles.opportunitiesCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Improvement Opportunities</h3>
        </div>
        <div className={styles.opportunitiesList}>
          {improvementOpportunities.slice(0, 2).map((opportunity, index) => (
            <div key={index} className={`${styles.opportunity} ${styles[opportunity.priority]}`}>
              <div className={styles.opportunityHeader}>
                <div className={styles.opportunityTitle}>{opportunity.title}</div>
                <div className={styles.priorityBadge}>{opportunity.priority}</div>
              </div>
              <div className={styles.opportunityDesc}>{opportunity.description}</div>
              <div className={styles.suggestion}>💡 {opportunity.suggestion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsFeed;