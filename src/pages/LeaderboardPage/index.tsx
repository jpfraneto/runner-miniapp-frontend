import React from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import WeeklyLeaderboard from "@/shared/components/WeeklyLeaderboard";
import { getCurrentWeekNumber } from "@/shared/utils/weekCalculation";
import styles from "./LeaderboardPage.module.scss";

const LeaderboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const weekParam = searchParams.get('week');
  const yearParam = searchParams.get('year');
  
  const currentWeek = getCurrentWeekNumber();
  const weekNumber = weekParam ? parseInt(weekParam) : currentWeek;
  const year = yearParam ? parseInt(yearParam) : 2024;

  return (
    <AppLayout>
      <div className={styles.container}>
        <WeeklyLeaderboard 
          weekNumber={weekNumber}
          year={year}
          showHistoricalNavigation={true}
        />
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;