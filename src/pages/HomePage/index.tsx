// Dependencies
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./HomePage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

// Partial components (to be created)
import WeeklyPlan from "./partials/WeeklyPlan";
import RunLogs from "./partials/RunLogs";
import Progress from "./partials/Progress";
import HomePageRunner from "./partials/HomePageRunner";

function HomePage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePageRunner />} />
            <Route path="/plan" element={<WeeklyPlan />} />
            <Route path="/logs" element={<RunLogs />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
          </Routes>
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
