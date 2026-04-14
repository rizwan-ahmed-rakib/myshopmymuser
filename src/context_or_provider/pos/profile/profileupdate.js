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
export const employeeAPI = {
    // Get all employees
    getAll: () => api.get("/api/users/allProfile/"),

    // Get single employee by ID
    getById: (id) => api.get(`/api/users/allProfile/${id}/`),

    // Create new employee
    create: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'user' && typeof data[key] === 'object') {
                Object.keys(data[key]).forEach(userKey => {
                    formData.append(`user.${userKey}`, data[key][userKey]);
                });
            } else if (key === 'profile_picture' && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.post("/api/users/create-new-user-with-profile/", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Update employee
    update: (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'profile_picture' && data[key]) {
                formData.append(key, data[key]);
            } else if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return api.patch(`/api/users/allProfile/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete employee
    delete: (id) => api.delete(`/api/users/allProfile/${id}/`),
};