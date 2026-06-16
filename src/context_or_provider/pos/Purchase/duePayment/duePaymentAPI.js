import api from "../../posApi";

export const posDuePaymentAPI = {
    getAll: () => api.get("/api/purchase/due-payments/"),
    getById: (id) => api.get(`/api/purchase/due-payments/${id}/`),
    create: (data) => api.post("/api/purchase/due-payments/", data),
    update: (id, data) => api.patch(`/api/purchase/due-payments/${id}/`, data),
    delete: (id) => api.delete(`/api/purchase/due-payments/${id}/`),
    search: (query) => api.get(`/api/purchase/due-payments/?search=${query}`),
};
