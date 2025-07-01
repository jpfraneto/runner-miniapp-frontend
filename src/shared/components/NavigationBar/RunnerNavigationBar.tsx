// Dependencies
import React, { useCallback } from "react";
import classNames from "clsx";
import { useNavigate, useLocation } from "react-router-dom";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

// Components
import Typography from "../Typography";

// Hooks
import { useAuth } from "@/hooks/auth";
import sdk from "@farcaster/frame-sdk";

interface RunnerNavigationBarProps {}

const RunnerNavigationBar: React.FC<RunnerNavigationBarProps> = () => {
  const { data } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles navigation to home page
   */
  const handleClickHome = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/miniapp");
  }, [navigate]);

  /**
   * Handles navigation to workout page
   */
  const handleClickWorkout = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/miniapp/workout");
  }, [navigate]);

  /**
   * Handles navigation to progress page
   */
  const handleClickProgress = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/miniapp/progress");
  }, [navigate]);

  /**
   * Handles navigation to community page
   */
  const handleClickCommunity = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/miniapp/community");
  }, [navigate]);

  /**
   * Determines if a tab is active based on current route
   */
  const isActive = useCallback(
    (path: string) => {
      if (path === "/miniapp" && location.pathname === "/miniapp") return true;
      if (path !== "/miniapp" && location.pathname.startsWith(path))
        return true;
      return false;
    },
    [location.pathname]
  );

  return (
    <div className={classNames(styles.layout)}>
      {/* Home Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/miniapp"),
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

      {/* Workout Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/miniapp/workout"),
        })}
        onClick={handleClickWorkout}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>🏃‍♂️</div>
        </div>
        <Typography size={10} weight="medium" className={styles.label}>
          Workout
        </Typography>
      </button>

      {/* Progress Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/miniapp/progress"),
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
          [styles.active]: isActive("/miniapp/community"),
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
