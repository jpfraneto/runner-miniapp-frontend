import React, { useState } from "react";
import Button from "../Button";
import styles from "./AutomationTrigger.module.scss";

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

interface AutomationTriggerProps {
  onStart: () => void;
  onComplete: (data: AutomationData) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AutomationTrigger: React.FC<AutomationTriggerProps> = ({
  onStart,
  onComplete,
  onError,
  isLoading,
  setIsLoading,
}) => {
  const [numToProcess, setNumToProcess] = useState(10);

  const triggerAutomation = async () => {
    if (isLoading) return;

    try {
      onStart();
      setIsLoading(true);

      const response = await fetch('/admin/process-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid: 16098,
          numToProcess,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Automation failed');
      }

      onComplete(result.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumToProcessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 50) {
      setNumToProcess(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="numToProcess" className={styles.label}>
          Sessions to process:
        </label>
        <input
          id="numToProcess"
          type="number"
          min="1"
          max="50"
          value={numToProcess}
          onChange={handleNumToProcessChange}
          disabled={isLoading}
          className={styles.input}
        />
      </div>

      <Button
        onClick={triggerAutomation}
        disabled={isLoading}
        className={styles.triggerButton}
        caption={isLoading ? "Running automation..." : "🚀 Run Automation"}
      />

      {isLoading && (
        <div className={styles.loadingStatus}>
          <div className={styles.progressBar}>
            <div className={styles.progressBarFill}></div>
          </div>
          <p className={styles.loadingText}>Processing automation...</p>
        </div>
      )}
    </div>
  );
};

export default AutomationTrigger;