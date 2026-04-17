import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (user) return <Navigate to="/" replace />;
  return children;
}
