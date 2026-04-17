import axios from 'axios';
import BASE_URL_of_POS from '../../../posConfig';

const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const posWarrantyPeriodAPI = {
    getAll: () => api.get('/api/products/warrantyPeriod/'),
    getById: (id) => api.get(`/api/products/warrantyPeriod/${id}/`),
    create: (data) => api.post('/api/products/warrantyPeriod/', data),
    update: (id, data) => api.patch(`/api/products/warrantyPeriod/${id}/`, data),
    delete: (id) => api.delete(`/api/products/warrantyPeriod/${id}/`),
};
