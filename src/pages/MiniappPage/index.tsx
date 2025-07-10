// Dependencies
import React from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import WorkoutFeed from "@/shared/components/WorkoutFeed";

// StyleSheet
import styles from "./MiniAppPage.module.scss";

const MiniAppPage: React.FC = () => {
  // const { todaysMission } = useContext(AuthContext);

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.homeContent}>
            <WorkoutFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MiniAppPage;
