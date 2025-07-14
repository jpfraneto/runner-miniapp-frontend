// Dependencies
import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import UserProfile from "@/shared/components/UserProfile";

// Hooks
import { useLeaderboard, SortBy, TimePeriod } from "@/shared/hooks/user";

// StyleSheet
import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>("totalDistance");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");
  const { data, isLoading, error, refetch } = useLeaderboard({
    sortBy,
    timePeriod,
  });
  // const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
  };

  const handleTimePeriodChange = (newTimePeriod: TimePeriod) => {
    setTimePeriod(newTimePeriod);
  };

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleBackToLeaderboard = () => {
    setSelectedUserId(null);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (distance: number) => {
    return distance.toFixed(1) + " km";
  };

  const getSortLabel = (sortType: SortBy) => {
    switch (sortType) {
      case "totalDistance":
        return "Distance";
      case "totalWorkouts":
        return "Workouts";
      case "totalTime":
        return "Time";
      default:
        return "Distance";
    }
  };

  const getSortValue = (user: any, sortType: SortBy) => {
    switch (sortType) {
      case "totalDistance":
        return formatDistance(user.totalDistance);
      case "totalWorkouts":
        return user.totalWorkouts.toString();
      case "totalTime":
        return formatTime(user.totalTime);
      default:
        return formatDistance(user.totalDistance);
    }
  };

  // If a user is selected, show their profile in-place
  if (selectedUserId) {
    return (
      <AppLayout>
        <UserProfile
          userId={selectedUserId}
          onBack={handleBackToLeaderboard}
          onEdit={() => {}}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.leaderboardContainer}>
          {/* Sort Options - now just above the table */}
          <div className={styles.sortOptions}>
            <div className={styles.sortButtonsRow}>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "totalDistance" ? styles.active : ""
                }`}
                onClick={() => handleSortChange("totalDistance")}
              >
                Distance
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "totalWorkouts" ? styles.active : ""
                }`}
                onClick={() => handleSortChange("totalWorkouts")}
              >
                Workouts
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortBy === "totalTime" ? styles.active : ""
                }`}
                onClick={() => handleSortChange("totalTime")}
              >
                Time
              </button>
            </div>

            {/* Time Period Filter */}
            <div className={styles.timePeriodFilter}>
              <button
                className={`${styles.timePeriodButton} ${
                  timePeriod === "weekly" ? styles.active : ""
                }`}
                onClick={() => handleTimePeriodChange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`${styles.timePeriodButton} ${
                  timePeriod === "all-time" ? styles.active : ""
                }`}
                onClick={() => handleTimePeriodChange("all-time")}
              >
                All Time
              </button>
            </div>
          </div>

          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading leaderboard...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Failed to load leaderboard</p>
              <button onClick={() => refetch()} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          )}

          {data?.success && data.data && (
            <div className={styles.leaderboardList}>
              <div className={styles.listHeader}>
                <div className={styles.rankColumn}>Rank</div>
                <div className={styles.userColumn}>Runner</div>
                <div className={styles.statColumn}>{getSortLabel(sortBy)}</div>
                <div className={styles.detailsColumn}>Details</div>
              </div>

              {data.data.map((user, index) => (
                <div
                  key={user.fid}
                  className={`${styles.leaderboardItem} ${styles.cardRow}`}
                  onClick={() => handleUserClick(user.fid)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUserClick(user.fid);
                  }}
                >
                  <div className={styles.rankColumn}>
                    <div
                      className={`${styles.rankBadge} ${
                        index < 3 ? styles[`rank${index + 1}`] : ""
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className={styles.userColumn}>
                    <img
                      src={user.pfpUrl}
                      alt={user.username}
                      className={styles.userAvatar}
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <div className={styles.userInfo}>
                      <div className={styles.username}>{user.username}</div>
                    </div>
                  </div>
                  <div className={styles.statColumn}>
                    <div className={styles.primaryStat}>
                      {getSortValue(user, sortBy)}
                    </div>
                  </div>
                  <div className={styles.detailsColumn}>
                    <div className={styles.additionalStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Distance:</span>
                        <span className={styles.statValue}>
                          {formatDistance(user.totalDistance)}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Workouts:</span>
                        <span className={styles.statValue}>
                          {user.totalWorkouts}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Time:</span>
                        <span className={styles.statValue}>
                          {formatTime(user.totalTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
