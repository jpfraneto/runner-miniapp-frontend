// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// StyleSheet
import styles from "./HomePage.module.scss";

// Components
import AppLayout from "../../shared/layouts/AppLayout";
import TabNavigator from "@/components/TabNavigator";
import Typography from "@/shared/components/Typography";

// Hocs
import withProtectionRoute from "@/hocs/withProtectionRoute";

// Partial components (to be created)
import WeeklyPlan from "./partials/WeeklyPlan";
import RunLogs from "./partials/RunLogs";
import Progress from "./partials/Progress";
import sdk from "@farcaster/frame-sdk";
import LogTodaysRunButton from "@/shared/components/LogTodaysRunButton";

function HomePage(): React.ReactNode {
  return (
    <AppLayout>
      <div className={styles.body}>
        <div className={styles.header}>
          <div
            onClick={() => {
              sdk.actions.swapToken({
                sellToken: "eip155:10/native",
                /**
                 * CAIP-19 token ID. For example, OP ETH:
                 * eip155:10/native
                 */
                buyToken:
                  "eip8453:10/erc20:0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a",
                /**
                 * Sell token amount, as numeric string.
                 * For example, 1 USDC: 1000000
                 */
                sellAmount: "10000000",
              });
            }}
            className={styles.titleSection}
          >
            <Typography
              variant="gta"
              weight="wide"
              size={44}
              lineHeight={36}
              className={styles.mainTitle}
            >
              $RUNNER
            </Typography>
            <Typography
              variant="geist"
              weight="regular"
              size={14}
              lineHeight={18}
              className={styles.subtitle}
            >
              Your AI Coach & Training Companion
            </Typography>
          </div>

          <div className={styles.tabs}>
            <TabNavigator
              tabs={[
                {
                  label: "Plan",
                  path: "/plan",
                },
                {
                  label: "Logs",
                  path: "/logs",
                },
                {
                  label: "Progress",
                  path: "/progress",
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/plan" element={<WeeklyPlan />} />
            <Route path="/logs" element={<RunLogs />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
          </Routes>
        </div>

        <LogTodaysRunButton />
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
