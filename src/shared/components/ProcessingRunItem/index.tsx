import React, { useEffect } from "react";
import { useCastProcessing } from "@/shared/hooks/user/useCastProcessing";
import { useProcessingRuns } from "@/shared/providers/ProcessingRunsProvider";
import styles from "./ProcessingRunItem.module.scss";

interface ProcessingRunItemProps {
  id: string;
  castHash: string;
  text: string;
  timestamp: number;
}

const ProcessingRunItem: React.FC<ProcessingRunItemProps> = ({
  id,
  castHash,
  text,
  timestamp,
}) => {
  const { updateProcessingRun, removeProcessingRun } = useProcessingRuns();
  const { data: processingData, error } = useCastProcessing(castHash);

  useEffect(() => {
    if (processingData) {
      if (!processingData.isProcessing && processingData.runData) {
        // Processing is complete, update with the run data
        updateProcessingRun(id, processingData.runData);
      } else if (processingData.error) {
        // Processing failed, remove the processing run
        console.error("Cast processing failed:", processingData.error);
        removeProcessingRun(id);
      }
    }
  }, [processingData, id, updateProcessingRun, removeProcessingRun]);

  useEffect(() => {
    if (error) {
      console.error("Error polling cast processing:", error);
      // Remove the processing run if there's a persistent error
      removeProcessingRun(id);
    }
  }, [error, id, removeProcessingRun]);

  const timeAgo = React.useMemo(() => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 1) {
      return "just now";
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  }, [timestamp]);

  return (
    <div className={styles.processingItem}>
      <div className={styles.header}>
        <div className={styles.processingIndicator}>
          <div className={styles.spinner} />
          <span className={styles.processingText}>Processing...</span>
        </div>
        <span className={styles.timestamp}>{timeAgo}</span>
      </div>
      
      <div className={styles.content}>
        <p className={styles.text}>{text}</p>
        <div className={styles.statusMessage}>
          <span className={styles.statusIcon}>⏳</span>
          <span>Analyzing your run data...</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingRunItem;