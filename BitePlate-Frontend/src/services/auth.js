import { authAPI } from './api';

export const authService = {
    async register(userData) {
        const response = await authAPI.register(userData);
        return response.data;
    },

    async login(email, password) {
        const response = await authAPI.login({ email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    async getCurrentStaff() {
        const response = await authAPI.getCurrentStaff();
        return response.data.data;
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;