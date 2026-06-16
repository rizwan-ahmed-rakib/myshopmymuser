import api from "../../posApi";

export const posSaleProductAPI = {
    getAll: () => api.get("/api/sale/sales/"),

    search: (query) => api.get(`/api/sale/sales/?search=${query}`),

    getById: (id) => api.get(`/api/sale/sales/${id}/`),

    // ✅ FIXED CREATE
    create: (data) => {
        return api.post(
            "/api/sale/sales/",
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    // ✅ FIXED UPDATE
    update: (id, data) => {
        return api.patch(
            `/api/sale/sales/${id}/`,
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    delete: (id) => api.delete(`/api/sale/sales/${id}/`),
};
