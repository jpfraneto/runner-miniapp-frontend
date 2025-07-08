// Dependencies
import React, { useCallback } from "react";
import classNames from "clsx";
import { useNavigate, useLocation } from "react-router-dom";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

// Components
import Typography from "../Typography";

// Hooks
import sdk from "@farcaster/frame-sdk";
import { useTodaysMission } from "@/shared/hooks/user/useTodaysMission";

interface RunnerNavigationBarProps {
  onLogRun?: () => void;
}

const RunnerNavigationBar: React.FC<RunnerNavigationBarProps> = ({
  onLogRun,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: todaysMission, isLoading: missionLoading } = useTodaysMission();

  /**
   * Handles navigation to home page
   */
  const handleClickHome = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/");
  }, [navigate]);

  /**
   * Handles navigation to coach page
   */
  const handleClickCoach = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/coach");
  }, [navigate]);

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

  /**
   * Handles navigation to progress page
   */
  const handleClickProgress = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/progress");
  }, [navigate]);

  /**
   * Handles navigation to community page
   */
  const handleClickCommunity = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/community");
  }, [navigate]);

  /**
   * Determines if a tab is active based on current route
   */
  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && location.pathname === "/") return true;
      if (path !== "/" && location.pathname.startsWith(path)) return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <div className={classNames(styles.layout)}>
      {/* Home Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/"),
        })}
        onClick={handleClickHome}
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
        onClick={handleClickCoach}
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
          [styles.disabled]: missionLoading || todaysMission?.hasCompletedToday,
        })}
        onClick={handleClickLogRun}
        disabled={missionLoading || todaysMission?.hasCompletedToday}
      >
        <div className={styles.logRunIconWrapper}>
          <div className={styles.logRunIcon}>
            {missionLoading
              ? "⏳"
              : todaysMission?.hasCompletedToday
              ? "✅"
              : "🏃‍♀️"}
          </div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          {missionLoading
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
        onClick={handleClickProgress}
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
          [styles.active]: isActive("/community"),
        })}
        onClick={handleClickCommunity}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>👥</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Community
        </Typography>
      </button>
    </div>
  );
};

export default RunnerNavigationBar;
