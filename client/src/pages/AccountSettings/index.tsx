import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../permissions';
import AdminAccountSettings from './AdminAccountSettings';
import OfficerAccountSettings from './OfficerAccountSettings';

const AccountSettings: React.FC = () => {
  const { userRole } = useAuth();

  // Check if user is an admin (either full admin or approval admin)
  const isAdmin = userRole === ROLES.ADMIN_FULL || userRole === ROLES.ADMIN_APPROVAL;

  if (isAdmin) {
    return <AdminAccountSettings />;
  }

  return <OfficerAccountSettings />;
};

export default AccountSettings;