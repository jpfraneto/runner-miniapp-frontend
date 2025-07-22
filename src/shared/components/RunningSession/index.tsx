import React, { useState } from "react";
import { RunningSession as RunningSessionType } from "@/shared/types/running";
import styles from "./RunningSession.module.scss";
import sdk from "@farcaster/frame-sdk";
import { useNavigate } from "react-router-dom";

// Components
import ShareRunView from "@/shared/components/ShareRunView";
import ShareSuccessView from "@/shared/components/ShareSuccessView";

// Types
import { RunShareVerificationResponse } from "@/services/user";

interface RunningSessionProps {
  workout: RunningSessionType;
}

type ViewState = 'list' | 'share' | 'shareSuccess';

const RunningSession: React.FC<RunningSessionProps> = ({ workout }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [shareVerificationResult, setShareVerificationResult] = useState<RunShareVerificationResponse | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleCardClick = () => {
    navigate(`/runs/${workout.castHash}`);
  };

  const handleViewCast = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      sdk.actions.viewCast({ hash: workout.castHash });
    } catch (error) {
      console.error("View cast failed:", error);
    }
  };

  const handleShareRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('share');
  };

  const handleSkipShare = () => {
    setCurrentView('list');
  };

  const handleShareSuccess = (result: RunShareVerificationResponse) => {
    setShareVerificationResult(result);
    setCurrentView('shareSuccess');
  };

  const handleShareSuccessComplete = () => {
    setCurrentView('list');
  };

  // Handle different view states
  if (currentView === 'share') {
    return (
      <ShareRunView
        runData={workout}
        onSkip={handleSkipShare}
        onSuccess={handleShareSuccess}
      />
    );
  }

  if (currentView === 'shareSuccess' && shareVerificationResult) {
    return (
      <ShareSuccessView
        verificationResult={shareVerificationResult}
        onContinue={handleShareSuccessComplete}
      />
    );
  }

  return (
    <div className={styles.sessionCard} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src={workout.user.pfpUrl}
            alt={workout.user.username}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <div className={styles.username}>@{workout.user.username}</div>
            <div className={styles.date}>
              {formatDate((workout as any).completedDate || workout.createdAt || new Date().toISOString())}
            </div>
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button
            className={styles.shareButton}
            onClick={handleShareRun}
            title="Share run"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
          
          <button
            className={styles.castButton}
            onClick={handleViewCast}
            title="View cast"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.mainStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{((workout as any).distance || workout.distanceMeters / 1000).toFixed(1)}</div>
          <div className={styles.statLabel}>km</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formatDuration(workout.duration)}</div>
          <div className={styles.statLabel}>time</div>
        </div>
      </div>
    </div>
  );
};

export default RunningSession;