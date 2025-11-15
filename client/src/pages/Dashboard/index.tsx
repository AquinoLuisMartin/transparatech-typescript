import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../permissions';

const Dashboard = () => {
  const { userRole, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  switch (userRole) {
    case ROLES.ADMIN:
      return <Navigate to="/dashboard/admin" />;
    case ROLES.OFFICER:
      return <Navigate to="/dashboard/officer" />;
    case ROLES.VIEWER:
      return <Navigate to="/dashboard/viewer" />;
    default:
      return <Navigate to="/auth/signin" />;
  }
};

export default Dashboard;
