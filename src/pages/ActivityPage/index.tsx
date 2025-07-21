import React, { useState } from "react";
import AppLayout from "@/shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import styles from "./ActivityPage.module.scss";

const ActivityPage: React.FC = () => {
  const [filterType, setFilterType] = useState<"recent" | "currentWeek">("recent");

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Activity Feed</h1>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filterType === "recent" ? styles.active : ""}`}
              onClick={() => setFilterType("recent")}
            >
              All Time
            </button>
            <button
              className={`${styles.filterButton} ${filterType === "currentWeek" ? styles.active : ""}`}
              onClick={() => setFilterType("currentWeek")}
            >
              This Week
            </button>
          </div>
        </div>

        <WorkoutsFeed type={filterType} limit={100} />
      </div>
    </AppLayout>
  );
};

export default ActivityPage;