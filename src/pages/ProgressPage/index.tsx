// Dependencies
import React, { useContext, useState, useEffect } from "react";
import AppLayout from "@/shared/layouts/AppLayout";
import { useAuth } from "@/shared/hooks/auth";
import { AuthContext } from "@/shared/providers/AppProvider";
import { getFarcasterToken } from "@/shared/utils/auth";
import NewUserExperience from "./components/NewUserExperience";
import GoalSetting from "./components/GoalSetting";
import styles from "./ProgressPage.module.scss";

interface ProgressData {
  totalRuns: number;
  totalDistance: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  personalBests: {
    distance: number;
    pace: string;
    time: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }>;
  recentMilestones: Array<{
    type: string;
    value: number;
    achievedAt: string;
  }>;
  ranking: {
    position: number;
    percentile: number;
    totalUsers: number;
  };
  weeklyProgress: {
    runs: number;
    distance: number;
    improvement: number;
  };
}

const ProgressPage: React.FC = () => {
  const { miniappContext } = useContext(AuthContext);
  const { data: user, isLoading: authLoading } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [userGoal, setUserGoal] = useState<string | null>(null);
  const [isLoadingGoal, setIsLoadingGoal] = useState(true);

  const userFid = miniappContext?.user?.fid || user?.fid;

  // Function to check if user has a goal
  useEffect(() => {
    const checkUserGoal = async () => {
      if (!userFid) return;

      try {
        const farcasterToken = getFarcasterToken();
        const response = await fetch("/api/user-service/goal", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${farcasterToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserGoal(data.goal);
        } else {
          console.error("Failed to fetch user goal:", response.statusText);
          setUserGoal(null);
        }
      } catch (error) {
        console.error("Error fetching user goal:", error);
        setUserGoal(null);
      } finally {
        setIsLoadingGoal(false);
      }
    };

    checkUserGoal();
  }, [userFid]);

  const handleGoalSet = async (goal: string, goalType: "preset" | "custom") => {
    try {
      console.log("Setting goal:", goal, "Type:", goalType);

      const farcasterToken = getFarcasterToken();
      const response = await fetch("/api/user-service/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${farcasterToken}`,
        },
        body: JSON.stringify({ goal, goalType }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserGoal(goal);
        console.log("Goal set successfully:", data);

        // If training plan was generated, you could show it to the user here
        if (data.trainingPlan) {
          console.log("Generated training plan:", data.trainingPlan);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to set goal:", errorData);
        throw new Error(errorData.message || "Failed to set goal");
      }
    } catch (error) {
      console.error("Error setting goal:", error);
      // You might want to show an error message to the user here
    }
  };

  if (authLoading || !userFid || isLoadingGoal) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your running story...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // If user has no goal, show goal setting screen
  if (!userGoal) {
    return (
      <AppLayout>
        <GoalSetting onGoalSet={handleGoalSet} />
      </AppLayout>
    );
  }

  const mockData: ProgressData = {
    totalRuns: 127,
    totalDistance: 842.3,
    totalTime: 7245,
    currentStreak: 12,
    longestStreak: 28,
    personalBests: {
      distance: 21.1,
      pace: "4:32",
      time: 95,
    },
    achievements: [
      {
        id: "first5k",
        title: "First 5K",
        description: "Completed your first 5K run",
        unlockedAt: "2024-01-15",
        icon: "🏃",
      },
      {
        id: "streak7",
        title: "Week Warrior",
        description: "7 day running streak",
        unlockedAt: "2024-02-01",
        icon: "🔥",
      },
      {
        id: "distance100",
        title: "Century Club",
        description: "100km total distance",
        unlockedAt: "2024-02-15",
        icon: "💯",
      },
    ],
    recentMilestones: [
      { type: "distance", value: 800, achievedAt: "2024-03-10" },
      { type: "runs", value: 125, achievedAt: "2024-03-08" },
    ],
    ranking: {
      position: 234,
      percentile: 15,
      totalUsers: 1547,
    },
    weeklyProgress: {
      runs: 4,
      distance: 28.5,
      improvement: 12,
    },
  };

  if (mockData.totalRuns < 3) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <NewUserExperience />
        </div>
      </AppLayout>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const generateShareText = () => {
    return `🏃‍♂️ My RunnerCoin Journey:\n\n📊 ${mockData.totalRuns} runs • ${
      mockData.totalDistance
    }km • ${formatTime(mockData.totalTime)}\n🔥 ${
      mockData.currentStreak
    } day streak\n🏆 Top ${
      mockData.ranking.percentile
    }% of runners\n\nJoin me on RunnerCoin! 💪`;
  };

  return (
    <AppLayout>
      <div>Progress page</div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Hero Impact Card - The main shareable story */}
        <div className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>
              Your Running Impact (mock data)
            </h1>
            <button
              className={styles.shareButton}
              onClick={() => setShareModalOpen(true)}
            >
              Share Story 📤
            </button>
          </div>

          <div className={styles.impactStats}>
            <div className={styles.impactStat}>
              <div className={styles.impactValue}>{mockData.totalRuns}</div>
              <div className={styles.impactLabel}>Total Runs</div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.impactValue}>
                {mockData.totalDistance}km
              </div>
              <div className={styles.impactLabel}>Distance Covered</div>
              <div className={styles.impactSubtext}>
                That's like running to{" "}
                {mockData.totalDistance > 500
                  ? "another city"
                  : "the next town"}
                !
              </div>
            </div>
            <div className={styles.impactStat}>
              <div className={styles.impactValue}>
                {formatTime(mockData.totalTime)}
              </div>
              <div className={styles.impactLabel}>Time Invested</div>
              <div className={styles.impactSubtext}>
                {Math.floor(mockData.totalTime / 60)} hours of pure dedication
              </div>
            </div>
          </div>

          <div className={styles.impactHighlight}>
            <span className={styles.highlightIcon}>🌟</span>
            <span className={styles.highlightText}>
              You're in the top {mockData.ranking.percentile}% of{" "}
              {mockData.ranking.totalUsers.toLocaleString()} runners!
            </span>
          </div>
        </div>

        {/* Current Momentum */}
        <div className={styles.momentumCard}>
          <h2 className={styles.cardTitle}>Current Momentum</h2>

          <div className={styles.momentumContent}>
            <div className={styles.streakDisplay}>
              <div className={styles.streakIcon}>🔥</div>
              <div className={styles.streakInfo}>
                <div className={styles.streakNumber}>
                  {mockData.currentStreak}
                </div>
                <div className={styles.streakLabel}>Day Streak</div>
                {mockData.currentStreak === mockData.longestStreak && (
                  <div className={styles.streakBadge}>Personal Best!</div>
                )}
              </div>
            </div>

            <div className={styles.weeklyProgress}>
              <div className={styles.progressHeader}>
                <span>This Week</span>
                <span className={styles.improvement}>
                  +{mockData.weeklyProgress.improvement}%
                </span>
              </div>
              <div className={styles.progressStats}>
                <span>{mockData.weeklyProgress.runs} runs</span>
                <span>•</span>
                <span>{mockData.weeklyProgress.distance}km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Records */}
        <div className={styles.achievementsCard}>
          <h2 className={styles.cardTitle}>Achievements Unlocked</h2>

          <div className={styles.achievementsList}>
            {mockData.achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className={styles.achievement}>
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <div className={styles.achievementInfo}>
                  <div className={styles.achievementTitle}>
                    {achievement.title}
                  </div>
                  <div className={styles.achievementDesc}>
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.personalBests}>
            <h3 className={styles.recordsTitle}>Personal Records</h3>
            <div className={styles.recordsList}>
              <div className={styles.record}>
                <span className={styles.recordLabel}>Longest Run</span>
                <span className={styles.recordValue}>
                  {mockData.personalBests.distance}km
                </span>
              </div>
              <div className={styles.record}>
                <span className={styles.recordLabel}>Best Pace</span>
                <span className={styles.recordValue}>
                  {mockData.personalBests.pace}/km
                </span>
              </div>
              <div className={styles.record}>
                <span className={styles.recordLabel}>Longest Session</span>
                <span className={styles.recordValue}>
                  {formatTime(mockData.personalBests.time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
          <div className={styles.shareModal}>
            <div className={styles.shareModalContent}>
              <div className={styles.shareModalHeader}>
                <h3>Share Your Running Story</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setShareModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.sharePreview}>
                <pre className={styles.shareText}>{generateShareText()}</pre>
              </div>

              <div className={styles.shareActions}>
                <button
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(generateShareText());
                    setShareModalOpen(false);
                  }}
                >
                  Copy Text
                </button>
                <button
                  className={styles.shareToFarcasterButton}
                  onClick={() => {
                    const text = encodeURIComponent(generateShareText());
                    window.open(
                      `https://warpcast.com/~/compose?text=${text}`,
                      "_blank"
                    );
                  }}
                >
                  Share to Farcaster
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProgressPage;
