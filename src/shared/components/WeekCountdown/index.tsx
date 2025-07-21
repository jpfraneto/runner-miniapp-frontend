import React, { useState, useEffect } from "react";
import { getTimeUntilReset, formatCountdown, getCurrentWeekNumber, formatWeekDisplay } from "@/shared/utils/weekCalculation";
import styles from "./WeekCountdown.module.scss";

const WeekCountdown: React.FC = () => {
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekNumber());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeUntilReset = getTimeUntilReset();
      const newCurrentWeek = getCurrentWeekNumber();
      
      setTimeUntilReset(newTimeUntilReset);
      
      // Check if week has changed
      if (newCurrentWeek !== currentWeek) {
        setCurrentWeek(newCurrentWeek);
        // You could trigger a refresh of leaderboard data here
        window.location.reload(); // Simple way to refresh everything
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWeek]);

  return (
    <div className={styles.container}>
      <div className={styles.weekInfo}>
        <h3>{formatWeekDisplay(currentWeek)}</h3>
        <p className={styles.subtitle}>Current competition week</p>
      </div>
      
      <div className={styles.countdown}>
        <div className={styles.countdownLabel}>Next reset in:</div>
        <div className={styles.countdownValue}>
          {formatCountdown(timeUntilReset)}
        </div>
        <div className={styles.resetInfo}>
          Every Friday at 3pm Chile time
        </div>
      </div>
    </div>
  );
};

export default WeekCountdown;