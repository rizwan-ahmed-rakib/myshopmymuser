import api from "../../posApi";

export const posSaleReturnAPI = {
    getAll: () => api.get("/api/sale/sale-returns/"),

    getById: (id) => api.get(`/api/sale/sale-returns/${id}/`),

    // ✅ FIXED CREATE
    create: (data) => {
        return api.post(
            "/api/sale/sale-returns/",
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    // ✅ FIXED UPDATE
    update: (id, data) => {
        return api.patch(
            `/api/sale/sale-returns/${id}/`,
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    delete: (id) => api.delete(`/api/sale/sale-returns/${id}/`),
};
