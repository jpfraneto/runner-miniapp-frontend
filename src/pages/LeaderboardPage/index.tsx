import React from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import WeeklyLeaderboard from "@/shared/components/WeeklyLeaderboard";
import { getCurrentWeekNumber } from "@/shared/utils/weekCalculation";
import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const weekParam = searchParams.get("week");

  const currentWeek = getCurrentWeekNumber();
  const weekNumber = weekParam ? parseInt(weekParam) : currentWeek;

  return (
    <AppLayout>
      <div className={styles.container}>
        <WeeklyLeaderboard
          weekNumber={weekNumber}
          showHistoricalNavigation={true}
        />
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
