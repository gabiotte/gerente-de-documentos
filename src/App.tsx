import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DocumentsWrapper } from './pages/DocumentsWrapper';
import { ApprovalsWrapper } from './pages/ApprovalsWrapper';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/documents/*"
        element={
          <PrivateRoute>
            <DocumentsWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/approvals/*"
        element={
          <PrivateRoute>
            <ApprovalsWrapper />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
