// utils/api.js
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";

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
export const posCategoryAPI = {
    // Get all categories
    getAll: () => api.get("/api/products/category/"),

    // Get single category by ID
    getById: (id) => api.get(`/api/products/category/${id}/`),

    // Create new category
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else {
                if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    formData.append(key, data[key]);
                }
            }
        });
        return api.post("/api/products/category/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Update category
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/api/products/category/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete category
    delete: (id) => api.delete(`/api/products/category/${id}/`),
};
