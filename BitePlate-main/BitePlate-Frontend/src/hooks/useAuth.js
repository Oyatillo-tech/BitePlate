import { useAppStore } from '../store/useAppStore';
import authService from '../services/auth';

export const useAuth = () => {
    const user = useAppStore((state) => state.user);
    const setUser = useAppStore((state) => state.setUser);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        setUser(response.data);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = !!user;
    const hasRole = (role) => user?.role === role;
    const canAccess = (roles) => roles.includes(user?.role);

    return {
        user,
        login,
        logout,
        isAuthenticated,
        hasRole,
        canAccess,
    };
};

export default useAuth;