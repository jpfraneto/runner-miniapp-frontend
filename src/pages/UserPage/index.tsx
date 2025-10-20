import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import UnitToggle from "@/shared/components/UnitToggle";
import BackButton from "@/shared/components/BackButton";
import { useSmartNavigation } from "@/shared/hooks/navigation/useSmartNavigation";
import { useUnits } from "@/shared/providers/UnitsProvider";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { useAdmin } from "@/shared/hooks/admin/useAdmin";
import { FaCog, FaShare } from "react-icons/fa";
import ConfirmModal from "@/shared/components/ConfirmModal";
import styles from "./UserPage.module.scss";
import LoaderIndicator from "@/shared/components/LoaderIndicator";
import sdk from "@farcaster/frame-sdk";
import { API_URL } from "@/config/api";

const UserPage: React.FC = () => {
  const { fid } = useParams<{ fid: string }>();
  const [searchParams] = useSearchParams();
  const { goBack } = useSmartNavigation();
  const { formatDistance, convertPace } = useUnits();
  const { miniappContext } = useAuth();
  const { isAdmin, processCastHash, banUserByFid, isProcessing, isBanningUser, error, clearError } = useAdmin();
  const targetRunRef = useRef<HTMLDivElement | null>(null);
  const [showRunner, setShowRunner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  // Check if the current user is admin (FID 16098) and viewing their own profile
  const isAdminViewingOwnProfile =
    miniappContext?.user.fid === 16098 && fid === "16098";
  useEffect(() => {
    console.log("Query params:", Object.fromEntries(searchParams.entries()));

    const castHash = searchParams.get("castHash");
    const weekNumber = searchParams.get("weekNumber");

    if (castHash) {
      setIsLoading(true);
      setTimeout(() => {
        setShowRunner(true);
        console.log("Target run ref:", targetRunRef.current);
        setTimeout(() => {
          if (targetRunRef.current) {
            targetRunRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          setTimeout(() => {
            setShowRunner(false);
            setIsLoading(false);
          }, 2000);
        }, 500);
      }, 1000);
    } else if (weekNumber) {
      setIsLoading(true);
      setTimeout(() => {
        setShowRunner(true);
        setTimeout(() => {
          const weekSeparator = document.querySelector(
            `[data-week="${weekNumber}"]`
          );
          if (weekSeparator) {
            weekSeparator.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          setTimeout(() => {
            setShowRunner(false);
            setIsLoading(false);
          }, 2000);
        }, 500);
      }, 1000);
    }
  }, [searchParams, targetRunRef]);

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<{
    username: string;
    pfpUrl: string;
    totalMeters: number;
    totalRuns: number;
  } | null>(null);

  const handleWorkoutsDataFetched = (workoutsData: any[]) => {
    setWorkouts(workoutsData);

    if (workoutsData.length > 0) {
      const firstWorkout = workoutsData[0];
      const totalMeters = workoutsData.reduce(
        (sum, workout) => sum + workout.distanceMeters,
        0
      );
      const totalRuns = workoutsData.length;

      setUserStats({
        username: firstWorkout.user.username,
        pfpUrl: firstWorkout.user.pfpUrl,
        totalMeters,
        totalRuns,
      });
    }
  };

  // Calculate average pace reactively based on current units
  const calculateAveragePace = () => {
    if (!workouts.length) return "--";

    // Filter out runs with 0 time (invalid/incomplete runs)
    const validWorkouts = workouts.filter((workout) => workout.duration > 0);

    if (!validWorkouts.length) return "--";

    const totalMeters = validWorkouts.reduce(
      (sum, workout) => sum + workout.distanceMeters,
      0
    );
    const totalMinutes = validWorkouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );

    return convertPace(totalMeters, totalMinutes);
  };

  const handleAdminButtonClick = () => {
    clearError();
    setShowAdminModal(true);
  };

  const [castHashInput, setCastHashInput] = useState("");

  const handleCastProcess = async () => {
    if (!castHashInput.trim()) {
      return;
    }
    console.log("Cast hash input:", castHashInput.trim());
    const success = await processCastHash(castHashInput.trim());
    if (success) {
      setShowAdminModal(false);
      setCastHashInput("");
    }
  };

  const handleBanUser = async () => {
    if (!fid || !userStats) return;
    
    const success = await banUserByFid(parseInt(fid));
    if (success) {
      setShowBanModal(false);
      // Refresh the workouts to reflect the ban
      window.dispatchEvent(new CustomEvent("refreshWorkouts"));
    }
  };

  const handleShareProfile = () => {
    if (!fid || !userStats) return;

    const shareText = `Check out @${
      userStats.username
    }'s $runner profile! 🏃‍♂️\n\n📊 ${formatDistance(
      userStats.totalMeters
    )} total distance ran\n🏁 ${
      userStats.totalRuns
    } total runs\n⚡ ${calculateAveragePace()} avg pace`;
    const shareEmbed = `${API_URL}/embeds/user/${fid}`;

    sdk.actions.composeCast({
      text: shareText,
      embeds: [shareEmbed],
    });
  };

  if (!fid) {
    return (
      <AppLayout>
        <div className={styles.container}>
          <div className={styles.error}>User not found</div>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <LoaderIndicator />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <BackButton onClick={goBack} />
          <div className={styles.headerButtons}>
            <UnitToggle />
            {isAdminViewingOwnProfile && (
              <button
                className={styles.adminButton}
                onClick={handleAdminButtonClick}
                title="Admin Panel"
              >
                <FaCog />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showRunner && (
            <motion.div
              initial={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%) rotate(90deg)",
                zIndex: 1000,
              }}
              animate={{
                top: targetRunRef.current
                  ? `${targetRunRef.current.offsetTop + window.scrollY}px`
                  : "50vh",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className={styles.travelingRunner}
            >
              <img
                src="/runner.gif"
                alt="Traveling through time..."
                className={styles.travelingRunnerGif}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {userStats && (
          <div className={styles.profileHeader}>
            <div
              onClick={() => {
                sdk.actions.viewProfile({ fid: parseInt(fid) });
              }}
              className={styles.profileContent}
            >
              <img
                src={userStats.pfpUrl}
                alt={userStats.username}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <h1 className={styles.username}>{userStats.username}</h1>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {formatDistance(userStats.totalMeters)}
                    </span>
                    <span className={styles.statLabel}>total distance</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {userStats.totalRuns}
                    </span>
                    <span className={styles.statLabel}>total runs</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {calculateAveragePace()}
                    </span>
                    <span className={styles.statLabel}>avg pace</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.profileActions}>
              <button
                onClick={handleShareProfile}
                className={styles.shareButton}
                title="Share profile"
              >
                <FaShare />
              </button>
              {isAdmin && userStats && fid !== miniappContext?.user.fid?.toString() && (
                <button
                  onClick={() => setShowBanModal(true)}
                  className={styles.banButton}
                  title="Ban user"
                >
                  BAN
                </button>
              )}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <WorkoutsFeed
            type="user"
            userId={parseInt(fid)}
            limit={100}
            onDataFetched={handleWorkoutsDataFetched}
            highlightCastHash={searchParams.get("castHash") || undefined}
            onHighlightedItemRef={(ref) => {
              targetRunRef.current = ref;
            }}
          />
        </div>
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAdminModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>🔧 Admin Panel</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowAdminModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.adminInfo}>
                <div className={styles.warningIcon}>📋</div>
                <h3>Process Cast Hash</h3>
                <p>
                  Paste a cast hash below and it will be sent to the training
                  service for processing.
                </p>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={castHashInput}
                    onChange={(e) => setCastHashInput(e.target.value)}
                    placeholder="0x..."
                    className={styles.castHashInput}
                    disabled={isProcessing}
                  />
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button
                  className={styles.resetButton}
                  onClick={handleCastProcess}
                  disabled={isProcessing || !castHashInput.trim()}
                >
                  {isProcessing ? "Processing..." : "Process Cast Hash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanUser}
        title="Ban User"
        message={`Are you sure you want to ban @${userStats?.username}? This will delete all their runs and prevent them from participating.`}
        confirmText="Ban User"
        cancelText="Cancel"
        isLoading={isBanningUser}
        variant="danger"
      />
    </AppLayout>
  );
};

export default UserPage;
