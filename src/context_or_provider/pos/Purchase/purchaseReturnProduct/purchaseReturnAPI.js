import api from "../../posApi";

export const posPurchaseReturnAPI = {
    getAll: () => api.get("/api/purchase/purchase-returns/"),

    getById: (id) => api.get(`/api/purchase/purchase-returns/${id}/`),

    // ✅ FIXED CREATE
    create: (data) => {
        return api.post(
            "/api/purchase/purchase-returns/",
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    // ✅ FIXED UPDATE
    update: (id, data) => {
        return api.patch(
            `/api/purchase/purchase-returns/${id}/`,
            data,
            { headers: { "Content-Type": "application/json" } }
        );
    },

    delete: (id) => api.delete(`/api/purchase/purchase-returns/${id}/`),
};
