import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";
import { HomePage } from "../features/portfolio/pages/HomePage";
import { NotFoundPage } from "../features/portfolio/pages/NotFoundPage";
import { PortfolioAreaPage } from "../features/portfolio/pages/PortfolioAreaPage";
import { ProjectDetailsPage } from "../features/portfolio/pages/ProjectDetailsPage";
import { AdminLoginPage } from "../features/admin/pages/AdminLoginPage";
import { AdminProtectedRoute } from "../features/admin/components/AdminProtectedRoute";
import { AdminSettingsPage } from "../features/admin/pages/AdminSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "web",
        element: <PortfolioAreaPage areaSlug="web"/>,
      },
      {
        path: "data-analytics",
        element: <PortfolioAreaPage areaSlug="data-analytics"/>,
      },
      {
        path: "automation",
        element: <PortfolioAreaPage areaSlug="automation"/>,
      },
      {
        path: "game",
        element: <PortfolioAreaPage areaSlug="game"/>,
      },
      {
        path: "project/:projectSlug",
        element: <ProjectDetailsPage />,
      },
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "admin",
        element: (
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/settings",
        element: (
          <AdminProtectedRoute>
            <AdminSettingsPage />
          </AdminProtectedRoute>
        ),
      },
      
      
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);