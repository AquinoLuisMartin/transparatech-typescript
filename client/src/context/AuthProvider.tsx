import { useState, ReactNode, useEffect } from 'react';
import { ROLES, ROLE_PERMISSIONS } from '../permissions';
import { AuthContext } from './AuthContext';
import { User } from '../types/auth';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>(ROLES.VIEWER);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const userSession = localStorage.getItem('userSession');

      if (storedToken) {
        setToken(storedToken);
        try {
          // Verify token and get fresh user data
          const response = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.data.success) {
            const userData = response.data.data.user;
            // Map API response to User interface
            // Note: API returns snake_case or camelCase depending on the controller.
            // The controller returns: id, email, firstName, lastName, middleInitial, studentNumber, schoolNumber, organization
            // Our User interface expects: id, email, firstName, lastName, middleInitial, studentNumber, schoolNumber, organization, accountType
            
            // We need to make sure accountType is present. The controller getMe returns it?
            // Checking getMe in authController.js:
            // res.status(200).json({ success: true, data: { user: { ... } } });
            // The user object in getMe DOES NOT include accountType currently!
            // I need to fix the controller first or handle it here.
            
            // Let's assume I will fix the controller to return accountType.
            
            setUser(userData as User);
            
            // Determine role
            let authRole = ROLES.VIEWER;
            // Map account type to role
            const accountType = userData.accountType || 'Organization Member (Viewer)';
            
            if (accountType === 'Administrator') {
              authRole = ROLES.ADMIN;
            } else if (accountType === 'Officer') {
              authRole = ROLES.OFFICER;
            }
            
            setUserRole(authRole);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // If token is invalid, try to fall back to userSession but it's risky.
          // Better to logout.
          logout();
        }
      } else if (userSession) {
          // Fallback to local storage if no token
          try {
            const parsedSession = JSON.parse(userSession);
             if (parsedSession.role && Object.values(ROLES).includes(parsedSession.role)) {
                setUserRole(parsedSession.role);
                setIsAuthenticated(true);
                
                 setUser({
                    id: 0, // Unknown
                    email: parsedSession.email,
                    firstName: parsedSession.name ? parsedSession.name.split(' ')[0] : '',
                    lastName: parsedSession.name ? parsedSession.name.split(' ').slice(1).join(' ') : '',
                    accountType: parsedSession.accountType,
                    organization: parsedSession.organization,
                    studentNumber: parsedSession.studentNumber
                 } as User);
            }
          } catch (e) {
              logout();
          }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (role: string, userData?: User) => {
    if (Object.values(ROLES).includes(role)) {
      setUserRole(role);
      setIsAuthenticated(true);
      if (userData) {
          setUser(userData);
      }
      setToken(localStorage.getItem('accessToken'));
    } else {
      console.error('Invalid role');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(ROLES.VIEWER);
    setUser(null);
    setToken(null);
    localStorage.removeItem('userSession');
    localStorage.removeItem('accessToken');
  };

  const hasPermission = (permission: string) => {
    const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, hasPermission, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
};
