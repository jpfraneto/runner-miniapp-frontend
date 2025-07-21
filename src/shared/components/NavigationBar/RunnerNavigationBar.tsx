// Dependencies
import React, { useCallback, useState } from "react";
import classNames from "clsx";

// StyleSheet
import styles from "./RunnerNavigationBar.module.scss";

// SVG Icons
import HomeIcon from "./icons/HomeIcon";
import RunningIcon from "./icons/RunningIcon";
import LeaderboardIcon from "./icons/LeaderboardIcon";

// Components
import CastProcessingScreen from "@/shared/components/CastProcessingScreen";

// Hooks
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";
import { useProcessingRuns } from "@/shared/providers/ProcessingRunsProvider";

interface RunnerNavigationBarProps {}

const RunnerNavigationBar: React.FC<RunnerNavigationBarProps> = () => {
  const navigate = useNavigate();
  const { addProcessingRun } = useProcessingRuns();
  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const [processingData, setProcessingData] = useState<{
    castHash: string;
    text: string;
    embeds: string[];
  } | null>(null);

  const isActive = (path: string) => {
    const currentPath = window.location.pathname;
    if (path === "/" && (currentPath === "/" || currentPath === "/home"))
      return true;
    if (path === "/running" && currentPath === "/running") return true;
    if (path === "/leaderboard" && currentPath === "/leaderboard") return true;
    return false;
  };

  /**
   * Handles the run button click - checks channel membership and opens cast composer
   */
  const handleClickLogRun = useCallback(async () => {
    sdk.haptics.selectionChanged();

    try {
      // Open cast composer
      const response = await sdk.actions.composeCast({
        text: "[insert run details and screenshots here]",
        embeds: [],
        channelKey: "running",
      });

      console.log("Cast response:", response);

      // If cast was successful, show processing screen
      if (response && response.cast && response.cast.hash) {
        const processingRun = {
          id: `processing-${Date.now()}`,
          castHash: response.cast.hash,
          text: response.cast.text || "",
          embeds: response.cast.embeds || [],
          timestamp: Date.now(),
        };

        addProcessingRun(processingRun);

        // Set processing data and show processing screen
        setProcessingData({
          castHash: response.cast.hash,
          text: response.cast.text || "",
          embeds: response.cast.embeds || [],
        });
        setShowProcessingScreen(true);
      }
    } catch (error) {
      console.error("Failed to compose cast:", error);
    }
  }, [addProcessingRun]);

  const handleProcessingComplete = () => {
    setShowProcessingScreen(false);
    setProcessingData(null);
    navigate("/");
  };

  return (
    <>
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
            <HomeIcon className={styles.icon} />
          </div>
        </button>

        {/* Run Tab (Center with special styling) */}
        <button
          className={classNames(styles.tab, styles.runTab)}
          onClick={handleClickLogRun}
        >
          <div className={styles.runIconWrapper}>
            <RunningIcon className={styles.runIcon} />
          </div>
        </button>

        {/* Leaderboard Tab */}
        <button
          className={classNames(styles.tab, {
            [styles.active]: isActive("/leaderboard"),
          })}
          onClick={() => {
            navigate("/leaderboard");
          }}
        >
          <div className={styles.iconWrapper}>
            <LeaderboardIcon className={styles.icon} />
          </div>
        </button>
      </div>

      {/* Cast Processing Screen */}
      {showProcessingScreen && processingData && (
        <CastProcessingScreen
          castHash={processingData.castHash}
          text={processingData.text}
          embeds={processingData.embeds}
          onComplete={handleProcessingComplete}
        />
      )}
    </>
  );
};

export default RunnerNavigationBar;
