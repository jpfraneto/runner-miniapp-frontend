// Dependencies
import React, { useCallback } from "react";
import classNames from "clsx";
import { useNavigate, useLocation } from "react-router-dom";

// StyleSheet
import styles from "./NavigationBar.module.scss";

// Components
import HomeIcon from "./icons/HomeIcon";
import RunningIcon from "./icons/RunningIcon";
import LeaderboardIcon from "./icons/LeaderboardIcon";

// Hooks
import sdk from "@farcaster/frame-sdk";

interface NavigationBarProps {}

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles navigation to home page
   */
  const handleClickHome = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/");
  }, [navigate]);

  /**
   * Handles navigation to running session page
   */
  const handleClickRunning = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/");
  }, [navigate]);

  /**
   * Handles navigation to leaderboard page
   */
  const handleClickLeaderboard = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/leaderboard");
  }, [navigate]);

  /**
   * Handles navigation to activity page
   */
  const handleClickActivity = useCallback(() => {
    sdk.haptics.selectionChanged();
    navigate("/activity");
  }, [navigate]);

  /**
   * Determines if a tab is active based on current route
   */
  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && location.pathname === "/") return true;
      if (path === "/leaderboard" && location.pathname.startsWith("/leaderboard"))
        return true;
      if (path === "/activity" && location.pathname.startsWith("/activity"))
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
          [styles.active]: isActive("/"),
        })}
        onClick={handleClickHome}
      >
        <div className={styles.iconWrapper}>
          <HomeIcon className={styles.icon} />
        </div>
      </button>

      {/* Leaderboard Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/leaderboard"),
        })}
        onClick={handleClickLeaderboard}
      >
        <div className={styles.iconWrapper}>
          <LeaderboardIcon className={styles.icon} />
        </div>
      </button>

      {/* Activity Tab */}
      <button
        className={classNames(styles.tab, {
          [styles.active]: isActive("/activity"),
        })}
        onClick={handleClickActivity}
      >
        <div className={styles.iconWrapper}>
          <RunningIcon className={styles.icon} />
        </div>
      </button>
    </div>
  );
};

export default NavigationBar;
