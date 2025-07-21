// Dependencies
import { createBrowserRouter } from "react-router-dom";

// Pages
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import RunningSessionPage from "../pages/RunningSessionPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ActivityPage from "@/pages/ActivityPage";
import UserPage from "@/pages/UserPage";

// Providers
import { AppProvider } from "../shared/providers/AppProvider";

/*
 * Router configuration for simplified running app.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppProvider />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/runs/:castHash", element: <RunningSessionPage /> },
      { path: "/user/:fid", element: <UserPage /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
      { path: "/activity", element: <ActivityPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
