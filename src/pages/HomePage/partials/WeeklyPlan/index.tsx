// Dependencies
import React from "react";

// StyleSheet
import styles from "./WeeklyPlan.module.scss";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

interface WeeklyPlanProps {}

const WeeklyPlan: React.FC<WeeklyPlanProps> = () => {
  const weeklyPlan = {
    week: 4,
    totalWeeks: 10,
    goal: "Half Marathon",
    sessions: [
      {
        id: 1,
        day: "Monday",
        type: "Interval",
        description: "8x400m intervals with 2min rest",
        duration: "45 min",
        completed: false,
      },
      {
        id: 2,
        day: "Wednesday",
        type: "Distance",
        description: "Easy 5km run",
        duration: "30 min",
        completed: true,
      },
      {
        id: 3,
        day: "Saturday",
        type: "Long Run",
        description: "12km at conversational pace",
        duration: "75 min",
        completed: false,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="druk" weight="wide" size={24} lineHeight={28}>
          Week {weeklyPlan.week} of {weeklyPlan.totalWeeks}
        </Typography>
        <Typography variant="geist" weight="regular" size={16} lineHeight={20}>
          Training for: {weeklyPlan.goal}
        </Typography>
      </div>

      <div className={styles.coachMessage}>
        <Typography variant="geist" weight="medium" size={14} lineHeight={18}>
          💪 Coach's Note: "You're crushing it! Week 4 is where the magic
          happens. Keep that momentum going and you'll be ready for race day."
        </Typography>
      </div>

      <div className={styles.sessions}>
        {weeklyPlan.sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.session} ${
              session.completed ? styles.completed : ""
            }`}
          >
            <div className={styles.sessionHeader}>
              <Typography
                variant="druk"
                weight="wide"
                size={16}
                lineHeight={20}
              >
                {session.day}
              </Typography>
              <div className={styles.sessionType}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={12}
                  lineHeight={16}
                >
                  {session.type}
                </Typography>
              </div>
            </div>

            <div className={styles.sessionDetails}>
              <Typography
                variant="geist"
                weight="regular"
                size={14}
                lineHeight={18}
              >
                {session.description}
              </Typography>
              <Typography
                variant="geist"
                weight="medium"
                size={12}
                lineHeight={16}
              >
                {session.duration}
              </Typography>
            </div>

            {!session.completed && (
              <Button
                variant="primary"
                caption="Mark Complete"
                onClick={() =>
                  console.log(`Mark session ${session.id} complete`)
                }
                className={styles.completeButton}
              />
            )}

            {session.completed && (
              <div className={styles.completedBadge}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={12}
                  lineHeight={16}
                >
                  ✅ Completed
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          variant="outline"
          caption="Share Progress"
          onClick={() => console.log("Share progress clicked")}
          className={styles.shareButton}
        />
      </div>
    </div>
  );
};

export default WeeklyPlan;
