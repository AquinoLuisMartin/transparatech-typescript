import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PERMISSIONS } from '../permissions';
import { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  const canAccess = hasPermission(PERMISSIONS.CAN_VIEW_TRANSPARENCY);

  return canAccess ? <>{children}</> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
