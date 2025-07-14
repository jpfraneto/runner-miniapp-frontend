// Dependencies
import React, { useState } from "react";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";

// Styles
import styles from "./TrendAnalysis.module.scss";

interface TrendAnalysisProps {
  fid: number;
}

type MetricType = 'distance' | 'time' | 'pace' | 'runs';

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ fid }) => {
  const { data: analytics, isLoading, error } = useProgressAnalytics(fid);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('distance');

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingText}>Loading trend analysis...</div>
        </div>
      </div>
    );
  }

  if (error || !analytics?.success) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorText}>Unable to load trend data</div>
        </div>
      </div>
    );
  }

  const { monthlyTrends, personalStats } = analytics.data;

  const getMetricValue = (trend: any, metric: MetricType) => {
    switch (metric) {
      case 'distance': return trend.distance;
      case 'time': return trend.time;
      case 'pace': return trend.averagePace;
      case 'runs': return trend.runs;
      default: return trend.distance;
    }
  };

  const getMetricUnit = (metric: MetricType) => {
    switch (metric) {
      case 'distance': return 'km';
      case 'time': return 'min';
      case 'pace': return 's/km';
      case 'runs': return 'runs';
      default: return '';
    }
  };

  const formatMetricValue = (value: number, metric: MetricType) => {
    switch (metric) {
      case 'distance': return `${value.toFixed(1)}km`;
      case 'time': return `${Math.round(value)}min`;
      case 'pace': return `${Math.floor(value / 60)}:${(value % 60).toFixed(0).padStart(2, '0')}`;
      case 'runs': return `${value}`;
      default: return value.toString();
    }
  };

  const calculateImprovement = (current: number, previous: number, metric: MetricType) => {
    if (previous === 0) return 0;
    const change = ((current - previous) / previous) * 100;
    // For pace, lower is better, so invert the improvement calculation
    return metric === 'pace' ? -change : change;
  };

  const renderTrendChart = () => {
    const maxValue = Math.max(...monthlyTrends.map(trend => getMetricValue(trend, selectedMetric)));
    const minValue = Math.min(...monthlyTrends.map(trend => getMetricValue(trend, selectedMetric)));
    const range = maxValue - minValue || 1;

    return (
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {monthlyTrends.map((trend, index) => {
            const value = getMetricValue(trend, selectedMetric);
            const height = ((value - minValue) / range) * 100;
            const isLast = index === monthlyTrends.length - 1;
            
            return (
              <div key={trend.week} className={styles.chartBar}>
                <div 
                  className={`${styles.bar} ${isLast ? styles.barCurrent : ''}`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className={styles.barValue}>
                    {formatMetricValue(value, selectedMetric)}
                  </div>
                </div>
                <div className={styles.barLabel}>{trend.week}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthComparisons = () => {
    if (monthlyTrends.length < 2) return null;

    const currentMonth = monthlyTrends[monthlyTrends.length - 1];
    const previousMonth = monthlyTrends[monthlyTrends.length - 2];

    const metrics: MetricType[] = ['distance', 'runs', 'time', 'pace'];

    return (
      <div className={styles.comparisonsGrid}>
        {metrics.map(metric => {
          const current = getMetricValue(currentMonth, metric);
          const previous = getMetricValue(previousMonth, metric);
          const improvement = calculateImprovement(current, previous, metric);
          const isPositive = improvement > 0;

          return (
            <div key={metric} className={styles.comparisonCard}>
              <div className={styles.metricName}>
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </div>
              <div className={styles.comparisonValue}>
                {formatMetricValue(current, metric)}
              </div>
              <div className={`${styles.improvement} ${isPositive ? styles.positive : styles.negative}`}>
                {isPositive ? '↗️' : '↘️'} {Math.abs(improvement).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 4-Week Trend Graph */}
      <div className={styles.trendCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>4-Week Trends</h3>
          <div className={styles.metricSelector}>
            {(['distance', 'time', 'pace', 'runs'] as MetricType[]).map(metric => (
              <button
                key={metric}
                className={`${styles.metricButton} ${selectedMetric === metric ? styles.active : ''}`}
                onClick={() => setSelectedMetric(metric)}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {renderTrendChart()}
      </div>

      {/* Month-over-Month Cards */}
      <div className={styles.monthCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Month-over-Month</h3>
        </div>
        {renderMonthComparisons()}
      </div>

      {/* Performance Heatmap */}
      <div className={styles.heatmapCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Activity Heatmap</h3>
        </div>
        <div className={styles.heatmapContainer}>
          <div className={styles.comingSoon}>
            📊 Activity frequency heatmap coming soon
          </div>
        </div>
      </div>

      {/* Pace Evolution */}
      <div className={styles.paceCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Pace Evolution</h3>
        </div>
        <div className={styles.paceStats}>
          <div className={styles.paceStat}>
            <div className={styles.paceLabel}>Best Pace</div>
            <div className={styles.paceValue}>{personalStats.bestPace}</div>
          </div>
          <div className={styles.paceStat}>
            <div className={styles.paceLabel}>Average Pace</div>
            <div className={styles.paceValue}>{personalStats.averagePace}</div>
          </div>
          <div className={styles.paceStat}>
            <div className={styles.paceLabel}>Improvement</div>
            <div className={styles.paceValue}>
              {monthlyTrends.length >= 2 && (
                <>
                  {(() => {
                    const improvement = calculateImprovement(
                      getMetricValue(monthlyTrends[monthlyTrends.length - 1], 'pace'),
                      getMetricValue(monthlyTrends[0], 'pace'),
                      'pace'
                    );
                    return improvement > 0 ? `+${improvement.toFixed(1)}%` : `${improvement.toFixed(1)}%`;
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;