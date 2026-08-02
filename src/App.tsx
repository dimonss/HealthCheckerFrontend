import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { EndpointDetailPage } from './pages/EndpointDetailPage/EndpointDetailPage';
import { AcceptInvitePage } from './pages/AcceptInvitePage/AcceptInvitePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/endpoint/:id" element={<EndpointDetailPage />} />
      </Route>
      
      <Route path="/invite/:token" element={<AcceptInvitePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
