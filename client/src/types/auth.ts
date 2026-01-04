export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  studentNumber?: string;
  schoolNumber?: string;
  organization?: string;
  accountType: string;
  roleId?: number;
}

export type AuthContextType = {
    isAuthenticated: boolean;
    userRole: string | null;
    user: User | null;
    login: (role: string, userData?: User) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    isLoading: boolean;
    token: string | null;
};