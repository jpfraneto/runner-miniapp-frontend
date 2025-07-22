import React, { useState, useEffect } from "react";
import {
  getCurrentLeaderboard,
  getWeeklyLeaderboard,
} from "@/services/runnerAPI";
import { Leaderboard } from "@/shared/types/leaderboard";
import {
  getCurrentWeekNumber,
  formatWeekDisplay,
} from "@/shared/utils/weekCalculation";
import { useNavigate } from "react-router-dom";
import styles from "./WeeklyLeaderboard.module.scss";

interface WeeklyLeaderboardProps {
  weekNumber?: number;
  year?: number;
  showHistoricalNavigation?: boolean;
  maxEntries?: number;
}

const WeeklyLeaderboard: React.FC<WeeklyLeaderboardProps> = ({
  weekNumber,
  year = 2024,
  showHistoricalNavigation = false,
  maxEntries,
}) => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          data = await getWeeklyLeaderboard(displayWeek, year);
        }
        console.log("IIIIIIN HERE, THE DATA IS:", data);

        setLeaderboard(maxEntries ? data.slice(0, maxEntries) : data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [displayWeek, year, isCurrentWeek, maxEntries]);

  const handleUserClick = (fid: number) => {
    navigate(`/user/${fid}`);
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

  const renderSkeletonLoading = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{formatWeekDisplay(displayWeek)} Leaderboard</h2>
      </div>

      {showHistoricalNavigation && (
        <div className={styles.navigation}>
          <div className={styles.skeletonNavButton}></div>
          <div className={styles.skeletonNavButton}></div>
          <div className={styles.skeletonNavButton}></div>
        </div>
      )}

      <div className={styles.leaderboardList}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonPosition}></div>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonUserInfo}>
              <div className={styles.skeletonUsername}></div>
            </div>
            <div className={styles.skeletonStats}>
              <div className={styles.skeletonStat}></div>
              <div className={styles.skeletonStat}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return renderSkeletonLoading();
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{formatWeekDisplay(displayWeek)} Leaderboard</h2>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{formatWeekDisplay(displayWeek)} Leaderboard</h2>
        {isCurrentWeek && <span className={styles.liveBadge}>LIVE</span>}
      </div>

      {showHistoricalNavigation && (
        <div className={styles.navigation}>
          <button
            onClick={() =>
              navigate(`/leaderboard?week=${displayWeek - 1}&year=${year}`)
            }
            disabled={displayWeek <= 0}
            className={styles.navButton}
          >
            ← Previous Week
          </button>
          <button
            onClick={() => navigate(`/leaderboard`)}
            disabled={isCurrentWeek}
            className={styles.navButton}
          >
            Current Week
          </button>
          <button
            onClick={() =>
              navigate(`/leaderboard?week=${displayWeek + 1}&year=${year}`)
            }
            disabled={displayWeek >= currentWeek}
            className={styles.navButton}
          >
            Next Week →
          </button>
        </div>
      )}

      <div className={styles.leaderboardList}>
        {leaderboard.length === 0 ? (
          <div className={styles.empty}>
            <p>No data available for this week</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.fid}
              className={`${styles.leaderboardItem} ${getRankingColor(
                entry.position
              )}`}
              onClick={() => handleUserClick(entry.fid)}
            >
              <div className={styles.position}>
                <span className={styles.rank}>#{entry.position}</span>
              </div>

              <div className={styles.avatar}>
                <div className={styles.avatarPlaceholder}>
                  {entry.username.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className={styles.userInfo}>
                <div className={styles.username}>@{entry.username}</div>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {entry.totalKilometers.toFixed(1)} km
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{entry.totalRuns}</span>
                  <span className={styles.statLabel}>runs</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {maxEntries && leaderboard.length >= maxEntries && (
        <div className={styles.viewMore}>
          <button
            onClick={() => navigate("/leaderboard")}
            className={styles.viewMoreButton}
          >
            View Full Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default WeeklyLeaderboard;
