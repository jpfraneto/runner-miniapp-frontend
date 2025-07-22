import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../shared/layouts/AppLayout";
import WorkoutsFeed from "@/shared/components/WorkoutsFeed";
import withProtectionRoute from "@/hocs/withProtectionRoute";
import { AuthContext } from "@/shared/providers/AppProvider";
import styles from "./HomePage.module.scss";

function HomePage(): React.ReactNode {
  const navigate = useNavigate();
  const { miniappContext } = useContext(AuthContext);
  const [units, setUnits] = useState<"km" | "mi">("km");

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

  const toggleUnits = () => {
    setUnits(units === "km" ? "mi" : "km");
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.unitsToggle} onClick={toggleUnits}>
            {units}
          </button>

          {miniappContext?.user && (
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
          )}
        </div>

        <div className={styles.feedContainer}>
          <WorkoutsFeed type="recent" units={units} />
        </div>
      </div>
    </AppLayout>
  );
}

export default withProtectionRoute(HomePage, "only-connected");
