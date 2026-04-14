// // utils/api.js
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
//
// // Create axios instance with base URL
// const api = axios.create({
//     baseURL: BASE_URL_of_POS,
//     headers: {
//         "Content-Type": "multipart/form-data",
//     },
// });
//
// // Add request interceptor for auth token if needed
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// // API endpoints for Salary Advances
// export const employeeAttendanceAPI = {
//     // Get all salary advances
//     getAll: () => api.get("/api/attendance/attendance/"),
//
//     // Get single salary advance by ID
//     getById: (id) => api.get(`/api/attendance/attendance/${id}/`),
//
//     // Create new salary advance
//     create: (data) => api.post("/api/attendance/attendance/", data),
//
//     // Update salary advance
//     update: (id, data) => api.patch(`/api/attendance/attendance/${id}/`, data),
//
//     // Delete salary advance
//     delete: (id) => api.delete(`/api/attendance/attendance/${id}/`),
//
//     // Get salary advances by user
//     getByUser: (userId) => api.get(`/api/attendance/attendance/?user=${userId}`),
//
//     // Get approved salary advances
//     getApproved: () => api.get("/api/attendance/attendance/?is_approved=true"),
//
//     // Get pending salary advances
//     getPending: () => api.get("/api/attendance/attendance/?is_approved=false"),
//
//     // Approve salary advance
//     approve: (id, data) => api.patch(`/api/attendance/attendance/${id}/`, {
//         is_approved: true,
//         approved_date: data?.approved_date || new Date().toISOString().split('T')[0]
//     }),
// };



// employeeAttendanceAPI.js

import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";

const API_URL = `${BASE_URL_of_POS}/api/attendance/attendance/`;

export const employeeAttendanceAPI = {
    // ✅ GET all attendance records with pagination support
    getAll: async (page = 1, pageSize = 10, filters = {}) => {
        let url = `${API_URL}?page=${page}&page_size=${pageSize}`;

        // Add filters if any
        if (filters.date_from) url += `&date__gte=${filters.date_from}`;
        if (filters.date_to) url += `&date__lte=${filters.date_to}`;
        if (filters.is_present !== undefined) url += `&is_present=${filters.is_present}`;
        if (filters.marketing_officer) url += `&marketing_officer=${filters.marketing_officer}`;

        const response = await axios.get(url);
        return response;
    },

    // ✅ GET single attendance record
    getById: async (id) => {
        const response = await axios.get(`${API_URL}${id}/`);
        return response;
    },

    // ✅ CREATE new attendance record
    create: async (formData) => {
        const response = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    },

    // ✅ UPDATE attendance record
    update: async (id, formData) => {
        const response = await axios.put(`${API_URL}${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    },

    // ✅ DELETE attendance record
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}${id}/`);
        return response;
    },
};