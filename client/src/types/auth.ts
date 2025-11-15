export type AuthContextType = {
    isAuthenticated: boolean;
    userRole: string | null;
    login: (role: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    isLoading: boolean;
};