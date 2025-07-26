import React, { useState } from "react";
import AutomationTrigger from "../AutomationTrigger";
import AutomationResults from "../AutomationResults";
import { useModal } from "@/shared/hooks/ui/useModal";
import { ModalsIds } from "@/shared/providers/ModalProvider/types";
import { API_URL } from "@/config/api";
import styles from "./AdminAutomationPanel.module.scss";

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

interface SeedingResult {
  success: boolean;
  error?: string;
  data?: {
    runningSessions: number;
    usersCreated: number;
    weeksCreated: number;
  };
}

const AdminAutomationPanel: React.FC = () => {
  const [results, setResults] = useState<AutomationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResult, setSeedingResult] = useState<SeedingResult | null>(
    null
  );
  const { openModal } = useModal();

  const handleAutomationComplete = (data: AutomationData) => {
    setResults(data);
    setError(null);
  };

  const handleAutomationError = (errorMessage: string) => {
    setError(errorMessage);
    setResults(null);
  };

  const handleAutomationStart = () => {
    setResults(null);
    setError(null);
  };

  const handleDatabaseReset = async () => {
    setIsSeeding(true);
    setSeedingResult(null);

    try {
      const response = await fetch(`${API_URL}/admin-service/make-db-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: 16098 }),
      });

      const result = await response.json();
      setSeedingResult(result);
    } catch (error) {
      setSeedingResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const showDatabaseResetConfirmation = () => {
    openModal(ModalsIds.DATABASE_RESET_CONFIRM, {
      title: "⚠️ Database Reset Confirmation",
      message:
        "This will PERMANENTLY DELETE all running data and rebuild from /running channel history. This action cannot be undone. Are you sure you want to proceed?",
      onConfirm: handleDatabaseReset,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🤖 RunnerCoin Automation</h1>
        <p className={styles.subtitle}>Admin Dashboard</p>
      </div>

      <AutomationTrigger
        onStart={handleAutomationStart}
        onComplete={handleAutomationComplete}
        onError={handleAutomationError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {(results || error) && (
        <AutomationResults
          results={results}
          error={error}
          onClearResults={() => {
            setResults(null);
            setError(null);
          }}
        />
      )}

      <div className={styles.seedingSection}>
        <div className={styles.warningText}>
          ⚠️ This will PERMANENTLY DELETE all running data and rebuild from
          /running channel history. Only use for complete database reset.
        </div>
        <button
          onClick={showDatabaseResetConfirmation}
          disabled={isSeeding}
          className={styles.seedButton}
        >
          {isSeeding
            ? "🌱 Resetting Database..."
            : "🧹 Complete Database Reset & Seed"}
        </button>

        {seedingResult && (
          <div
            className={`${styles.seedResult} ${
              seedingResult.success ? styles.success : styles.error
            }`}
          >
            {seedingResult.success ? (
              <div>
                <p>✅ Seeding completed!</p>
                <p>
                  Sessions: {seedingResult.data?.runningSessions}, Users:{" "}
                  {seedingResult.data?.usersCreated}, Weeks:{" "}
                  {seedingResult.data?.weeksCreated}
                </p>
              </div>
            ) : (
              <p>❌ Error: {seedingResult.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAutomationPanel;
