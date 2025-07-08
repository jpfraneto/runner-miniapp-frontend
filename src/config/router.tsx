// Dependencies
import { createBrowserRouter } from "react-router-dom";

// Pages
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import WelcomePage from "../pages/WelcomePage";
import ProfilePage from "../pages/ProfilePage";
import RunDetailPage from "../pages/RunDetailPage";

// Providers
import { AppProvider } from "../shared/providers/AppProvider";

import RankingPage from "@/pages/RankingPage";
import LoginPage from "@/pages/LoginPage";
import MiniAppPage from "@/pages/MiniAppPage";
import CommunityPage from "@/pages/CommunityPage";
import ProgressPage from "@/pages/ProgressPage";
import CoachPage from "@/pages/CoachPage";
import WorkoutPage from "@/pages/WorkoutPage";

/**
 * Router configuration for Farcaster miniapp.
 *
 * Note: LoginPage has been removed since authentication is handled
 * automatically through Farcaster's QuickAuth system. Users are
 * implicitly authenticated when accessing the miniapp.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppProvider />,
    children: [
      {
        path: "/",
        element: <MiniAppPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        children: [
          { path: "", element: <ProfilePage /> },
          { path: "podium", element: <ProfilePage /> },
        ],
      },
      { path: "/welcome", element: <WelcomePage /> },
      { path: "/ranking", element: <RankingPage /> },
      { path: "/runs/:runId", element: <RunDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/progress", element: <ProgressPage /> },
      { path: "/coach", element: <CoachPage /> },
      { path: "/workout", element: <WorkoutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
