import React from "react";
import Button from "../Button";
import styles from "./AutomationResults.module.scss";

interface AutomationData {
  castFetching: {
    newCasts: number;
    totalCasts: number;
  };
  sessionProcessing: {
    processed: number;
    workouts: number;
  };
}

interface AutomationResultsProps {
  results: AutomationData | null;
  error: string | null;
  onClearResults: () => void;
}

const AutomationResults: React.FC<AutomationResultsProps> = ({
  results,
  error,
  onClearResults,
}) => {
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorHeader}>
          <h3 className={styles.title}>❌ Automation Failed</h3>
        </div>
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
        <Button onClick={onClearResults} className={styles.clearButton} caption="Try Again" />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <h3 className={styles.title}>✅ Automation Completed!</h3>
      </div>

      <div className={styles.results}>
        <h4 className={styles.sectionTitle}>📊 Results:</h4>
        
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>• New casts:</span>
          <span className={styles.resultValue}>{results.castFetching.newCasts}</span>
        </div>
        
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>• Total casts:</span>
          <span className={styles.resultValue}>{results.castFetching.totalCasts}</span>
        </div>
        
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>• Sessions processed:</span>
          <span className={styles.resultValue}>{results.sessionProcessing.processed}</span>
        </div>
        
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>• Workouts detected:</span>
          <span className={styles.resultValue}>{results.sessionProcessing.workouts}</span>
        </div>
      </div>

      <Button onClick={onClearResults} className={styles.clearButton} caption="🚀 Run Again" />
    </div>
  );
};

export default AutomationResults;