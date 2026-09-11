import api from "../posApi";

export const posHoldQuotationAPI = {
    getAll: (params) => api.get("/api/hold_and_quotation/holds-or-quotation/", { params }),
    getById: (id) => api.get(`/api/hold_and_quotation/holds-or-quotation/${id}/`),
    create: (data) => api.post("/api/hold_and_quotation/holds-or-quotation/", data),
    update: (id, data) => api.put(`/api/hold_and_quotation/holds-or-quotation/${id}/`, data),
    delete: (id) => api.delete(`/api/hold_and_quotation/holds-or-quotation/${id}/`),
    convertToSale: (id) => api.post(`/api/hold_and_quotation/holds-or-quotation/${id}/convert_to_sale/`),
    convertToPurchase: (id) => api.post(`/api/hold_and_quotation/holds-or-quotation/${id}/convert_to_purchase/`),
};
