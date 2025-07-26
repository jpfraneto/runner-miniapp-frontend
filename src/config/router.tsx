// Dependencies
import { createBrowserRouter } from "react-router-dom";

// Pages
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import RunningSessionPage from "../pages/RunningSessionPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import UserPage from "@/pages/UserPage";
import AdminAutomationPage from "@/pages/AdminAutomationPage";

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
      { path: "/run/:castHash", element: <RunningSessionPage /> },
      { path: "/user/:fid", element: <UserPage /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
      { path: "/admin/automation", element: <AdminAutomationPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
