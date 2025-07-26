import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useSmartNavigation = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    console.log("Going back", window.history.length);
    // Check if there's history to go back to
    navigate("/");
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const goToLeaderboard = useCallback(() => {
    navigate("/leaderboard");
  }, [navigate]);

  return {
    goBack,
    goHome,
    goToLeaderboard,
    navigate,
  };
};
