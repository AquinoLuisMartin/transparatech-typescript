import { useState, ReactNode, useEffect } from 'react';
import { ROLES, ROLE_PERMISSIONS } from '../permissions';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>(ROLES.VIEWER);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const parsedSession = JSON.parse(userSession);
        if (parsedSession.role && Object.values(ROLES).includes(parsedSession.role)) {
          setUserRole(parsedSession.role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing user session from localStorage:', error);
        localStorage.removeItem('userSession');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: string) => {
    if (Object.values(ROLES).includes(role)) {
      setUserRole(role);
      setIsAuthenticated(true);
    } else {
      console.error('Invalid role');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(ROLES.VIEWER);
    localStorage.removeItem('userSession');
  };

  const hasPermission = (permission: string) => {
    const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
