import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import UnitToggle from "@/shared/components/UnitToggle";
import withProtectionRoute from "@/hocs/withProtectionRoute";
import { AuthContext } from "@/shared/providers/AppProvider";
import styles from "./HomePage.module.scss";
import { ImInfo } from "react-icons/im";
import sdk from "@farcaster/frame-sdk";

function HomePage(): React.ReactNode {
  const navigate = useNavigate();
  const { miniappContext } = useContext(AuthContext);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // Auto-refresh workouts every 60 seconds
    const workoutsInterval = setInterval(() => {
      window.dispatchEvent(new CustomEvent("refreshWorkouts"));
    }, 60000);

    return () => {
      clearInterval(workoutsInterval);
    };
  }, []);

  const handleProfileClick = () => {
    if (miniappContext?.user?.fid) {
      navigate(`/user/${miniappContext.user.fid}`);
    }
  };

  const handleDisplayInfo = () => {
    setShowInfoModal(true);
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <UnitToggle />

          {miniappContext?.user && (
            <div className={styles.profileButtons}>
              <button
                className={styles.profileButton}
                onClick={handleProfileClick}
              >
                <img
                  src={miniappContext.user.pfpUrl}
                  alt={miniappContext.user.username}
                  className={styles.profileImage}
                />
              </button>
              <button
                className={styles.profileButton}
                onClick={handleDisplayInfo}
                title="Rewards Info"
              >
                <ImInfo />
              </button>
            </div>
          )}
        </div>

        <div className={styles.feedContainer}>
          <WorkoutsFeed type="recent" />
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowInfoModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                🏆 Weekly{" "}
                <span
                  onClick={() => {
                    sdk.actions.swapToken({
                      sellToken: "eip155:10/native",
                      /**
                       * CAIP-19 token ID. For example, OP ETH:
                       * eip155:10/native
                       */
                      buyToken:
                        "eip155:8453/erc20:0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a",
                      /**
                       * Sell token amount, as numeric string.
                       * For example, 1 USDC: 1000000
                       */
                      sellAmount: "10000000",
                    });
                  }}
                >
                  $runner
                </span>{" "}
                Rewards
              </h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowInfoModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.rewardInfo}>
                <div className={styles.rewardIcon}>💰</div>
                <h3>Top 8 Runners Get Rewarded</h3>
                <p>
                  Every week, the top 8 runners (by distance logged through the
                  miniapp or on the /running channel) will each receive{" "}
                  <strong>
                    12.5% of the $runner part of the trading fees of this
                    memecoin
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
