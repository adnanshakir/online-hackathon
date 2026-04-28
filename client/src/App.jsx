import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import PublicStatus from '@/pages/public/PublicStatus';
import Dashboard from '@/pages/app/Dashboard';
import IncidentsList from '@/pages/app/IncidentsList';
import Team from '@/pages/app/Team';
import StatusPageSettings from '@/pages/app/StatusPageSettings';
import Settings from '@/pages/app/Settings';
import IncidentDetail from '@/pages/incident/IncidentDetail';
import Postmortem from '@/pages/incident/Postmortem';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/status/:teamSlug" element={<PublicStatus />} />

        {/* App shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incidents" element={<IncidentsList />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="incidents/:id/postmortem" element={<Postmortem />} />
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
