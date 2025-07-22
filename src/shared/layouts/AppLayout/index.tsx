// src/shared/layouts/AppLayout/index.tsx

import React from "react";

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

  return (
    <div className={styles.layout}>
      {/* Sponsor Bar */}
      {/* <div
        className={styles.sponsorBar}
        onClick={() => {
          sdk.actions.swapToken({
            sellToken: "eip155:8453/native", // ETH
            buyToken:
              "eip8453:8453/erc20:0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a", // $RUNNER
            sellAmount: "69420000000000000", // 1 ETH (example)
          });
        }}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeText}>
            <span>
              this miniapp is sponsored by <b>$RUNNER</b>
            </span>
          </div>
        </div>
      </div> */}
      <div className={styles.content}>{children}</div>

      <div className={styles.bar}>
        <RunnerNavigationBar />
      </div>
    </div>
  );
};

export default AppLayout;
