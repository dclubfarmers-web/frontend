import { Navigate } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const isAdmin = user && user.role === 'admin';

  if (loading) return <Loader fullPage={true} />;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
