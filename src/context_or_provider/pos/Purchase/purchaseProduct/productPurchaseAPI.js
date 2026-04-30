// utils/api.js
import axios from "axios";
import BASE_URL_of_POS from "../../../../posConfig";

// Create axios instance with base URL
const api = axios.create({
    baseURL: BASE_URL_of_POS,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API endpoints
export const posPurchaseProductAPI = {

    getAll: () => api.get("/api/purchase/purchases/"),

    search: (query) => api.get(`/api/purchase/purchases/?search=${query}`),

    getById: (id) => api.get(`/api/purchase/purchases/${id}/`),

    create: (data) => api.post("/api/purchase/purchases/", data),

    update: (id, data) => api.patch(`/api/purchase/purchases/${id}/`, data),

    delete: (id) => api.delete(`/api/purchase/purchases/${id}/`),
};
