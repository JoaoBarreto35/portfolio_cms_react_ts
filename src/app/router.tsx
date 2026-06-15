import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";
import { HomePage } from "../features/portfolio/pages/HomePage";
import { NotFoundPage } from "../features/portfolio/pages/NotFoundPage";
import { PortfolioAreaPage } from "../features/portfolio/pages/PortfolioAreaPage";
import { ProjectDetailsPage } from "../features/portfolio/pages/ProjectDetailsPage";

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
        element: <PortfolioAreaPage />,
      },
      {
        path: "data-analytics",
        element: <PortfolioAreaPage />,
      },
      {
        path: "automation",
        element: <PortfolioAreaPage />,
      },
      {
        path: "game",
        element: <PortfolioAreaPage />,
      },
      {
        path: "project/:projectSlug",
        element: <ProjectDetailsPage />,
      },
      {
        path: "admin",
        element: <AdminDashboardPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);