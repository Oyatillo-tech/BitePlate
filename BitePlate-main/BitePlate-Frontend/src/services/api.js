import axios from 'axios';

const API_URL = '/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentStaff: () => api.get('/auth/me'),
    updatePassword: (data) => api.put('/auth/password', data),
};

// Menu API
export const menuAPI = {
    getAll: () => api.get('/menu'),
    getByType: (type) => api.get(`/menu/type/${type}`),
    search: (query) => api.get('/menu/search', { params: { query } }),
    getById: (id) => api.get(`/menu/${id}`),
    create: (data) => api.post('/menu', data),
    update: (id, data) => api.put(`/menu/${id}`, data),
    delete: (id) => api.delete(`/menu/${id}`),
    toggleAvailability: (id) => api.put(`/menu/${id}/toggle`),
    getVegan: () => api.get('/menu/vegan'),
    getCombos: () => api.get('/menu/combos'),
    getComboById: (id) => api.get(`/menu/combos/${id}`),
    createCombo: (data) => api.post('/menu/combos', data),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getById: (id) => api.get(`/orders/${id}`),
    getAll: () => api.get('/orders/today'),
    getHistory: () => api.get('/orders/history'),
    confirm: (id) => api.put(`/orders/${id}/confirm`),
    complete: (id) => api.put(`/orders/${id}/complete`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    addItem: (id, item) => api.post(`/orders/${id}/item`, item),
    removeItem: (orderId, itemId) => api.delete(`/orders/${orderId}/item/${itemId}`),
    applyDiscount: (id, percentage) => api.put(`/orders/${id}/discount`, { discountPercentage: percentage }),
    getByTable: (tableId) => api.get(`/orders/table/${tableId}`),
};

// Tables API
export const tablesAPI = {
    getAll: () => api.get('/tables'),
    getById: (id) => api.get(`/tables/${id}`),
    getStatus: () => api.get('/tables/status'),
    getAvailable: (partySize) => api.get('/tables/available', { params: { partySize } }),
    getOccupied: () => api.get('/tables/occupied'),
    getFree: () => api.get('/tables/free'),
    seat: (id) => api.put(`/tables/${id}/seat`),
    clear: (id) => api.put(`/tables/${id}/clear`),
    reserve: (id) => api.put(`/tables/${id}/reserve`),
    awaitBill: (id) => api.put(`/tables/${id}/bill`),
    create: (data) => api.post('/tables', data),
    delete: (id) => api.delete(`/tables/${id}`),
};

// Bills API
export const billsAPI = {
    generate: (orderId, data) => api.post(`/bills/${orderId}/generate`, data),
    getById: (id) => api.get(`/bills/${id}`),
    getByOrder: (orderId) => api.get(`/bills/order/${orderId}`),
    getPending: () => api.get('/bills'),
    addTip: (id, tip) => api.put(`/bills/${id}/tip`, { tip }),
    pay: (id, method) => api.put(`/bills/${id}/pay`, { paymentMethod: method }),
    refund: (id) => api.put(`/bills/${id}/refund`),
    split: (id, splits) => api.post(`/bills/${id}/split`, { splits }),
    paySplit: (splitId, method) => api.put(`/bills/splits/${splitId}/pay`, { paymentMethod: method }),
    getRevenue: (days) => api.get('/bills/revenue/total', { params: { days } }),
};

// Kitchen API
export const kitchenAPI = {
    getQueue: () => api.get('/kitchen/queue'),
    getOrder: (id) => api.get(`/kitchen/${id}`),
    updateStatus: (id, status) => api.put(`/kitchen/${id}/status`, { status }),
    reprioritize: (id, priority) => api.put(`/kitchen/${id}/priority`, { priority }),
    complete: (id) => api.put(`/kitchen/${id}/complete`),
    getStats: () => api.get('/kitchen/stats'),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getRevenue: (days) => api.get('/analytics/revenue', { params: { days } }),
    getItems: () => api.get('/analytics/items'),
    getStaff: () => api.get('/analytics/staff'),
    getTables: () => api.get('/analytics/tables'),
    getPeakHours: () => api.get('/analytics/peak-hours'),
    getPaymentMethods: () => api.get('/analytics/payment-methods'),
};

// Reservations API
export const reservationsAPI = {
    create: (data) => api.post('/reservations', data),
    getById: (id) => api.get(`/reservations/${id}`),
    getByDate: (date) => api.get('/reservations/date/search', { params: { date } }),
    getUpcoming: (hours) => api.get('/reservations/upcoming/list', { params: { hours } }),
    cancel: (id) => api.put(`/reservations/${id}/cancel`),
    complete: (id) => api.put(`/reservations/${id}/complete`),
};

export default api;