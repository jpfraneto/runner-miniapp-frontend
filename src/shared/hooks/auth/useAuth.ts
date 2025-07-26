// Dependencies
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Services
import { getMe } from "@/services/auth";

// Context
import { AuthContext } from "@/shared/providers/AppProvider";
import { useContext } from "react";

/**
 * Custom hook for authentication state management in Farcaster miniapps.
 *
 * This hook automatically handles user authentication by calling the /me endpoint
 * when a QuickAuth token is available. The endpoint handles:
 * - Token verification
 * - User creation for first-time users
 * - Profile updates and voting status
 *
 * For TBA clients, it provides a special authentication flow with a custom login screen.
 *
 * @returns Query object containing user data, loading state, error information, and TBA state
 */
export const useAuth = () => {
  const { token, miniappContext, isInitialized, signIn } =
    useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Add debug logging to track when hook is called and context state
  console.log("useAuth hook called with:", {
    hasToken: !!token,
    hasMiniappContext: !!miniappContext,
    isInitialized,
  });

  const TBA_FID = 309857;
  const isTBAClient = Number(miniappContext?.client.clientFid) === TBA_FID;

  const handleTBALogin = async () => {
    if (isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      await signIn();
    } catch (error) {
      console.error("TBA login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: getMe,
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // Only fetch when we have both token and context, and miniapp is initialized
    enabled: !!token && !!miniappContext && isInitialized,
  });

  return {
    ...authQuery,
    isTBAClient,
    isLoggingIn,
    handleTBALogin,
    miniappContext,
    showTBALogin: isTBAClient && !token && isInitialized,
  };
};
