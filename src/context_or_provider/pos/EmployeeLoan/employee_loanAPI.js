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

// API endpoints for Salary Advances
export const employeeLoanAPI = {
    // Get all salary advances
    getAll: () => api.get("/api/users/employee-loans/"),

    // Get single salary advance by ID
    getById: (id) => api.get(`/api/users/employee-loans/${id}/`),

    // Create new salary advance
    create: (data) => api.post("/api/users/employee-loans/", data),

    // Update salary advance
    update: (id, data) => api.patch(`/api/users/employee-loans/${id}/`, data),

    // Delete salary advance
    delete: (id) => api.delete(`/api/users/employee-loans/${id}/`),

    // Get salary advances by user
    getByUser: (userId) => api.get(`/api/users/employee-loans/?user=${userId}`),

    // Get approved salary advances
    getApproved: () => api.get("/api/users/employee-loans/?is_approved=true"),

    // Get pending salary advances
    getPending: () => api.get("/api/users/employee-loans/?is_approved=false"),

    // Approve salary advance
    approve: (id, data) => api.patch(`/api/users/employee-loans/${id}/`, {
        is_approved: true,
        approved_date: data?.approved_date || new Date().toISOString().split('T')[0]
    }),
};
