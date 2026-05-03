import axios from "axios";
import BASE_URL_of_POS from "../../../../posConfig";

const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        "Content-Type": "application/json",
    },
});

export const posDuePaymentAPI = {
    getAll: () => api.get("/api/purchase/due-payments/"),
    getById: (id) => api.get(`/api/purchase/due-payments/${id}/`),
    create: (data) => api.post("/api/purchase/due-payments/", data),
    update: (id, data) => api.patch(`/api/purchase/due-payments/${id}/`, data),
    delete: (id) => api.delete(`/api/purchase/due-payments/${id}/`),
    search: (query) => api.get(`/api/purchase/due-payments/?search=${query}`),
};
