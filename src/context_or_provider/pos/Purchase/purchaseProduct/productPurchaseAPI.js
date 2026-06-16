import api from "../../posApi";

export const posPurchaseProductAPI = {

    getAll: () => api.get("/api/purchase/purchases/"),

    search: (query) => api.get(`/api/purchase/purchases/?search=${query}`),

    getById: (id) => api.get(`/api/purchase/purchases/${id}/`),

    create: (data) => api.post("/api/purchase/purchases/", data),

    update: (id, data) => api.patch(`/api/purchase/purchases/${id}/`, data),

    delete: (id) => api.delete(`/api/purchase/purchases/${id}/`),
};
