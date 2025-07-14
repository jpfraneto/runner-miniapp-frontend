// Dependencies
import React, { useState, useEffect, useContext } from "react";
import { useProgressAnalytics } from "./hooks/useProgressAnalytics";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import PersonalOverview from "./components/PersonalOverview";
import TrendAnalysis from "./components/TrendAnalysis";
import CommunityContext from "./components/CommunityContext";
import PersonalRecords from "./components/PersonalRecords";
import InsightsFeed from "./components/InsightsFeed";
import NewUserExperience from "./components/NewUserExperience";

// StyleSheet
import styles from "./ProgressPage.module.scss";
import { useAuth } from "@/shared/hooks/auth";
import { AuthContext } from "@/shared/providers/AppProvider";

// Mock FID for development - replace with actual Farcaster user ID

const ProgressPage: React.FC = () => {
  const { miniappContext } = useContext(AuthContext);
  const { data: user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "trends" | "community" | "records" | "insights"
  >("overview");

  // Get user FID from miniapp context or user data
  const userFid = miniappContext?.user?.fid || user?.fid;

  // Show loading state while authentication is in progress
  if (authLoading || !userFid) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Progress</h1>
            <p className={styles.subtitle}>Loading your data...</p>
          </div>
          <div className={styles.loadingState}>
            <p>Please wait while we load your progress data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Check if user has runs to determine experience level
  const { data: analytics, isLoading } = useProgressAnalytics(userFid);
  const isNewUser =
    !isLoading &&
    (!analytics?.success || analytics.data.personalStats.totalRuns < 3);

  // Show new user experience for users with less than 3 runs
  if (isNewUser) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Your Progress</h1>
            <p className={styles.subtitle}>Start your running journey</p>
          </div>
          <NewUserExperience fid={userFid} />
        </div>
      </AppLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <PersonalOverview fid={userFid} />;
      case "trends":
        return <TrendAnalysis fid={userFid} />;
      case "community":
        return <CommunityContext fid={userFid} />;
      case "records":
        return <PersonalRecords fid={userFid} />;
      case "insights":
        return <InsightsFeed fid={userFid} />;
      default:
        return <PersonalOverview fid={userFid} />;
    }
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Your Progress</h1>
          <p className={styles.subtitle}>Track your running journey</p>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "overview" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "trends" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("trends")}
            >
              Trends
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "community" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("community")}
            >
              Community
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "records" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("records")}
            >
              Records
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "insights" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("insights")}
            >
              Insights
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className={styles.content}>{renderTabContent()}</div>
      </div>
    </AppLayout>
  );
};

export default ProgressPage;
