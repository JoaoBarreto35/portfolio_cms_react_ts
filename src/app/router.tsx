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
import { AdminContactLinksPage } from "../features/admin/pages/AdminContactLinksPage";
import { AdminProjectsPage } from "../features/admin/pages/AdminProjectsPage";
import { AdminProjectEditorPage } from "../features/admin/pages/AdminProjectEditorPage";
import { AdminProjectTechnologiesPage } from "../features/admin/pages/AdminProjectTechnologiesPage";
import { AdminProjectLinksPage } from "../features/admin/pages/AdminProjectLinksPage";
import { AdminPortfolioPagesPage } from "../features/admin/pages/AdminPortfolioPagesPage";
import { AdminProjectImagesPage } from "../features/admin/pages/AdminProjectImagesPage";
import { AdminPortfolioPageProjectsPage } from "../features/admin/pages/AdminPortfolioPageProjectsPage";
import { AdminPortfolioPageHighlightsPage } from "../features/admin/pages/AdminPortfolioPageHighlightsPage";
import { AdminExperiencesPage } from "../features/admin/pages/AdminExperiencesPage";


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
        path: "admin/contact-links",
        element: (
          <AdminProtectedRoute>
            <AdminContactLinksPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects",
        element: (
          <AdminProtectedRoute>
            <AdminProjectsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects/new",
        element: (
          <AdminProtectedRoute>
            <AdminProjectEditorPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects/:projectSlug",
        element: (
          <AdminProtectedRoute>
            <AdminProjectEditorPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects/:projectSlug/technologies",
        element: (
          <AdminProtectedRoute>
            <AdminProjectTechnologiesPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects/:projectSlug/links",
        element: (
          <AdminProtectedRoute>
            <AdminProjectLinksPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/projects/:projectSlug/images",
        element: (
          <AdminProtectedRoute>
            <AdminProjectImagesPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/pages",
        element: (
          <AdminProtectedRoute>
            <AdminPortfolioPagesPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/pages/:pageSlug/projects",
        element: (
          <AdminProtectedRoute>
            <AdminPortfolioPageProjectsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/pages/:pageSlug/highlights",
        element: (
          <AdminProtectedRoute>
            <AdminPortfolioPageHighlightsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "admin/experiences",
        element: (
          <AdminProtectedRoute>
            <AdminExperiencesPage />
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