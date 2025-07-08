// Dependencies
import React, { useState, useEffect } from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";

// StyleSheet
import styles from "./CommunityPage.module.scss";

import { getAllWorkouts } from "@/services/user";

// Types
interface WorkoutSession {
  castHash: string;
  timestamp: string;
  text: string;
  author: {
    fid: number;
    username: string;
    pfp_url: string;
  };
  workoutData: {
    isWorkoutImage: boolean;
    distance?: number;
    duration?: number;
    units?: string;
    pace?: string;
    calories?: number;
    elevationGain?: number;
    avgCadence?: number;
    confidence?: number;
    extractedText?: string[];
  };
  reactions: {
    likes_count: number;
    recasts_count: number;
  };
  replies: {
    count: number;
  };
}

interface WorkoutSessionsData {
  processedSessions: WorkoutSession[];
}

interface GroupedWorkouts {
  [date: string]: WorkoutSession[];
}

const CommunityPage: React.FC = () => {
  const [_workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [groupedWorkouts, setGroupedWorkouts] = useState<GroupedWorkouts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllWorkouts()
      .then((res) => {
        console.log("THE RESPONSE HERE IS >>>>>>>>", res);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const loadWorkoutSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/all_workout_sessions.json");
        if (!response.ok) {
          throw new Error("Failed to load workout sessions");
        }

        const data: WorkoutSessionsData = await response.json();

        // Filter sessions where isWorkoutImage is true
        const validWorkouts = data.processedSessions.filter(
          (session) => session.workoutData.isWorkoutImage
        );

        setWorkoutSessions(validWorkouts);

        // Group workouts by date
        const grouped = validWorkouts.reduce((acc, workout) => {
          const date = new Date(workout.timestamp).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(workout);
          return acc;
        }, {} as GroupedWorkouts);

        setGroupedWorkouts(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutSessions();
  }, []);

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = Math.floor(duration % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const workoutTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - workoutTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <Typography
              variant="gta"
              weight="wide"
              size={24}
              lineHeight={20}
              className={styles.title}
            >
              COMMUNITY
            </Typography>
            <Typography
              variant="geist"
              weight="regular"
              size={14}
              lineHeight={18}
              className={styles.subtitle}
            >
              Recent runs from the community
            </Typography>
          </div>
          <div className={styles.loadingSection}>
            <Typography
              variant="geist"
              size={16}
              className={styles.loadingText}
            >
              Loading community runs...
            </Typography>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <Typography
              variant="gta"
              weight="wide"
              size={24}
              lineHeight={20}
              className={styles.title}
            >
              COMMUNITY
            </Typography>
            <Typography
              variant="geist"
              weight="regular"
              size={14}
              lineHeight={18}
              className={styles.subtitle}
            >
              Recent runs from the community
            </Typography>
          </div>
          <div className={styles.errorSection}>
            <Typography variant="geist" size={16} className={styles.errorText}>
              {error}
            </Typography>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Typography
            variant="gta"
            weight="wide"
            size={24}
            lineHeight={20}
            className={styles.title}
          >
            COMMUNITY
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={14}
            lineHeight={18}
            className={styles.subtitle}
          >
            Recent runs from the community
          </Typography>
        </div>

        {/* Workout Sessions */}
        <div className={styles.sessionsContainer}>
          {Object.entries(groupedWorkouts).map(([date, workouts]) => (
            <div key={date} className={styles.dateGroup}>
              <Typography
                variant="geist"
                weight="medium"
                size={14}
                className={styles.dateHeader}
              >
                {date}
              </Typography>
              {workouts.map((workout) => (
                <div key={workout.castHash} className={styles.workoutCard}>
                  <div className={styles.workoutHeader}>
                    <div className={styles.userInfo}>
                      <img
                        src={workout.author.pfp_url}
                        alt={workout.author.username}
                        className={styles.userAvatar}
                      />
                      <div className={styles.userDetails}>
                        <Typography
                          variant="geist"
                          weight="medium"
                          size={14}
                          className={styles.username}
                        >
                          {workout.author.username}
                        </Typography>
                        <Typography
                          variant="geist"
                          weight="regular"
                          size={12}
                          className={styles.timestamp}
                        >
                          {formatTimeAgo(workout.timestamp)}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className={styles.workoutContent}>
                    {workout.text && (
                      <Typography
                        variant="geist"
                        weight="regular"
                        size={14}
                        className={styles.workoutText}
                      >
                        {workout.text}
                      </Typography>
                    )}

                    <div className={styles.workoutStats}>
                      {workout.workoutData.distance && (
                        <div className={styles.stat}>
                          <Typography size={12} className={styles.statLabel}>
                            Distance
                          </Typography>
                          <Typography
                            size={16}
                            weight="medium"
                            className={styles.statValue}
                          >
                            {workout.workoutData.distance}
                            {workout.workoutData.units || "km"}
                          </Typography>
                        </div>
                      )}

                      {workout.workoutData.duration && (
                        <div className={styles.stat}>
                          <Typography size={12} className={styles.statLabel}>
                            Duration
                          </Typography>
                          <Typography
                            size={16}
                            weight="medium"
                            className={styles.statValue}
                          >
                            {formatDuration(workout.workoutData.duration)}
                          </Typography>
                        </div>
                      )}

                      {workout.workoutData.pace && (
                        <div className={styles.stat}>
                          <Typography size={12} className={styles.statLabel}>
                            Pace
                          </Typography>
                          <Typography
                            size={16}
                            weight="medium"
                            className={styles.statValue}
                          >
                            {workout.workoutData.pace}
                          </Typography>
                        </div>
                      )}
                    </div>

                    <div className={styles.workoutReactions}>
                      <div className={styles.reaction}>
                        <span className={styles.reactionIcon}>❤️</span>
                        <Typography size={12} className={styles.reactionCount}>
                          {workout.reactions.likes_count}
                        </Typography>
                      </div>
                      <div className={styles.reaction}>
                        <span className={styles.reactionIcon}>🔄</span>
                        <Typography size={12} className={styles.reactionCount}>
                          {workout.reactions.recasts_count}
                        </Typography>
                      </div>
                      <div className={styles.reaction}>
                        <span className={styles.reactionIcon}>💬</span>
                        <Typography size={12} className={styles.reactionCount}>
                          {workout.replies.count}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityPage;
