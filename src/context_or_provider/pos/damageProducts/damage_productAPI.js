import api from "../posApi";

export const posDamageProductAPI = {
    // Get all damage records
    getAll: (params) => api.get("/api/products/damage-stock/", { params }),

    // Search damage records
    search: (query) => api.get(`/api/products/damage-stock/?search=${query}`),

    // Get single damage record by ID
    getById: (id) => api.get(`/api/products/damage-stock/${id}/`),

    // Create new damage record
    create: (data) => api.post("/api/products/damage-stock/", data),

    // Update damage record
    update: (id, data) => api.patch(`/api/products/damage-stock/${id}/`, data),

    // Delete damage record
    delete: (id) => api.delete(`/api/products/damage-stock/${id}/`),

    // Get damage summary/stats
    getSummary: () => api.get("/api/products/damage-stock/summary/"),

    // Get reports
    getProductWiseReport: (params) => api.get("/api/products/damage-stock/product_wise_report/", { params }),
    getSupplierWiseReport: (params) => api.get("/api/products/damage-stock/supplier_wise_report/", { params }),
    getMonthlyTrend: (params) => api.get("/api/products/damage-stock/monthly_trend/", { params }),
};

export default posDamageProductAPI;
