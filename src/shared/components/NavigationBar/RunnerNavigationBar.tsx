// Dependencies
import React, { useCallback, useContext } from "react";
import classNames from "clsx";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

// Components
import Typography from "../Typography";

// Context
import { AuthContext } from "@/shared/providers/AppProvider";

// Hooks
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";

interface RunnerNavigationBarProps {
  onLogRun?: () => void;
}

const RunnerNavigationBar: React.FC<RunnerNavigationBarProps> = ({
  onLogRun,
}) => {
  const { todaysMission } = useContext(AuthContext);
  const navigate = useNavigate();

  const isActive = (path: string) => {
    const currentPath = window.location.pathname;

    return currentPath === path;
  };

  /**
   * Handles the log run action
   */
  const handleClickLogRun = useCallback(() => {
    sdk.haptics.selectionChanged();
    if (todaysMission?.hasCompletedToday) {
      sdk.haptics.notificationOccurred("warning");
      // Could show a toast or modal saying they already logged today
    } else {
      sdk.haptics.notificationOccurred("success");
      // Trigger the log run modal
      onLogRun?.();
    }
  }, [todaysMission, onLogRun]);

  return (
    <div className={classNames(styles.layout)}>
      {/* Home Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/"),
        })}
        onClick={() => {
          navigate("/");
        }}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>🏠</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Home
        </Typography>
      </button>

      {/* Coach Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/coach"),
        })}
        onClick={() => {
          navigate("/coach");
        }}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>🤖</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Coach
        </Typography>
      </button>

      {/* Log Run Tab (Center with special styling) */}
      <button
        className={classNames(styles.tab, styles.logRunTab, {
          [styles.disabled]: !todaysMission || todaysMission?.hasCompletedToday,
        })}
        onClick={handleClickLogRun}
        disabled={!todaysMission || todaysMission?.hasCompletedToday}
      >
        <div className={styles.logRunIconWrapper}>
          <div className={styles.logRunIcon}>
            {!todaysMission
              ? "⏳"
              : todaysMission?.hasCompletedToday
              ? "✅"
              : "🏃‍♀️"}
          </div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          {!todaysMission
            ? "Loading"
            : todaysMission?.hasCompletedToday
            ? "Done"
            : "Log Run"}
        </Typography>
      </button>

      {/* Progress Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/progress"),
        })}
        onClick={() => {
          navigate("/progress");
        }}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>📊</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Progress
        </Typography>
      </button>

      {/* Community Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/leaderboard"),
        })}
        onClick={() => {
          navigate("/leaderboard");
        }}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>🏆</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Leaderboard
        </Typography>
      </button>
    </div>
  );
};

export default RunnerNavigationBar;
