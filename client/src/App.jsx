import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import PublicStatus from '@/pages/public/PublicStatus';
import WorkspaceDecision from '@/pages/auth/WorkspaceDecision';
import Dashboard from '@/pages/app/Dashboard';
import IncidentsList from '@/pages/app/IncidentsList';
import Team from '@/pages/app/Team';
import StatusPageSettings from '@/pages/app/StatusPageSettings';
import Settings from '@/pages/app/Settings';
import IncidentDetail from '@/pages/incident/IncidentDetail';
import Postmortem from '@/pages/incident/Postmortem';
import ServiceSetup from '@/pages/auth/ServiceSetup';
import VerifyEmail from '@/pages/public/VerifyEmail';
import Services from '@/pages/app/Services';

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuthStore } from '@/store/authStore';
import { isDemoMode } from '@/lib/demo';

function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialCheckDone = useAuthStore((s) => s.isInitialCheckDone);

  // Demo sessions stay "authenticated" but should still be free to roam the
  // public site — otherwise the logo and any /login link trap them in /app.
  if (isAuthenticated && !isDemoMode()) {
    // Logged in but no workspace → workspace decision screen
    if (!user?.workspace) return <Navigate to="/workspace-decision" replace />;
    return <Navigate to="/app/dashboard" replace />;
  }

  if (!isInitialCheckDone) {
    return null; // Keep screen clean while checking session
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node,
};

/**
 * Route for users who are logged in but MUST choose a workspace.
 */
function WorkspaceDecisionRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialCheckDone = useAuthStore((s) => s.isInitialCheckDone);

  if (!isInitialCheckDone) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Allow access to service-setup even if workspace exists
  const isServiceSetup = window.location.pathname === '/service-setup';
  if (user?.workspace && !isServiceSetup)
    return <Navigate to="/app/dashboard" replace />;

  return children;
}

WorkspaceDecisionRoute.propTypes = {
  children: PropTypes.node,
};

export default function App() {
  const setInitialCheckDone = useAuthStore((s) => s.setInitialCheckDone);

  // Initial session bootstrap — runs once on mount to reconcile cookie state
  // with localStorage. In demo mode auth.me() returns DEMO_USER synchronously
  // without hitting the backend, so this is fast and offline-safe.
  useEffect(() => {
    setInitialCheckDone(true);
  }, [setInitialCheckDone]);

  // Session heartbeat removed: the /auth/me endpoint is not stable yet and
  // polling caused unintended auth state churn. Reintroduce only when
  // backend `/auth/me` is implemented and stable.

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/s/:teamSlug" element={<PublicStatus />} />
        {/* Email verification target — links from the verification email
            land here. Always reachable (no auth gate) so anonymous clicks
            still work, e.g. when the user is signed out on this device. */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Workspace Decision & Service Setup */}
        <Route
          path="/workspace-decision"
          element={
            <WorkspaceDecisionRoute>
              <WorkspaceDecision />
            </WorkspaceDecisionRoute>
          }
        />
        <Route
          path="/service-setup"
          element={
            <WorkspaceDecisionRoute>
              <ServiceSetup />
            </WorkspaceDecisionRoute>
          }
        />

        {/* Convenience redirects */}
        <Route
          path="/dashboard"
          element={<Navigate to="/app/dashboard" replace />}
        />

        {/* App shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incidents" element={<IncidentsList />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="incidents/:id/postmortem" element={<Postmortem />} />
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="status" element={<StatusPageSettings />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </>
  );
}
