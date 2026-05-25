import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Menu API
export const menuAPI = {
    getAll: () => api.get('/menu'),
    getByType: (type) => api.get(`/menu/type/${type}`),
    getById: (id) => api.get(`/menu/${id}`),
    create: (data) => api.post('/menu', data),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getById: (id) => api.get(`/orders/${id}`),
    confirm: (id) => api.put(`/orders/${id}/confirm`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    getHistory: () => api.get('/orders/history/analytics'),
};

// Tables API
export const tablesAPI = {
    getAll: () => api.get('/tables'),
    getAvailable: (partySize) => api.get('/tables/available', { params: { partySize } }),
    seat: (id) => api.put(`/tables/${id}/seat`),
    clear: (id) => api.put(`/tables/${id}/clear`),
};

// Bills API
export const billsAPI = {
    generate: (orderId, data) => api.post(`/bills/${orderId}/generate`, data),
    addTip: (billId, tip) => api.put(`/bills/${billId}/tip`, { tip }),
    pay: (billId, method) => api.put(`/bills/${billId}/pay/${method}`),
};

export default api;