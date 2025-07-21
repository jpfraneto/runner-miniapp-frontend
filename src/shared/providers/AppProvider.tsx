// Dependencies
import { Outlet } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

// Providers
import { BottomSheetProvider } from "./BottomSheetProvider";
import { ModalProvider } from "./ModalProvider";
import { ProcessingRunsProvider } from "./ProcessingRunsProvider";

// Farcaster Miniapp Init
import sdk, { type Context } from "@farcaster/frame-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Services
import { setFarcasterToken } from "../utils/auth";

// Hooks
import {
  useTodaysMission,
  type TodaysMissionData,
} from "@/shared/hooks/user/useTodaysMission";

// Types
import { RunningSession } from "@/shared/types/running";

export const AuthContext = createContext<{
  token: string | undefined;
  signIn: () => Promise<void>;
  signOut: () => void;
  miniappContext: Context.FrameContext | null;
  isInitialized: boolean;
  todaysMission: TodaysMissionData | null;
  refreshMission: () => void;
  updateMissionAfterCompletion: (runningSession: RunningSession) => void;
}>({
  token: undefined,
  signIn: async () => {},
  signOut: () => {},
  miniappContext: null,
  isInitialized: false,
  todaysMission: null,
  refreshMission: () => {},
  updateMissionAfterCompletion: () => {},
});

const queryClient = new QueryClient();

/**
 * AppProvider component that manages Farcaster miniapp authentication and context.
 *
 * This provider handles the complete authentication flow for Farcaster miniapps:
 * 1. Initializes the Farcaster SDK and obtains QuickAuth token
 * 2. Loads miniapp context (user data, etc.)
 * 3. Automatically authenticates with backend via /me endpoint
 * 4. Prompts user to add miniapp if they haven't already
 * 5. Manages authentication state throughout the app lifecycle
 *
 * The provider eliminates the need for explicit login flows since Farcaster
 * miniapps have implicit authentication through the platform.
 */
export function AppProvider(): JSX.Element {
  const [token, setToken] = useState<string>();
  const [miniappContext, setMiniappContext] =
    useState<Context.FrameContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mission data management
  const { todaysMission, refreshMission, updateMissionAfterCompletion } =
    useTodaysMission();

  useEffect(() => {
    async function initMiniapp() {
      if (isInitialized) return;

      try {
        console.log("Initializing Farcaster miniapp...");

        // Obtain QuickAuth token from Farcaster
        const { token: newToken } = await sdk.quickAuth.getToken();
        console.log("THE NEW TOKEN IS", newToken);
        setToken(newToken);
        setFarcasterToken(newToken);
        console.log("QuickAuth token obtained");

        // Signal that miniapp is ready
        await sdk.actions.ready();

        // Load miniapp context (user profile, etc.)
        const context = await sdk.context;
        console.log("Miniapp context loaded:", context.user.username);
        setMiniappContext(context);

        // Backend authentication happens automatically when useAuth calls /me
        // The /me endpoint will create/update user and return profile data
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize miniapp:", error);
        setIsInitialized(false);
      }
    }

    initMiniapp();
  }, [isInitialized]);

  const signIn = async () => {
    try {
      // Get new QuickAuth token
      const { token: newToken } = await sdk.quickAuth.getToken();
      setToken(newToken);
      setFarcasterToken(newToken);

      // Refresh context
      const context = await sdk.context;
      setMiniappContext(context);

      // Clear and refetch auth data - /me will handle user creation/update
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const signOut = () => {
    setToken(undefined);
    setMiniappContext(null);
    setIsInitialized(false);
    // Clear all cached data
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          token,
          signIn,
          signOut,
          miniappContext,
          isInitialized,
          todaysMission,
          refreshMission,
          updateMissionAfterCompletion,
        }}
      >
        <BottomSheetProvider>
          <ModalProvider>
            <ProcessingRunsProvider>
              <Outlet />
            </ProcessingRunsProvider>
          </ModalProvider>
        </BottomSheetProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
