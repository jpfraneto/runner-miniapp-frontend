// src/shared/layouts/AppLayout/index.tsx

import React from "react";
import { useLocation } from "react-router-dom";

// Components
// import NavigationBar from "@/components/NavigationBar";
import RunnerNavigationBar from "@/shared/components/NavigationBar/RunnerNavigationBar";

// StyleSheet
import styles from "./AppLayout.module.scss";

// Hooks
// import { useAuth } from "@/hooks/auth";

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // const { data: user } = useAuth();
  const location = useLocation();
  const isMiniApp = location.pathname.startsWith("/miniapp");

  return (
    <div className={styles.layout}>
      <div className={styles.content}>{children}</div>

      {isMiniApp && (
        <div className={styles.bar}>
          <RunnerNavigationBar />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
