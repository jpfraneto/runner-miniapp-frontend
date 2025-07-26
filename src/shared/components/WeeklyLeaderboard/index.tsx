import React, { useState, useEffect } from "react";
import {
  getCurrentLeaderboard,
  getWeeklyLeaderboard,
} from "@/services/runnerAPI";
import { Leaderboard } from "@/shared/types/leaderboard";
import {
  getCurrentWeekNumber,
  formatWeekDisplay,
  getTimeUntilReset,
  formatCountdown,
  formatWeekDateRange,
} from "@/shared/utils/weekCalculation";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import { FaShareAlt } from "react-icons/fa";
// import MintButton from "@/shared/components/MintButton";
import styles from "./WeeklyLeaderboard.module.scss";
import { API_URL } from "@/config/api";
import { useUnits } from "@/shared/providers/UnitsProvider";

interface WeeklyLeaderboardProps {
  weekNumber?: number;
  year?: number;
  showHistoricalNavigation?: boolean;
  maxEntries?: number;
}

const WeeklyLeaderboard: React.FC<WeeklyLeaderboardProps> = ({
  weekNumber,
  maxEntries,
}) => {
  const navigate = useNavigate();
  const { formatDistance, toggleUnits } = useUnits();
  const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);
  const [loading, setLoading] = useState(true);
  const [mirrored, setMirrored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingWeek, setIsEditingWeek] = useState(false);
  const [inputWeek, setInputWeek] = useState("");
  const currentWeek = getCurrentWeekNumber();
  const displayWeek = weekNumber ?? currentWeek;
  const isCurrentWeek = displayWeek === currentWeek;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: Leaderboard;
        if (isCurrentWeek) {
          data = await getCurrentLeaderboard();
        } else {
          data = await getWeeklyLeaderboard(displayWeek);
        }
        console.log("IIIIIIN HERE, THE DATA IS:", data);

        setLeaderboard(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [displayWeek, isCurrentWeek, maxEntries]);

  const handleUserClick = (fid: number) => {
    navigate(`/user/${fid}?weekNumber=${displayWeek}`);
  };

  const handleWeekClick = () => {
    setIsEditingWeek(true);
    setInputWeek(displayWeek.toString());
  };

  const handleWeekSubmit = () => {
    const newWeek = parseInt(inputWeek);
    const validWeek =
      isNaN(newWeek) || newWeek > currentWeek
        ? currentWeek
        : Math.max(0, newWeek);

    setIsEditingWeek(false);
    if (validWeek !== displayWeek) {
      navigate(`/leaderboard?week=${validWeek}`);
    }
  };

  const handleWeekInputBlur = () => {
    const newWeek = parseInt(inputWeek);
    const validWeek =
      isNaN(newWeek) || newWeek > currentWeek
        ? currentWeek
        : Math.max(0, newWeek);

    setIsEditingWeek(false);
    if (validWeek !== displayWeek) {
      navigate(`/leaderboard?week=${validWeek}`);
    }
  };

  const handleWeekInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleWeekSubmit();
    } else if (e.key === "Escape") {
      setIsEditingWeek(false);
    }
  };

  const handlePrevWeek = () => {
    if (displayWeek > 0) {
      sdk.haptics.impactOccurred("light");
      setMirrored(true);
      navigate(`/leaderboard?week=${displayWeek - 1}`);
    }
  };

  const handleNextWeek = () => {
    if (displayWeek < currentWeek) {
      sdk.haptics.impactOccurred("light");
      setMirrored(false);
      navigate(`/leaderboard?week=${displayWeek + 1}`);
    }
  };

  const handleShare = () => {
    // Create detailed leaderboard text
    const weekTitle = `${formatWeekDisplay(displayWeek)} $runner leaderboard${
      isCurrentWeek ? " (LIVE)" : ""
    }`;
    const dateRange = formatWeekDateRange(displayWeek);

    // Build the leaderboard entries
    const leaderboardEntries = leaderboard
      .slice(0, 3)
      .map((entry, index) => {
        const position = index + 1;
        const medal =
          position === 1
            ? "🥇"
            : position === 2
            ? "🥈"
            : position === 3
            ? "🥉"
            : `${position}.`;
        const distance = formatDistance(entry.totalKilometers * 1000);
        return `${medal} @${entry.username} - ${distance}`;
      })
      .join("\n");

    const shareText = `${weekTitle}\n${dateRange}\n\n🏃‍♂️ Top 3 Runners:\n\n${leaderboardEntries}`;
    const shareEmbed = `${API_URL}/embeds/leaderboard/${displayWeek}`;
    console.log("SHARE EMBED", shareEmbed);
    sdk.actions.composeCast({
      text: shareText,
      embeds: [shareEmbed],
    });
  };

  const getRankingColor = (position: number) => {
    switch (position) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return "";
    }
  };

  const renderLoadingLeaderboard = () => (
    <div className={styles.loadingRectangle}>
      <img
        src="/runner.gif"
        alt="Loading..."
        className={`${styles.runnerGif} ${mirrored ? styles.mirrored : ""}`}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.streamlinedHeader}>
        {/* Left Navigation */}
        <button
          onClick={handlePrevWeek}
          disabled={displayWeek <= 0}
          className={styles.navArrow}
          title="Previous week"
        >
          ←
        </button>

        {/* Week Number / Input */}
        <div className={styles.weekDisplay}>
          <div className={styles.weekLabel}>WEEK</div>
          <div className={styles.weekDateRange}>
            {formatWeekDateRange(displayWeek)}
          </div>
          {isEditingWeek ? (
            <input
              type="tel"
              value={inputWeek}
              onChange={(e) => setInputWeek(e.target.value)}
              onBlur={handleWeekInputBlur}
              onKeyDown={handleWeekInputKeyDown}
              className={styles.weekInput}
              autoFocus
              min="0"
              max={currentWeek}
            />
          ) : (
            <button onClick={handleWeekClick} className={styles.weekNumber}>
              {displayWeek}
            </button>
          )}
          {isCurrentWeek && (
            <div className={styles.timer}>
              {formatCountdown(getTimeUntilReset())}
            </div>
          )}
        </div>

        {/* Right Navigation */}
        <button
          onClick={handleNextWeek}
          disabled={displayWeek >= currentWeek}
          className={styles.navArrow}
          title="Next week"
        >
          →
        </button>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            onClick={handleShare}
            className={styles.shareButton}
            title="Share leaderboard"
          >
            <FaShareAlt />
          </button>

          {/* <MintButton weekNumber={displayWeek} /> */}
        </div>
      </div>

      <div className={styles.leaderboardContainer}>
        {loading ? (
          renderLoadingLeaderboard()
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className={styles.empty}>
            <p>No data available for this week</p>
          </div>
        ) : (
          <table className={styles.leaderboardTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Runner</th>
                <th
                  className={styles.clickableHeader}
                  onClick={toggleUnits}
                  title="Click to toggle units"
                >
                  Distance
                </th>
                <th>Runs</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                return (
                  <tr
                    key={entry.fid}
                    className={`${styles.leaderboardRow} ${getRankingColor(
                      entry.position
                    )}`}
                  >
                    <td
                      className={styles.rankCell}
                      onClick={() => handleUserClick(entry.fid)}
                    >
                      <span className={styles.rankNumber}>
                        {entry.position}
                      </span>
                    </td>
                    <td
                      className={styles.userCell}
                      onClick={() => handleUserClick(entry.fid)}
                    >
                      <img
                        src={entry.pfpUrl}
                        alt="Avatar"
                        className={styles.avatar}
                      />
                      <span className={styles.username}>@{entry.username}</span>
                    </td>
                    <td
                      className={`${styles.distanceCell} ${styles.clickableCell}`}
                      onClick={() => toggleUnits()}
                      title="Click to toggle units"
                    >
                      {formatDistance(entry.totalKilometers * 1000)}
                    </td>
                    <td
                      onClick={() => handleUserClick(entry.fid)}
                      className={styles.runsCell}
                    >
                      {entry.totalRuns}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WeeklyLeaderboard;
