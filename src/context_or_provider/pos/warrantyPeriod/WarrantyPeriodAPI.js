import api from "../posApi";

export const posWarrantyPeriodAPI = {
    getAll: () => api.get('/api/products/warrantyPeriod/'),
    getById: (id) => api.get(`/api/products/warrantyPeriod/${id}/`),
    create: (data) => api.post('/api/products/warrantyPeriod/', data),
    update: (id, data) => api.patch(`/api/products/warrantyPeriod/${id}/`, data),
    delete: (id) => api.delete(`/api/products/warrantyPeriod/${id}/`),
};
